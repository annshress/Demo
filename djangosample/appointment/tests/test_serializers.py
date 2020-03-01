from datetime import datetime, timedelta

from django.test import TestCase
from django.test.client import RequestFactory
from django.urls import reverse
from rest_framework.serializers import ValidationError

from accounts.tests.factory import EmployeeFactory, CompanyFactory
from appointment.api.bookings.serializers import ServicesBookingSerializer, BookingModelSerializer
from appointment.models import Booking, Customer, ServicesBooking
from appointment import DATE_FORMAT, TIME_FORMAT
from appointment.tests.factory import ServicesBookingFactory, ServiceFactory, WorkingTimeFactory
from libs.constants import PAYMENT


class TestServicesBookingSerializer(TestCase):
    def setUp(self):
        self.company = CompanyFactory.create()
        self.employee = EmployeeFactory.create(company=self.company)
        self.service = ServiceFactory.create(company=self.company)
        self.service.employees.add(self.employee)
        self.working_time = WorkingTimeFactory.create(employee=self.employee, company=self.company)
        self.book_date = (datetime.now() + timedelta(days=5)).date()

        self.start_time = self.working_time.get_times_by_weekday(day=self.book_date.weekday())['from']
        self.data = dict(
            service=self.service.pk,
            employee=self.employee.pk,
            booked_date=self.book_date.strftime(DATE_FORMAT),
            start_time=self.start_time
        )
        self.serializer = ServicesBookingSerializer(data=self.data,
                                                    context=dict(company=self.service.company))

    def test_001_valid_booking_service_data(self):
        self.assertTrue(self.serializer.is_valid(), self.serializer.errors)

    def test_002_invalid_customer_chooses_unavailable_time(self):
        self.data.update(dict(start_time="01:00"))  # beyond his schedule

        try:
            self.serializer.is_valid(raise_exception=True)
            self.fail()
        except ValidationError as e:
            self.assertEqual(e.get_codes()['start_time'][0], "booked")

    def test_003_invalid_customer_chooses_bad_start_time(self):
        """In case if available times are 12:00, 1:00,... customer sends 12:15"""
        self.data.update(dict(start_time="01:36"))  # beyond his schedule

        self.service.length = 30
        self.service.save()
        try:
            self.serializer.is_valid(raise_exception=True)
            self.fail()
        except ValidationError as e:
            self.assertEqual(e.get_codes()['start_time'][0], "booked")

    def test_004_invalid_customer_chooses_already_booked_time(self):
        ServicesBookingFactory.create(
            employee=self.employee,
            booked_date=self.book_date.strftime(DATE_FORMAT),
            start_time=self.start_time
        )
        try:
            self.serializer.is_valid(raise_exception=True)
            self.fail()
        except ValidationError as e:
            self.assertEqual(e.get_codes()['non_field_errors'][0], "unique")

    def test_005_invalid_customer_chooses_incoherent_employee_and_service(self):
        self.service.employees.remove(self.employee)
        try:
            self.serializer.is_valid(raise_exception=True)
            self.fail()
        except ValidationError as e:
            self.assertEqual(e.get_codes()['employee'][0], "incoherent")

    def test_006_invalid_service_does_not_belong_to_company(self):
        self.serializer = ServicesBookingSerializer(data=self.data,
                                                    context=dict(company=1000))
        self.assertFalse(self.serializer.is_valid())
        self.assertIn("service", self.serializer.errors)


class TestBookingModelSerializer(TestCase):
    def setUp(self):
        self.employee = EmployeeFactory.create()
        self.service = ServiceFactory.create()
        self.service2 = ServiceFactory.create(company=self.service.company)
        self.service.employees.add(self.employee)
        self.service2.employees.add(self.employee)

        self.employee_working_time = WorkingTimeFactory.create(employee=self.employee)

        self.book_date = datetime.now() + timedelta(days=5)
        self.start_time = self.employee_working_time.get_times_by_weekday(day=1)['from']
        self.start_time2 = self.employee_working_time.get_times_by_weekday(day=2)['from']
        self.service_booking = dict(
            service=self.service.pk,
            employee=self.employee.pk,
            booked_date=self.book_date.strftime(DATE_FORMAT),
            start_time=self.start_time
        )

        self.customer = dict(
            name="anish",
            email="test@ok.com",
            contact="9988445566",
            address_one="duhh1",
            address_two="duhh2",
            country="Nepal",
            city="Kathmandu",
            zip=44811,
            notes="some notes here"
        )
        self.data = dict(
            service_bookings=[self.service_booking],
            payment=PAYMENT.cash,
            client=self.customer
        )
        self.serializer = BookingModelSerializer(data=self.data,
                                                 context=dict(company=self.service.company))

    def test_001_valid_booking_data(self):
        self.assertTrue(self.serializer.is_valid(), self.serializer.errors)

    def test_002_invalid_customer_chooses_unavailable_time(self):
        IND = 0
        self.data['service_bookings'][IND].update(dict(start_time="01:00"))

        self.assertFalse(self.serializer.is_valid())
        self.assertIn("service_bookings", self.serializer.errors)
        self.assertIn("start_time", self.serializer.errors["service_bookings"][IND])

    def test_003_invalid_customer_chooses_already_booked_time(self):
        ServicesBookingFactory.create(
            employee=self.employee,
            booked_date=self.book_date.strftime(DATE_FORMAT),
            start_time=self.start_time
        )
        self.assertFalse(self.serializer.is_valid())
        self.assertIn("service_bookings", self.serializer.errors)
        print(self.serializer.errors)
        self.assertIn("non_field_errors", self.serializer.errors["service_bookings"][0])

    def test_005_incomplete_customer_information(self):
        # email and phone are like necessary fields
        del self.data['client']['email']
        self.assertFalse(self.serializer.is_valid())
        self.assertIn("client", self.serializer.errors)
        self.assertIn("email", self.serializer.errors["client"])

    def test_006_valid_checkout_instantiates_booking(self):
        self.test_001_valid_booking_data()
        cb = Booking.objects.count()
        cc = Customer.objects.count()
        cs = ServicesBooking.objects.count()
        self.serializer.save()
        self.assertEqual(Booking.objects.count(), cb + 1)
        self.assertEqual(Customer.objects.count(), cc + 1)
        self.assertEqual(ServicesBooking.objects.count(), cs + len(self.data['service_bookings']))

    def test_007_booking_appointment_instantiates_crm_contact(self):
        from crm.models import Contact
        old = Contact.objects.count()
        self.test_006_valid_checkout_instantiates_booking()
        self.assertEqual(Contact.objects.count(), old + 1)
