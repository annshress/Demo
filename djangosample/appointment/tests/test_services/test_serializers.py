from django.test.testcases import TestCase
from rest_framework import serializers

from accounts.tests.factory import CompanyFactory, EmployeeFactory
from appointment.api.serializers import WorkingTimeSeriallizer


class TestWorkingTimeSeriallizer(TestCase):
    def setUp(self):
        self.company = CompanyFactory.create()
        self.employee = EmployeeFactory.create()
        self.data = dict(
            employee=self.employee.pk,
            saturday_off=True,
            sunday_off=True,
            # rest attributes are defaults
        )
        self.serializer = WorkingTimeSeriallizer(
            data=self.data
        )

    def test_001_unique_employee_working_time(self):
        self.assertTrue(self.serializer.is_valid(), self.serializer.errors)
        # save the instance
        self.serializer.save()
        # now try re-adding the working time for same employee
        serializer = WorkingTimeSeriallizer(
            data=self.data
        )
        try:
            serializer.is_valid(raise_exception=True)
            self.fail("A working time for given user already exists, but still can be re-added.")
        except serializers.ValidationError as e:
            # an exception should have occurred, with exception `code=unique`
            self.assertIn('employee', e.get_codes())
            self.assertIn('unique', e.get_codes()['employee'])
