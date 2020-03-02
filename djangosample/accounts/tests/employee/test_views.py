from django.contrib.auth.models import Permission, Group
from django.contrib.contenttypes.models import ContentType
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient

from accounts.constants import PERM_CHOICES
from accounts.models import Employee
from accounts.tests.factory import CompanyFactory, UserFactory, EmployeeFactory, PermissionGroupFactory


class TestEmployeeModelViewSet(APITestCase):
    def setUp(self):
        self.company = CompanyFactory.create()
        self.admin = self.company.admin
        self.user = UserFactory.create()

        self.count = 3
        self.e1, self.e2, self.e3 = EmployeeFactory.create_batch(self.count, company=self.company)
        # other random employees
        self.other = EmployeeFactory.create()

        self.create_data = dict(email=self.user.email)

        self.list_url = reverse("employee:employee-list", kwargs=dict(company=self.company.id))
        self.detail_url = reverse("employee:employee-detail", kwargs=dict(company=self.company.id,
                                                                          pk=self.e1.pk))
        self.other_url = reverse("employee:employee-detail", kwargs=dict(company=self.company.id,
                                                                         pk=self.other.pk))

        self.pg = PermissionGroupFactory.create(company=self.company)
        perms = [each[0] for each in PERM_CHOICES[:5]]
        perms = [Permission.objects.get(id=i) for i in perms]
        self.pg.permissions.set(perms)

        self.client = APIClient()
        self.client.force_login(self.admin)

    def test_001_get_all_employees(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['count'], self.count)
        self.assertIn("url", response.data['results'][0], response.data)
        # uncommented because why not
        # self.assertNotIn("user", response.data['results'][0])

    def test_002_get_single_employee(self):
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, 200)
        self.assertIn("user", response.data)

    def test_003_delete_employee(self):
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, 204)
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, 404)

    def test_004_create_employee(self):
        response = self.client.post(self.list_url, self.create_data)
        self.assertEqual(response.status_code, 201)
        pk = response.data["id"]

        detail_url = response.data["url"]
        response = self.client.get(detail_url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["id"], pk)

    def test_005_invalid_access_employee_from_another_company(self):
        response = self.client.get(self.other_url)
        # though it exists, it should be inaccessible to the company admin
        self.assertEqual(response.status_code, 404)

    def test_006_update_employee_permission_groups(self):
        # once employee is added to perm_group, employee.user must be in those assigned groups
        update_data = dict(groups=[self.pg.id])
        response = self.client.patch(self.detail_url, update_data)
        self.assertEqual(response.status_code, 200, response.data)
        # now check employee.user groups
        self.assertIn(Group.objects.get(id=self.pg.id), self.e1.user.groups.all())

    def test_007_employee_creations_with_permission_groups(self):
        create_data = dict(email=self.user.email,
                           groups=[self.pg.id])
        response = self.client.post(self.list_url, create_data)
        self.assertEqual(response.status_code, 201, response.data)
        self.assertIn("id", response.data)
        emp = Employee.objects.get(id=response.data["id"])
        # now check employee.user groups
        self.assertIn(Group.objects.get(id=self.pg.id), emp.user.groups.all())

    def test_008_employee_can_access_permitted_menu(self):
        """Once user becomes employee of an company, and gets appropriate privileges
        she is able to access permitted modules"""
        # user has not enough permission
        self.client.logout()
        self.client.force_login(self.user)
        booking_url = reverse("appointment:booking-list",
                              kwargs=dict(
                                  company=self.company.slug,
                              ))

        response = self.client.get(booking_url)
        self.assertEqual(response.status_code, 403, response)

        perm = Permission.objects.get(codename="access_booking")
        ct = ContentType.objects.get(app_label='appointment', model='booking')
        perm2 = Permission.objects.get(codename="add_booking", content_type=ct)
        create_data = dict(email=self.user.email,
                           groups=[self.pg.id],
                           is_active=True)
        # view_booking permission
        self.pg.permissions.add(perm)
        # remove (if has) create_booking permission
        self.pg.permissions.remove(perm2)

        self.client.logout()
        self.client.force_login(self.admin)

        response = self.client.post(self.list_url, create_data)
        self.assertEqual(response.status_code, 201, response.data)
        self.assertIn("id", response.data)
        emp = Employee.objects.get(id=response.data["id"])
        # now check employee.user groups
        self.assertIn(Group.objects.get(id=self.pg.id), emp.user.groups.all())

        self.client.logout()
        self.client.force_login(self.user)

        # this user has now permission to access the booking url
        response = self.client.get(booking_url)
        self.assertEqual(response.status_code, 200, response)
        # but has no permission to access the create booking url
        response = self.client.post(booking_url, data=dict())
        self.assertEqual(response.status_code, 403, response)


class TestPermissionGroupViewSet(APITestCase):
    def setUp(self):
        self.company = CompanyFactory.create()
        self.admin = self.company.admin
        self.employee = EmployeeFactory.create(company=self.company)

        # adding the first 5 permissions to permission group
        self.perms = [each[0] for each in PERM_CHOICES[:5]]
        self.name = "name1"
        self.data = dict(
            name=self.name,
            permissions=self.perms
        )

        self.list_url = reverse("employee:group-list", kwargs=dict(company=self.company.id))
        self.detail_url = reverse("employee:group-detail", kwargs=dict(company=self.company.id,
                                                                       pk=self.employee.pk))

        self.client = APIClient()
        self.client.force_login(self.admin)

    def test_001_valid_group_creation(self):
        response = self.client.post(self.list_url, self.data)
        self.assertEqual(response.status_code, 201)
        self.assertIn(self.name, response.data["name"])
        self.assertIn("url", response.data)

        detail_url = str(response.data["url"])
        response = self.client.get(detail_url)
        self.assertEqual(response.status_code, 200)
        self.assertCountEqual(response.data["permissions"], self.perms)

    def test_002_unauthorized_access(self):
        self.client.force_login(self.employee.user)
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, 403)
