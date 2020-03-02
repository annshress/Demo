from datetime import datetime

from actstream import action
from django.db import transaction
from django.db.utils import IntegrityError
from django.urls import reverse
from rest_framework import serializers

from appointment import TIME_FORMAT
from appointment.constants import STATUS
from appointment.models import ServicesBooking, Customer, Booking
from appointment.models.configurations import Configuration
from appointment.tasks import send_booking_email_task
from appointment.utils import get_time_from_str
from crm.receivers import crm_contact_signal_handler


class ServicesBookingSerializer(serializers.ModelSerializer):
    send_email = serializers.SerializerMethodField()
    send_sms = serializers.SerializerMethodField()
    price = serializers.SerializerMethodField()

    class Meta:
        model = ServicesBooking
        fields = ["id", "service", "employee", "booked_date", "start_time",
                  "end_time", "price", "send_email", "send_sms"]
        extra_kwargs = dict(
            id=dict(read_only=False, required=False)
        )
        validators = [
            serializers.UniqueTogetherValidator(
                queryset=ServicesBooking.objects.all(),
                fields=('employee', 'booked_date', 'start_time'),
                message="Employee is already booked on given time."
            )
        ]
        # end_time in to_representation

    def run_validators(self, value):
        # before calling we make sure `instance` is pulled using `id`
        if "id" in value:
            self.instance = ServicesBooking.objects.get(id=value["id"])
        super(ServicesBookingSerializer, self).run_validators(value)

    def get_delete(self, obj):
        return obj.get_absolute_url(self.context.get('request'))

    def get_price(self, obj):
        return obj.service.price

    def get_send_email(self, obj):
        return obj.get_send_email_url(self.context.get('request'))

    def get_send_sms(self, obj):
        return obj.get_send_sms_url(self.context.get('request'))

        
        #############
        # TRUNCATED #
        #############

          raise serializers.ValidationError({
                "booked_date": "We don't accept bookings prior {} days".format(
                    conf.accept_booking_prior_days
                )
            }, code="too_soon")
        available = ServicesBooking.objects.check_availability(
            booked_date=booked_date,
            tally_start_time=start_time,
            employee=employee,
            instance=self.instance
        )
        if not available:
            raise serializers.ValidationError({
                "start_time": "Employee cannot be booked at {start_time}".format(start_time=start_time)
            }, code="booked")

    def validate_employee_provides_service(self, attrs):
        """Check if given employee is part of the service"""

        employee = attrs['employee']
        service = attrs['service']
        valid = service.has_employee(
            employee=employee
        )
        if not valid:
            raise serializers.ValidationError(
                {
                    "employee": "Employee is not available for {service}".
                        format(service=service)
                },
                code="incoherent"
            )

    def validate(self, attrs):
        try:
            self.validate_employee_provides_service(attrs)
            self.validate_booked_date_and_time(attrs)
        except KeyError:
            pass
        return attrs

    def to_representation(self, instance):
        data = super(ServicesBookingSerializer, self).to_representation(instance)
        data["end_time"] = instance.end_time.strftime(TIME_FORMAT)
        # data["service"] = str(instance.service)
        # data["employee"] = str(instance.employee.full_name)
        return data


class CustomerModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ["name", "email", "contact", "address_one", "address_two",
                  "country", "city", "zip", "notes", "ip_address"]
        kwargs = {
            "ip_address": {"read_only": True},
        }


class CustomerModelMinimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ["name", "email", "contact"]
        kwargs = {
            "name": {"read_only": True},
            "email": {"read_only": True},
            "contact": {"read_only": True},
        }

    def create(self, validated_data):
        raise NotImplementedError("Not implemented")


class BookingModelSerializer(serializers.ModelSerializer):
    service_bookings = ServicesBookingSerializer(many=True)
    client = CustomerModelSerializer()
    # add_service = serializers.SerializerMethodField()
    commit = serializers.BooleanField(required=False, write_only=True)
    payment_data = serializers.JSONField(required=False, write_only=True)

    class Meta:
        model = Booking
        fields = ["id", "service_bookings", "payment", "client", "status", "price", "tax", "total",
                  "deposit", "created_at", "booking_id", "commit", "payment_data"]
        kwargs = {
            "price": {"read_only": True},
            "tax": {"read_only": True},
            "total": {"read_only": True},
            "deposit": {"read_only": True},
            "created_at": {"read_only": True},
            # "status": {"read_only": True},
        }

    # def get_add_service(self, obj):
    #     return self.context['request'].build_absolute_uri(
    #         reverse("appointment:service-booking-create", kwargs=dict(company=obj.company, booking=obj.id))
    #     )

    def validate_booking_id(self, value):
        if Booking.objects.filter(company=self.context["company"], booking_id=value).exclude(id=getattr(self.instance, "id", None)).exists():
            raise serializers.ValidationError("Booking ID should be unique.")
        return value

    def validate_can_cancel(self, attrs):
        status = attrs.get("status", None)
        if self.instance:
            old_status = self.instance.status
            if (status != old_status) and (status == STATUS.cancelled):
                # check if booking can be cancelled now
                for booked_service in self.instance.service_bookings.all():
                    booked_dt = datetime.combine(booked_service.booked_date,
                                                 get_time_from_str(booked_service.start_time))
                    td = (booked_dt - datetime.now())
                    td_hours = td.days * 24 + td.seconds // 3600
                    conf = Configuration.objects.get_or_create(company=self.context["company"])[0]
                    if td_hours < conf.cancel_bookings_prior:
                        raise serializers.ValidationError({
                            "status": "It's late to cancel this appointment"
                        }, code="too_late")
        return

    def validate_unique_employee_book_date_time(self, attrs):
        _ = list()
        for each in attrs['service_bookings']:
            _.append(
                (each["employee"], each["booked_date"], each["start_time"])
            )
        if len(_) != len(set(_)):
            raise serializers.ValidationError(
                "Seems like you are trying to book same person in two "
                "different services at the same time!"
            )

    def validate(self, attrs):
        if not attrs['service_bookings']:
            raise serializers.ValidationError(
                dict(service_bookings="At least one service has to be booked."),
                code="zero_services"
            )
        try:
            self.validate_can_cancel(attrs)
            self.validate_unique_employee_book_date_time(attrs)
        except KeyError:
            pass
        return attrs

    def create(self, validated_data):
        service_bookings = validated_data.pop('service_bookings')
        client = validated_data.pop('client')
        commit = validated_data.pop("commit", True)
        payment_data = validated_data.pop("payment_data", None)

        try:
            with transaction.atomic():
                # create customer
                cust = Customer(**client)
                cust.save()

                instance = Booking(**validated_data, client=cust)
                instance.save()

                # create service booking, based on the booking instance id
                for each in service_bookings:
                    service_booking = ServicesBooking(**each, booking=instance)
                    service_booking.save()

                if not commit:
                    print("Not committing into database.")
                    raise AssertionError("Checked Out temporarily.")
                instance.validate_payment(payment_data)
        except AssertionError:
            return Booking(**validated_data)

        # create crm contact for the user has booked an appointment.
        crm_contact_signal_handler(instance.__class__,
                                   client=dict(
                                       company=instance.company,
                                       first_name=instance.client.name.split(" ")[0],
                                       last_name=" ".join(instance.client.name.split(" ")[1:]),
                                       email=instance.client.email,
                                       phone=instance.client.contact,
                                       address=dict(
                                           address_line=instance.client.address_one,
                                           country=instance.client.country,
                                           state="",
                                           city=instance.client.city,
                                           street="",
                                           postcode="")
                                   ),
                                   verb="scheduled an appointment",
                                   action_object=instance,
                                   )
        # instance.company = service_booking.company  # handled at service_booking
        # instance.save()

        # finally send email for creation of new booking
        send_booking_email_task.apply_async(kwargs={"pk": instance.pk}, countdown=3)
        return instance

    def update(self, instance, validated_data):
        old_status = instance.status

        service_bookings = validated_data.pop('service_bookings')
        client = validated_data.pop('client')

        # update customer
        Customer.objects.filter(id=instance.client.id).update(**client)
        # update booking
        Booking.objects.filter(id=instance.id).update(**validated_data)
        # create or update service booking
        for each in service_bookings:
            if "id" in each:
                ServicesBooking.objects.filter(id=each["id"]).update(**each)
            else:
                service_booking = ServicesBooking(**each, booking=instance)
                service_booking.save()

        new_status = validated_data["status"]
        instance = super(BookingModelSerializer, self).update(instance, validated_data)
        if old_status != new_status:
            action.send(self.context["request"].user,
                        verb="changed the status to '%s'" % instance.get_status_display(),
                        action_object=instance,
                        target=instance.company)
            # if status has changed, we send the email
            send_booking_email_task.apply_async(kwargs={"pk": instance.pk}, countdown=3)
        return instance

    def __init__(self, *args, **kwargs):
        super(BookingModelSerializer, self).__init__(*args, **kwargs)
        self.fields["service_bookings"].context.update(self.context)
   

class BookingModelMinimalSerializer(serializers.ModelSerializer):
    services = serializers.SerializerMethodField()
    client = CustomerModelMinimalSerializer()
    url = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = ["id", "services", "client", "status", "total","price", "created_at", "url"]

    def get_url(self, obj):
        return obj.get_absolute_url(self.context.get('request'))

    def get_services(self, obj):
        return obj.service_bookings.values('service__name', 'booked_date', 'start_time', 'end_time')

    def create(self, validated_data):
        raise NotImplementedError("Not implemented")
 
    def to_representation(self, instance):
        result = super(BookingModelMinimalSerializer, self).to_representation(instance)

        return result


class ServiceBookingExportSerializer(serializers.ModelSerializer):
    # todo # "employee__name",  # "service__name" # "reminder_email", # "reminder_sms",
    class Meta:
        model = ServicesBooking
        fields = ["id", "modified", "booked_date", "start_time"]  # "booking", "service", "employee"]
        # depth = 2

    def to_representation(self, instance):
        data = super(ServiceBookingExportSerializer, self).to_representation(instance)
        data["client_name"] = instance.booking.client.name
        data["client_email"] = instance.booking.client.email
        data["client_contact"] = instance.booking.client.contact
        data["client_country"] = instance.booking.client.country
        data["client_city"] = instance.booking.client.city
        data["client_zip"] = instance.booking.client.zip
        data["client_address_1"] = instance.booking.client.address_one
        data["client_address_2"] = instance.booking.client.address_two
        data["client_notes"] = instance.booking.client.notes
        data["client_ip"] = instance.booking.client.ip_address

        data["booking_created_at"] = instance.booking.created_at
        data["booking_id"] = instance.booking.booking_id
        data["booking_price"] = instance.booking.price
        data["booking_total"] = instance.booking.total
        data["booking_deposit"] = instance.booking.deposit
        data["booking_tax"] = instance.booking.tax
        data["booking_status"] = instance.booking.get_status_display()
        data["payment_method"] = instance.booking.get_payment_display()

        data["service_price"] = instance.service.price
        data["service_length"] = instance.service.length
        return data

    def create(self, validated_data):
        raise NotImplementedError("ServiceBookingExportSerializer.create")


class ScheduleSerializer(serializers.ModelSerializer):
    booking = BookingModelMinimalSerializer()
    service = serializers.StringRelatedField()
    employee = serializers.StringRelatedField()

    class Meta:
        model = ServicesBooking
        fields = ["id", "service", "employee", "booked_date", "start_time",
                  "end_time", 'booking']

    def to_representation(self, instance):
        data = super(ScheduleSerializer, self).to_representation(instance)
        data["price"] = instance.service.price
        data["length"] = instance.service.length

        week_number = datetime.today().isocalendar()[1]
        month = datetime.today().month
        data['jump_to_choices'] = {
            "month": list(range(month, month + 2)),
            "week": list(range(week_number, week_number + 5))
        }
        return data
