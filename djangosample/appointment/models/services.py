import os

from datetime import date, time
from datetime import datetime, date, timedelta
from django.core.validators import MinValueValidator
from django.db import models
from django.db.models import Q
from django.utils.translation import ugettext_lazy as _

from appointment import TIME_FORMAT
from appointment.models.bookings import ServicesBooking
from appointment.utils import get_time_from_str
from appointment.constants import RESERVATION_GAP, WORKING_DAYS


class ServiceManager(models.Manager):
    pass


def service_image_upload(instance, filename):
    return os.path.join(str(instance.company.id), "service_images", "{}.{}".format(instance.name, filename.split(".")[-1]))


class Service(models.Model):
    """
     Need to Change Default for name and desciption, adding this just to surpass default errors
     """
    name = models.CharField(_("Name"), max_length=200, default="adding just to pass default")
    status = models.BooleanField(default=True)
    description = models.TextField(_("Descriptoin"), default=" dummy description")
    company = models.ForeignKey("accounts.Company",
                                related_name="services",
                                on_delete=models.CASCADE)
    employees = models.ManyToManyField("accounts.Employee")
    length = models.PositiveIntegerField(_("Service Length"),
                                         validators=(
                                             MinValueValidator(1, "Minimum service length is 1"),
                                         )
                                         )
    before = models.PositiveIntegerField(_("Before"))
    after = models.PositiveIntegerField(_("After"))

    # TRIMMED ...

    def has_employee(self, employee):
        return self.employees.filter(pk=employee.pk).exists()


class WorkingTime(models.Model):
    """
    Company wide working time, every employee is going to get values from this model by default
    this will simply play the part of record... will be responsible for population in EmployeeWorkingTime table
    """
    company = models.OneToOneField("accounts.Company", on_delete=models.CASCADE, blank=True, null=True)
    employee = models.OneToOneField("accounts.Employee", on_delete=models.CASCADE, blank=True, null=True)
    # at most one(company or employee) must be filled
    monday_from = models.TimeField(_(u"Monday From"), blank=True, default=time(9, 30))
    monday_to = models.TimeField(_(u"Monday To"), blank=True, default=time(18, 30))
    monday_lunch_from = models.TimeField(_(u"Monday Lunch From"), blank=True, default=time(12, 30))
    monday_lunch_to = models.TimeField(_(u"Monday Lunch To"), blank=True, default=time(13, 30))
    monday_off = models.BooleanField(_(u"Monday Off"), default=False)
    tuesday_from = models.TimeField(_(u"Tuesday From"), blank=True, default=time(9, 30))

    # TRIMMED ...

    def get_times_by_weekday(self, day):
        import calendar
        weekdays = list(calendar.day_name)
        weekday = weekdays[day].lower()
        return {attr.replace(weekday + '_', ''): getattr(self, attr)
                for attr in self.__dict__.keys() if weekday in attr}

    def get_broken_times(self, day):
        from_to = self.get_times_by_weekday(day)
        start = datetime.combine(date(1900, 1, 1), get_time_from_str(from_to['from']))
        end = datetime.combine(date(1900, 1, 1), get_time_from_str(from_to['to']))

                          # TRIMMED ...
[
                              (start + each * timedelta(minutes=RESERVATION_GAP))
                              for each in range((end - start) // timedelta(minutes=RESERVATION_GAP))
                          ]
                          )
                   )


class CustomDate(models.Model):
    company = models.ForeignKey("accounts.Company", on_delete=models.CASCADE, blank=True, null=True)
    employee = models.ForeignKey("accounts.Employee", on_delete=models.CASCADE, blank=True, null=True)
    # any one of company or employee must be active
    date = models.DateField(_(u"Date"), default=date.today)
    start_time = models.TimeField(_(u"start Time"), blank=True, default=time(9, 30), null=True)
    end_time = models.TimeField(_(u"end Time"), blank=True, default=time(18, 30), null=True)
    start_lunch = models.TimeField(_(u"Start Lunch"), blank=True, default=time(12, 30), null=True)

    def get_broken_times(self):
        """break start to end into RESERVATION_GAP mins gaps"""
        if self.is_dayoff:

            # TRIMMED ...

        return map(lambda y: y.time(),
                   filter(lambda x: not (lunch_start <= x < lunch_end),
                          [
                              (start + each * timedelta(minutes=RESERVATION_GAP))
                              for each in range((end - start) // timedelta(minutes=RESERVATION_GAP))
                          ]
                          )
                   )

    class Meta:
        unique_together = (('employee', 'date'), ('company', 'date'))
