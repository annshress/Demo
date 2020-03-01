from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType
from django.db import models
from django.urls import reverse
from django.utils.translation import ugettext_lazy as _

from appointment.apps import AppointmentConfig
from appointment.constants import ROLES, ADMINISTRATOR_PERMISSIONS, REGULAR_PERMISSIONS
from accounts.models import Employee


class Role(models.Model):
    ROLE_CHOICES = (
        (ROLES.administrator, "administrator"),
        (ROLES.regular, "regular"),
    )
    name = models.CharField(
        _("Name"),
        max_length=32,
        choices=ROLE_CHOICES,
        unique=True
    )
    status = models.BooleanField(_("Status"), default=True)

    def get_permissions(self):
        perms = {
            ROLES.regular: REGULAR_PERMISSIONS,
            ROLES.administrator: ADMINISTRATOR_PERMISSIONS
        }
        cts = ContentType.objects.filter(app_label='appointment')
        return Permission.objects.filter(content_type__in=cts).filter(codename__in=perms[self.name])

    def __str__(self):
        return self.name


class AppointmentUser(models.Model):
    role = models.ForeignKey("appointment.Role",
                             on_delete=models.CASCADE)
    auth_user = models.OneToOneField("accounts.User",
                                     on_delete=models.CASCADE,
                                     related_name="appointment_user")
    status = models.BooleanField(_("Is Active"),
                                 default=True)
    company = models.ForeignKey("accounts.Company", on_delete=models.CASCADE)

    @classmethod
    def check_authorization(cls, user, company):
        # if a company contains that user, via AppointmentUser model
        return cls.objects.filter(company=company, auth_user=user).exists()

    def get_absolute_url(self, request):
        return request.build_absolute_uri(
            reverse('appointment:roles-detail',
                    kwargs=dict(company=request.parser_context['kwargs']['company'], pk=self.id))
        )

    def get_permissions(self):
        """
        return a list of permissions belonging to the user
        """
        return self.role.get_permissions()

    def reset_permissions(self):
        """
        called by viewset to reset the permissions of the user to original
        """
        if self.auth_user == self.company.admin:
            # we won't allow reset permissions for company admin
            return 1
        self.auth_user.user_permissions.set(self.get_permissions())
        return 0

    @classmethod
    def create_company_admin_appointment_user(cls, company):
        # todo a company admin is to automatically have a appointment user instance with admin role
        # todo: update now company admin has full access across all apps
        # call this method from somewhere!!!
        instance = cls(role=Role.objects.get(name='administrator'),
                       auth_user=company.admin,
                       status=True,
                       company=company)
        instance.save()
        return instance

    def save(self, *args, **kwargs):
        super(AppointmentUser, self).save(*args, **kwargs)
        Employee.objects.create(user=self.auth_user,
                                company=self.company,
                                is_active=True)

    class Meta:
        permissions = (
            ('set_permissions', 'Can set permissions to Appointment.Users'),
            ('reset_permissions', 'Can reset permissions to Appointment.Users'),
        )
