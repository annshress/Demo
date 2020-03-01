from django.contrib.auth.models import Permission
from django.test import TestCase

from accounts.tests.factory import UserFactory, CompanyFactory
from appointment.models import Role
from appointment.tests.factory import AppointmentUserFactory
from appointment.constants import ADMINISTRATOR_PERMISSIONS, REGULAR_PERMISSIONS, ROLES


class TestRoleModel(TestCase):
    fixtures = ['roles.json']

    def setUp(self):
        self.regular = Role.objects.get(name='regular')
        self.administrator = Role.objects.get(name='administrator')

    def test_001_get_permissions(self):
        self.assertCountEqual(self.regular.get_permissions().values_list("codename", flat=True),
                              REGULAR_PERMISSIONS)
        self.assertCountEqual(self.administrator.get_permissions().values_list("codename", flat=True),
                              ADMINISTRATOR_PERMISSIONS)


class TestAppointmentUser(TestCase):
    fixtures = ['roles.json']

    def setUp(self):
        self.regular = Role.objects.get(name='regular')
        self.administrator = Role.objects.get(name='administrator')
        self.ap_user = AppointmentUserFactory.create(role=self.regular)

    def test_001_get_permissions(self):
        self.assertCountEqual(self.ap_user.get_permissions(),
                              Role.objects.get(name=ROLES.regular).get_permissions())

    def test_002_reset_permissions(self):
        self.assertEqual(self.ap_user.reset_permissions(), 0)

    def test_003_invalid_reset_permissions(self):
        user = UserFactory.create()
        company = CompanyFactory.create(admin=user)
        ap_user = AppointmentUserFactory.create(role=self.regular,
                                                auth_user=user,
                                                company=company)
        self.assertEqual(ap_user.reset_permissions(), 1)
