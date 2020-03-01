from datetime import datetime, timedelta, time

from django.test.client import RequestFactory
from django.test.testcases import TestCase
from rest_framework.test import APIRequestFactory

from appointment import DATE_TIME_FORMAT, DATE_FORMAT
from appointment.tests.factory import ServicesBookingFactory
from appointment.constants import BOOKING_TYPE
from ..api.filters import ExportServicesBookingFilter


class TestExportServicesBookingFilter(TestCase):
    def setUp(self):
        now = datetime.now()
        # 1 and 2 booked for today
        book1 = ServicesBookingFactory.create(
            booked_date=now.strftime(DATE_FORMAT),
            start_time=time(13, 0)
        )
        book2 = ServicesBookingFactory.create(
            booked_date=(now + timedelta(hours=1)).strftime(DATE_FORMAT),
            start_time=time(15, 0)
        )
        # 3 booked for future
        book3 = ServicesBookingFactory.create(
            booked_date=(now + timedelta(days=12)).strftime(DATE_FORMAT),
            start_time=time(15, 0)
        )

        self.data = dict(
            bookings=BOOKING_TYPE.created_or_modified,
            date="today"
        )
        rf = APIRequestFactory()
        self.request = rf.get('/')

    def test_001_valid_filtering(self):
        qs = ExportServicesBookingFilter(data=self.data, request=self.request).qs
        self.assertEqual(qs.count(), 3)

        self.data.update(dict(
            bookings=BOOKING_TYPE.coming
        ))
        qs = ExportServicesBookingFilter(data=self.data, request=self.request).qs
        self.assertEqual(qs.count(), 2)
