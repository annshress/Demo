from mock import patch
from django.contrib.auth.models import Permission
from django.test.client import RequestFactory
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient

from accounts.tests.factory import CompanyFactory
from appointment.api.roles.serializers import AppointmentUserModelSerializer
from appointment.models import Role
from appointment.tests.factory import AppointmentUserFactory
from appointment.constants import ADMINISTRATOR_PERMISSIONS

__author__ = 'ann(dot)shress(at)gmail.com'


class TestAppointmentUserModelViewSet(APITestCase):
    fixtures = ['roles.json']

    def setUp(self):
        self.data = {
            "role": "administrator",
            "status": True,
            "auth_user": {
                "username": "ok",
                "email": "ok@ok.com",
                "first_name": "firstok",
                "last_name": "lastok",
                "password": "adminadmin"
            }
        }
        self.regular = Role.objects.get(name='regular')
        self.administrator = Role.objects.get(name='administrator')
        self.company = CompanyFactory.create()
        self.COUNT = 3
        self.instances = AppointmentUserFactory.create_batch(
            self.COUNT,
            role=self.regular,
            company=self.company
        )
        self.others = AppointmentUserFactory.create_batch(
            2, role=self.regular,
        )

        self.administrator_user = AppointmentUserFactory.create(
            role=self.administrator,
            auth_user=self.company.admin,
            company=self.company
        )
        self.company.admin.user_permissions.set(self.administrator.get_permissions())
        self.list_url = reverse('appointment:roles-list',
                                kwargs=dict(company=self.company.slug))
        self.detail_url = reverse('appointment:roles-detail',
                                  kwargs=dict(company=self.company.slug,
                                              pk=self.instances[0].pk))
        self.reset_url = reverse('appointment:roles-reset-permissions',
                                 kwargs=dict(company=self.company.slug,
                                             pk=self.instances[0].pk))
        self.client = APIClient()
        self.client.force_login(self.company.admin)

    def test_001_get_all_appo_users(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, 200)
        # because company admin is also added
        self.assertEqual(len(response.data['results']), self.COUNT + 1)

    def test_002_get_single_user(self):
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, 200)

    def test_0021_get_single_user_other_company(self):
        detail_url = reverse('appointment:roles-detail',
                             kwargs=dict(company=self.company.slug,
                                         pk=self.others[0].pk))
        response = self.client.get(detail_url)
        self.assertEqual(response.status_code, 404)

    def test_003_has_access_to_view(self):
        self.company.admin.user_permissions.set([])
        detail_url = reverse('appointment:roles-detail',
                             kwargs=dict(company=self.company.slug,
                                         pk=self.others[0].pk))
        response = self.client.get(detail_url)
        self.assertEqual(response.status_code, 403)

    def test_004_has_access_to_reset_permissions(self):
        response = self.client.post(self.reset_url)
        self.assertEqual(response.status_code, 200)

        p = Permission.objects.get(codename='reset_permissions')
        # remove the required permission
        self.company.admin.user_permissions.remove(p)
        response = self.client.post(self.reset_url)
        self.assertEqual(response.status_code, 403)

    def test_005_invalid_destroying_company_admin(self):
        detail_url = reverse('appointment:roles-detail',
                             kwargs=dict(company=self.company.slug,
                                         pk=self.administrator_user.pk))
        response = self.client.delete(detail_url)
        self.assertEqual(response.status_code, 400)

    @patch('appointment.models.roles.AppointmentUser.reset_permissions', side_effect=lambda: True)
    def test_008_assert_calls_method_reset_permission(self, reset):
        response = self.client.post(self.reset_url)
        self.assertEqual(response.status_code, 200)
        reset.assert_called_once()


class TestAppointmentUserPermissionsView(APITestCase):
    fixtures = ['roles.json']

    def setUp(self):
        self.regular = Role.objects.get(name='regular')
        self.administrator = Role.objects.get(name='administrator')
        self.company = CompanyFactory.create()

        self.ap_user = AppointmentUserFactory.create(
            role=self.administrator,
            company=self.company
        )
        self.user = self.ap_user.auth_user
        self.ap_user.reset_permissions()

        self.url = reverse("appointment:roles-permissions",
                           kwargs=dict(
                               company=self.company.slug,
                               pk=self.ap_user.pk
                           ))
        self.client = APIClient()
        self.client.force_login(self.user)

    def test_001_retrieve_permissions(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200, response)
        self.assertCountEqual(response.data.keys(), ADMINISTRATOR_PERMISSIONS, response)

    def test_002_update_permissions(self):
        # there are pre existing premissions
        self.assertGreater(self.ap_user.auth_user.user_permissions.count(), 1)
        data = {
            ADMINISTRATOR_PERMISSIONS[0]: True,
            ADMINISTRATOR_PERMISSIONS[1]: True,
            ADMINISTRATOR_PERMISSIONS[2]: True,
            ADMINISTRATOR_PERMISSIONS[3]: True,
            ADMINISTRATOR_PERMISSIONS[4]: True,
        }
        response = self.client.patch(self.url,
                                     data=data)
        self.assertEqual(response.status_code, 200, response)
        self.assertEqual(self.ap_user.auth_user.user_permissions.count(), len(data))
