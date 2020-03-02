from django.test.testcases import TestCase
from django.urls import reverse
from rest_framework.test import APIRequestFactory

from accounts.api.employee.serializers import EmployeeModelSerializer
from accounts.tests.factory import UserFactory, CompanyFactory, EmployeeFactory
from libs.utils import View


class TestEmployeeModelSerializer(TestCase):
    def setUp(self):
        self.user = UserFactory.create()
        self.company = CompanyFactory.create()
        self.employee = EmployeeFactory.create(company=self.company)

        self.data = dict(
            email=self.user.email
        )
        rf = APIRequestFactory()
        self.request = rf.get("/")
        # manually setup parser_context as serializer depends on it
        self.request.parser_context = dict(kwargs=dict(pk=self.employee.pk))
        self.request_list = rf.get("/")
        self.request_list.parser_context = dict(kwargs=dict())

        self.detail_serializer = EmployeeModelSerializer(
            data=self.data,
            context=dict(
                company=self.company,
                request=self.request
            )
        )
        self.create_serializer = EmployeeModelSerializer(
            data=self.data,
            context=dict(
                company=self.company,
                request=self.request_list,
                view=View(action="create")
            )
        )
        self.serializer_list = EmployeeModelSerializer(
            instance=[self.employee],
            context=dict(
                company=self.company,
                request=self.request_list,
                view=View(action="list")
            ),
            many=True
        )
        self.fields = ["user", "id", "url", "is_active"]
        self.list_fields = ["id", "url", "is_active"]

    def test_000_serializer_fields(self):
        self.assertTrue(self.create_serializer.is_valid(), self.create_serializer.errors)
        self.create_serializer.save()
        self.assertCountEqual(list(self.create_serializer.data.keys()),
                              ["id", "url", "is_active", "user"])

        self.assertCountEqual(list(self.serializer_list.data[0].keys()), self.list_fields)

    def test_001_valid_serializer(self):
        self.assertTrue(self.create_serializer.is_valid(), self.create_serializer.errors)

    def test_002_non_existent_email(self):
        email = "some.bad@email.com"
        data = dict(email=email)
        serializer = EmployeeModelSerializer(data=data,
                                             context=dict(
                                                 company=self.company,
                                                 request=self.request_list
                                             )
                                             )
        self.assertFalse(serializer.is_valid())
        self.assertIn("email", serializer.errors)

    def test_003_update_not_allowed(self):
        serializer = EmployeeModelSerializer(
            instance=self.employee,
            data=self.data,
            context=dict(
                company=self.company,
                request=self.request_list
            )
        )
        self.assertTrue(serializer.is_valid(), serializer.errors)
        instance = serializer.save()
        self.assertIsNotNone(instance.id)
