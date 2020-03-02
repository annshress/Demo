import sys
import logging
from collections import defaultdict

from django.core.mail import EmailMultiAlternatives
from django.dispatch import receiver
from django.template.loader import render_to_string
from django.urls import reverse
from django.contrib.auth.models import Permission
from django.conf import settings
from django.utils.crypto import get_random_string
from django_rest_passwordreset.signals import reset_password_token_created
from main.notifications.email.mail import sendEmail
from django.core.exceptions import ValidationError

local_apps = settings.AUTHORIZED_APPS
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


def assign_company_owner_apps_wide_permissions(sender, instance, *args, **kwargs):
    user = instance.admin
    if not instance.verified:
        # only verified company's admin are going to have such privileges.
        # if company was previously verified, now is not, we pull all the permissions
        user.user_permissions.set([])
        # but careful about employees, as they can have customizations, which
        # probably should be stored somewhere before we actually revoke their perms,
        # such that under re-verification, we can restore employees permissions.
        # solution: employee.is_active = False
        changed = instance.employee_set.update(is_active=False)
        sys.stdout.write("{} employee(s) of '{}' company have been set to inactive.".format(
            changed, instance))
        return
    local_perms = Permission.objects.all().filter(content_type__app_label__in=local_apps)
    user.user_permissions.set(local_perms)
        
        #############
        # TRUNCATED #
        #############


def add_employee_permissions_groups(sender, instance, *args, **kwargs):
    # now assign user to the groups set in the employee.groups
    if instance._meta.model_name == "permissiongroup":
        for employee in instance.employee_set.all():
            employee.user.groups.add(instance.group_ptr)
    else:
        instance.user.groups.set(instance.groups.all())


@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):
    """
    Handles password reset tokens
    When a token is created, an e-mail needs to be sent to the user
    :param sender: View Class that sent the signal
    :param instance: View Instance that sent the signal
    :param reset_password_token: Token Model Object
    :param args:
    :param kwargs:
    :return:
    """
    # send an e-mail to the user
    context = {
        'current_user': reset_password_token.user,
        'username': reset_password_token.user.username,
        'email': reset_password_token.user.email,
        'reset_password_url': "{}?token={}".format(reverse('api-auth:password_reset:reset-password-request'),
                                                   reset_password_token.key),
        'token': reset_password_token.key
    }

    try:
        response = sendEmail('reset_password', reset_password_token.user.email, 'Password Reset', context)
    except ValidationError as error:
        print("There is a Problem while sending Email")

