import random
import string
from datetime import timedelta, datetime, date, time

from django.db import models, IntegrityError
from django.db.models import Sum, Q
from django.urls import reverse
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _
from django.utils.crypto import get_random_string

from appointment import TIME_FORMAT
from appointment.tasks import send_sms_task, send_email_task
from appointment.constants import STATUS, DEFAULT_SEND_SMS_BEFORE, DEFAULT_SEND_EMAIL_BEFORE
from libs.constants import PAYMENT
from appointment.utils import get_time_from_str, get_date_from_str
from libs.constants import PAYMENT_CHOICES
from libs.tasks import send_mail
from libs.utils import phone_regex
from main.secure_conf import SENDER_EMAIL


class ServicesBookingManager(models.Manager):
    def get_export_data(self, **filters):
        from appointment.api.filters import ExportServicesBookingFilter
        if not filters:
            raise ValueError("Missing filter params.")
        q = ExportServicesBookingFilter(queryset=self.get_queryset(), data=filters).qs
        return q

    def get_service_employee_availabilities(self, service_id, booked_date, **kwargs):
        """
        based on the given service and booked_date, we return list of employees
        along with their available times
        """
        from appointment.models import Service
        service = Service.objects.get(id=service_id)
        # fixme: the list comprehension -> dict comprehension
        return [
            {emp.id: self.get_availability(emp, booked_date, **kwargs)}
            for emp in service.employees.all()
        ]

    def get_availability(self, employee, booked_date, **kwargs):
        """
        :return: list of {time: available(bool)} pairs
        """

        # exclude the instance, if this is an edit call
        instance = kwargs.get("instance")
        booked_date = get_date_from_str(booked_date)
        day = booked_date.weekday()  # monday=0

        """first we will get all booked services of given date"""
        booked = self.get_queryset().filter(
            employee=employee,
            booked_date=booked_date).exclude(id=getattr(instance, "id", None))

        """second we will break down employee's times at every 30 mins"""
        # PRIORITY of working time flows as custom_company -> custom_employee -> employee_work
        # we will look into company's custom working time

        """
        If company has set custom work time, and also employee has done as well,
        say comp 9-4, emp 11-3,,, choose emp
        say comp 9-3, emp 11-4,,, choose 11-3 ???  << this hasn't been handled yet. manual handling required
        """

	# ...HIDDEN...

    def check_availability(self, booked_date, tally_start_time, employee, **kwargs):
        # ...HIDDEN...

    def get_booked_times(self, employee, booked_date):
        # ...HIDDEN...

    def email_reminder_bookings(self):
        # queryset of those whose reminders were never sent
        return self.get_queryset().filter(
            reminder_email=False,
            booked_date__lte=datetime.now().date()
        )


class ServicesBooking(models.Model):
    service = models.ForeignKey("appointment.Service", on_delete=models.CASCADE)
    booked_date = models.DateField(_("Booked For"), blank=False)
    employee = models.ForeignKey(
        "accounts.Employee",
        on_delete=models.CASCADE,
        blank=False
    )
    start_time = models.TimeField(_("Start Time"), blank=False)
    # ...
    # ...
    # ...
    created = models.DateTimeField(_("Created"), null=True, blank=True)
    modified = models.DateTimeField(_("Modified"), auto_now=True)

    reminder_email = models.BooleanField(_("Reminder Email Sent"), default=False, blank=True)
    reminder_sms = models.BooleanField(_("Reminder SMS Sent"), default=False, blank=True)
    # "calendar_id" ???

    objects = ServicesBookingManager()

    class Meta:
        unique_together = (("employee", "start_time", "booked_date"),)

    @property
    def company(self):
        return self.service.company

    def get_absolute_url(self, request):
        return request.build_absolute_uri(
            reverse("appointment:service-booking-detail", kwargs=dict(company=self.service.company, pk=self.id))
        )

    def get_send_email_url(self, request):
        return request.build_absolute_uri(
            reverse("appointment:service-booking-send-email", kwargs=dict(company=self.service.company.id,
                                                                          pk=self.id))
        )

    def get_send_sms_url(self, request):
        return request.build_absolute_uri(
            reverse("appointment:service-booking-send-sms", kwargs=dict(company=self.service.company.id,
                                                                        pk=self.id))
        )

    def send_email(self, *args, **kwargs):
        to = kwargs.get('to')
        subject = kwargs.get('subject')
        body = kwargs.get('body')
        send_mail(
            subject=subject,
            message=body,
            from_email=SENDER_EMAIL,
            recipient_list=[to]
        )

    def send_sms(self, *args, **kwargs):
        # todo
        raise NotImplementedError("Once sms configuration is done.")

    def send_sms_notification(self, message, send_to_customer, send_to_employee):
        try:
            if send_to_customer:
                self.send_sms(self.booking.client.contact, message)
            if send_to_employee:
                self.send_sms(self.employee.user.contact, message)
        except:
            raise
        return True

    def send_email_notification(self, subject, body, send_to_customer, send_to_employee):
        try:
            if send_to_customer:
                self.send_email(to=self.booking.client.email,
                                subject=subject,
                                body=body)
            if send_to_employee:
                self.send_email(to=self.employee.user.email,
                                subject=subject,
                                body=body)
        except:
            raise
        return True

    # def clean(self):
    #     if self.booking.company:
    #         if self.service.company != self.booking.company:
    #             raise ValueError("Service and Booking's company's don't match")

    def schedule_reminders(self):
        countdown = datetime.combine(self.booked_date, self.start_time) - datetime.now()
        countdown_sms = countdown - timedelta(hours=DEFAULT_SEND_SMS_BEFORE)
        countdown_email = countdown - timedelta(hours=DEFAULT_SEND_EMAIL_BEFORE)
        if countdown_sms > timedelta(minutes=30):
            send_sms_task.apply_async(kwargs={"pk": self.pk}, countdown=countdown_sms.total_seconds())
        if countdown_email > timedelta(minutes=30):
            send_email_task.apply_async(kwargs={"pk": self.pk}, countdown=countdown_email.total_seconds())

    @classmethod
    def get_new_bookings(cls, company):
        q = cls.objects.filter(service__company=company)
        return q.filter(
            booked_date__lte=datetime.today(),
            booked_date__gte=datetime.today() - timedelta(days=6)
        ).count()

    def save(self, *args, **kwargs):
        self.booked_date = get_date_from_str(self.booked_date)
        self.start_time = get_time_from_str(self.start_time)

        # TRIMMED ...

            except ValueError:
                self.start_time = datetime.strptime(self.start_time, '%H:%M:%S').time()
        # initialize the end_times based on service length
        self.end_time = (
            datetime.combine(
                date(1900, 1, 1),
                self.start_time
            ) + timedelta(minutes=self.service.total_time)
        ).time()
        return super(ServicesBooking, self).save(*args, **kwargs)


class BookingModelManager(models.Manager):
    N = 10

    def get_booking_uuid(self):
        return ''.join([random.choice(string.ascii_uppercase + string.digits)
                        for each in range(self.N)])

    def create(self, **kwargs):
        if 'booking_id' not in kwargs:
            kwargs.update(dict(booking_id=self.get_booking_uuid()))

        try:
            instance = Booking(**kwargs)
            instance.save()
            return instance
        except IntegrityError:
            kwargs.update(dict(booking_id=self.get_booking_uuid()))
            self.create(**kwargs)


class Booking(models.Model):
    STATUS_CHOICES = [
        (STATUS.pending, _("pending")),
        (STATUS.confirmed, _("confirmed")),
        (STATUS.cancelled, _("cancelled")),
    ]
    booking_id = models.CharField(
        _("Booking ID"),
        max_length=16,
        unique=True,
        blank=True
    )
    status = models.PositiveSmallIntegerField(_("Status"),
                                              choices=STATUS_CHOICES,
                                              blank=False,
                                              default=STATUS.pending)
    # ...
    # TRIMMED ...

    def get_absolute_url(self, request):
        return request.build_absolute_uri(
            reverse("appointment:booking-detail",
                    kwargs=dict(company=request.parser_context['kwargs']['company'], pk=self.id))
        )

    @property
    def uuid(self):
        return self.booking_id

    @property
    def price(self):
        return "%.2f" % (self.service_bookings.aggregate(
            price=Sum("service__price")
        )['price'] or float(0.0))

    @property
    def tax(self):
        return "%.2f" % (float(getattr(self.company.appointment_configuration, "tax", 10) / 100)

    # ...

    def get_email_kwargs(self):
        services = " | ".join(["{name}({employee}) {date}, {start_time}".format(
            name=each.service.name,
            employee=each.employee.full_name,
            date=each.booked_date,
            start_time=each.start_time
        ) for each in self.service_bookings.all()])
        return {
            "uuid": self.uuid,
            "company": self.company.name,
            "name": self.client.name,
            "contact": self.client.contact,
            "email": self.client.email,
            "notes": self.client.notes,
            "address_one": self.client.address_one,
            "address_two": self.client.address_two,
            "city": self.client.city,
            "state": "",
            "zip": self.client.zip,
            "country": self.client.country,
            "services": services,
            "payment": self.get_payment_display(),
            "price": self.price,
            "deposit": self.deposit,
            "tax": self.tax,
            "total": self.total,
            "cancel_url": "Please Let us know",  # todo
        }

    def send_email(self, *args, **kwargs):
        to = kwargs.get('to')
        subject = kwargs.get('subject')
        body = kwargs.get('body')
        send_mail(
            subject=subject,
            message=body,
            from_email=SENDER_EMAIL,
            recipient_list=[to]
        )

    def send_email_notification(self, subject, body, send_to_customer, send_to_employee):
        try:
            if send_to_customer:
                self.send_email(to=self.client.email,
                                subject=subject,
                                body=body)
            if send_to_employee:
                # send to all employees
                self.send_email(to=list(self.service_bookings.values_list("employee__user__email", flat=True)),
                                subject=subject,
                                body=body)
        except:
            raise
        return True

    def validate_payment(self, payment):
        if payment:
            # adding customer details
            # specially used by authorize.net
            payment.update(dict(
                customer=dict(
                    id="Appointment" + str(self.client_id),
                    email=self.client.email
                ),
                customer_address=dict(
                    first_name=self.client.name,
                    address=self.client.address_one,
                    city=getattr(self.client, "city", ""),
                    zip=getattr(self.client, "zip", ""),
                    country=getattr(self.client, "country", "")
                )
            ))
            self.company.payment_plan.gateway.validate_payment(payment, self)
        else:
            self.status = STATUS.pending
            self.save()

    def confirm_payment(self):
        self.status = STATUS.confirmed
        self.save()

    def decline_payment(self):
        # TODO we need to add a reason for declined payments.
        self.status = STATUS.pending
        self.save()

    objects = BookingModelManager()

    def __str__(self):
        return "booking {}".format(self.uuid)

    def save(self, *args, **kwargs):
        self.booking_id = self.booking_id or get_random_string(12)
        return super(Booking, self).save(*args, **kwargs)

    class Meta:
        permissions = (
            ("access_booking", "Can access Booking Menu"),
        )


class Customer(models.Model):  # todo deprecate this once global Customer is created
    name = models.CharField(_("Full Name"), max_length=225, blank=False)
    email = models.EmailField(_("Email"), blank=False)
    ip_address = models.GenericIPAddressField(
        _("IP address"),
        protocol='IPv4',
        blank=True,
        editable=False,
        null=True)
    contact = models.CharField(
        _("Phone"),
        validators=[phone_regex],
        max_length=16,
        null=True,
        blank=True
    )
    address_one = models.CharField(
        _("Address 1"),
        max_length=1024,
        null=True,
        blank=False
    )
    address_two = models.CharField(
        _("Address 2"),
        max_length=1024,
        null=True,
        blank=True
    )

    # TRIMMED ...

    notes = models.TextField(_("Notes"), blank=True, null=True)

    def delete(self, using=None, keep_parents=False):
        # not deleting the customer info because we can't
        return False
