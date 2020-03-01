from appointment.models import ServicesBooking
from appointment.constants import RESERVATION_GAP

__author__ = "anish(dot)s(at)whyunified.com"

from datetime import date, time, datetime, timedelta
from django.test.testcases import TestCase

from accounts.tests.factory import EmployeeFactory
from appointment import TIME_FORMAT
from appointment.tests.factory import ServiceFactory, WorkingTimeFactory, ServicesBookingFactory, CustomDateFactory


class TestServiceModel(TestCase):
    def setUp(self):
        self.service = ServiceFactory.create()
        self.employees = EmployeeFactory.create_batch(3)
        self.employee = self.employees[0]
        self.service.employees.add(*self.employees)
        self.other = EmployeeFactory.create()

        self.chosen_date = date(2018, 11, 7)  # wednesday
        self.chosen_time = time(9, 00)
        self.bad_time = time(13, 00)
        self.workingtime = WorkingTimeFactory.create(employee=self.employee,
                                                     company=self.service.company,
                                                     wednesday_from=self.chosen_time.strftime(TIME_FORMAT),
                                                     wednesday_lunch_from=self.bad_time.strftime(TIME_FORMAT))

    def test_001_prop_total_time(self):
        l = self.service.length + self.service.before + self.service.after
        self.assertEqual(self.service.total_time,
                         l)

    def test_002_has_employee_method(self):
        self.assertTrue(self.service.has_employee(self.employee))
        self.assertFalse(self.service.has_employee(self.other))

    def test_003_check_start_time_validity_employee_working_time(self):
        # check against working time of employee
        self.assertTrue(ServicesBooking.objects.check_availability(employee=self.employee,
                                                                   booked_date=self.chosen_date,
                                                                   tally_start_time=self.chosen_time))
        self.assertFalse(ServicesBooking.objects.check_availability(employee=self.employee,
                                                                    booked_date=self.chosen_date,
                                                                    tally_start_time=self.bad_time))
        # let's book one of them
        ServicesBookingFactory.create(
            employee=self.employee,
            booked_date=self.chosen_date,
            start_time=self.chosen_time
        )
        self.assertFalse(ServicesBooking.objects.check_availability(employee=self.employee,
                                                                    booked_date=self.chosen_date,
                                                                    tally_start_time=self.chosen_time))

    def test_005_check_start_time_validity_custom_working_time(self):
        chosen_time = time(9, 00)
        custom_start = time(11, 0)
        self.custom_date = CustomDateFactory.create(company=None,
                                                    date=self.chosen_date,
                                                    employee=self.employee,
                                                    start_time=custom_start)
        self.assertFalse(ServicesBooking.objects.check_availability(employee=self.employee,
                                                                    booked_date=self.chosen_date,
                                                                    tally_start_time=chosen_time))

    def test_006_check_start_time_validity_custom_day_off(self):
        chosen_time = time(11, 00)
        self.custom_date = CustomDateFactory.create(company=None,
                                                    date=self.chosen_date,
                                                    employee=self.employee,
                                                    is_dayoff=True)
        self.assertFalse(ServicesBooking.objects.check_availability(employee=self.employee,
                                                                    booked_date=self.chosen_date,
                                                                    tally_start_time=chosen_time))

    def test_007_check_availability_company_is_off(self):
        chosen_time = time(9, 00)
        self.custom_date = CustomDateFactory.create(company=self.employee.company,
                                                    date=self.chosen_date,
                                                    employee=None,
                                                    is_dayoff=True)
        self.assertFalse(ServicesBooking.objects.check_availability(employee=self.employee,
                                                                    booked_date=self.chosen_date,
                                                                    tally_start_time=chosen_time))

    def test_008_check_availability_employee_is_day_off(self):
        chosen_time = time(11, 00)
        start = time(11, 00)
        end = time(15, 00)
        self.custom_date = CustomDateFactory.create(company=self.employee.company,
                                                    date=self.chosen_date,
                                                    employee=None,
                                                    start_time=start,
                                                    end_time=end)
        self.custom_date = CustomDateFactory.create(company=None,
                                                    date=self.chosen_date,
                                                    employee=self.employee,
                                                    is_dayoff=True)
        self.assertFalse(ServicesBooking.objects.check_availability(employee=self.employee,
                                                                    booked_date=self.chosen_date,
                                                                    tally_start_time=chosen_time))


class TestCustomDateModel(TestCase):
    def setUp(self):
        self.custom_date = CustomDateFactory.create()

    def test_001_get_broken_times(self):
        times = list(self.custom_date.get_broken_times())
        one = times[0]
        two = times[1]
        self.assertEqual(datetime.combine(date(1900, 1, 1), two) - datetime.combine(date(1900, 1, 1), one),
                         timedelta(minutes=RESERVATION_GAP))
