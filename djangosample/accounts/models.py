import os
import uuid
import random
import string

from actstream.models import Action
from django.apps import apps as django_apps
from django.contrib.auth.models import AbstractUser, UserManager, Group
from django.contrib.contenttypes.models import ContentType
from django.db import models
from django.db.models.signals import post_save, m2m_changed
from django.urls import reverse
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _
from django.urls import NoReverseMatch
from django.core.exceptions import ValidationError

from accounts import AUTHORIZED_APPS_CHOICES
from accounts.signals import assign_company_owner_apps_wide_permissions, add_employee_permissions_groups, \
    create_default_perm_groups
from appointment.constants import STATUS as APPOINTMENT_STATUS
from libs.constants import COUNTRY_CHOICES
from libs.utils import phone_regex
from shoppingcart.constants import STATUS as SHOPPING_STATUS


class CustomUserManager(UserManager):
    def create_superuser(self, email, password, username='', **extra_fields):
        return super().create_superuser(username, email, password,
                                        **extra_fields)

    def create_user(self, email, username='', password=None, **extra_fields):
        return super().create_user(username, email, password, **extra_fields)

    def _create_user(self, username, email, password, **extra_fields):
        """
        Creates and saves a User with the given username, email and password.
        This method overrides parent method to suppress ValidationError on
        empty ``username`` parameter as soon as we use email as username field
        """
        email = self.normalize_email(email)
        username = self.model.normalize_username(username)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user


def user_avatar(instance, filename):
    return os.path.join("user", instance.username, "avatar", filename)


class Question(models.Model):
    question_text = models.TextField()


class SecurityQuestion(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name="questions_security")
    answer = models.CharField("Answer", max_length=100)
    required = models.BooleanField("Security Required", default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class UserLogs(models.Model):
    user_agent = models.TextField("User Agent")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class User(AbstractUser):
    first_name = models.CharField(
        _('first name'),
        max_length=30,
        blank=True,
        null=True
    )
    last_name = models.CharField(
        _('last name'),
        max_length=30,
        blank=True,
        null=True
    )
    email = models.EmailField(
        verbose_name=_('email address'),
        unique=True,
        blank=True,
        error_messages={
            'unique': _("A user with this email already exists."),
        },
        help_text=_('Email is used as internal username'),
    )
    username = models.CharField(
        verbose_name=_('Username'),
        unique=True,
        blank=True,
        null=True,
        help_text=_('Display username'),
        max_length=255,
    )
    contact = models.CharField(
        validators=[phone_regex],
        max_length=17,
        null=True,
        blank=True,
        verbose_name=_('Contact')
    )
    avatar = models.ImageField(
        upload_to=user_avatar
    )
    user_role = models.CharField(
        max_length=100,
        verbose_name=_('Role of User'),
        blank=True,
        null=True
    )
    status = models.CharField(
        max_length=100,
        verbose_name=_('User Status'),
        help_text=_('Any User is Blocked/Unblocked by Admin'),
        blank=True,
        null=True
    )
    security_question = models.OneToOneField(SecurityQuestion, on_delete=models.CASCADE, blank=True, null=True)
    userlogs = models.ManyToManyField(UserLogs, related_name="UserLog", blank=True, null=True)
    created = models.DateTimeField(auto_now_add=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    # EMAIL_FIELD = 'email'
    # USERNAME_FIELD = 'username'
    # REQUIRED_FIELDS = ['email']

    @property
    def customer(self):
        return self.customers.first() if self.customers.exists() else None

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        if self.first_name:
            return '{self.first_name} {self.last_name}'.format(
        
        #############
        # TRUNCATED #
        #############


    def disable_two_factor_auth(self):
        if hasattr(self, "multi_factor_auth"):
            self.multi_factor_auth.delete()

    @property
    def initials(self):
        if self.first_name:
            initials = self.first_name[0].upper()
            if self.last_name:
                initials += self.last_name[1].upper()
            return initials
        return self.email[0].upper() + "@"

    @property
    def account_type(self):
        
        #############
        # TRUNCATED #
        #############

    @property
    def two_factor_auth(self):
        if hasattr(self, "multi_factor_auth"):
            return self.multi_factor_auth.challenge_type
        return None


def generate_activation_code():
    return ''.join(random.choice(string.ascii_uppercase + string.digits) for x in range(6))


class ApplicationCategory(models.Model):
    name = models.CharField("Name", max_length=128)
    priority = models.PositiveSmallIntegerField("Priority",
                                                choices=[(4, "Very High"),
                                                         (3, "High"),
                                                         (2, "Medium"),
                                                         (1, "Low"),
                                                         (0, "Very Low")])

    def __str__(self):
        return self.name


class ActivatedApplication(models.Model):
    LINKED_APP_CHOICES = (
        (AUTHORIZED_APPS_CHOICES.appointment, "Appointment"),
        (AUTHORIZED_APPS_CHOICES.shoppingcart, "Shopping Cart"),
        (AUTHORIZED_APPS_CHOICES.emails, "Emails"),
        (AUTHORIZED_APPS_CHOICES.invoicemanager, "Invoice Manager"),
        (AUTHORIZED_APPS_CHOICES.hotel_booking, "Hotel Booking"),
        (AUTHORIZED_APPS_CHOICES.cleaning, "Cleaning"),
        (AUTHORIZED_APPS_CHOICES.food_delivery, "Food Delivery"),
        (AUTHORIZED_APPS_CHOICES.crm, "CRM"),
        (AUTHORIZED_APPS_CHOICES.newsletter, "Newsletter"),
        (AUTHORIZED_APPS_CHOICES.class_scheduling, "Class Scheduling"),
        (AUTHORIZED_APPS_CHOICES.cloudphone, "Cloud Phone"),
    )

    linked_app_name = models.CharField(
        "Linked App",
        max_length=64,
        choices=LINKED_APP_CHOICES,
        unique=True
    )
    featured = models.BooleanField("Featured", default=False)
    categories = models.ManyToManyField("accounts.ApplicationCategory",
                                        blank=True)

    def __str__(self):
        return self.linked_app_name


class Widget(models.Model):
    name = models.CharField("Name", max_length=128)
    slug = models.CharField(unique=True, blank=True, max_length=200, verbose_name='widget_slug')
    application = models.ForeignKey(ActivatedApplication,
                                    on_delete=models.CASCADE,
                                    related_name="application_name",
                                    null=True, blank=True)
        
        #############
        # TRUNCATED #
        #############


        super(Widget, self).save(*args, **kwargs)


class Company(models.Model):
    CURRENCY_CHOICES = (
        ("usd", "USD"),
        ("eur", "EUR"),
    )
    id = models.UUIDField(verbose_name="ID", primary_key=True, default=uuid.uuid4, serialize=False)
    name = models.CharField(
        max_length=30,
        verbose_name=_('Company Name'),
        help_text=_('Enter Company/Organization Name'),
        null=False,
        blank=False
    )
    description = models.TextField(
        verbose_name=_('Company Description'),
        help_text=_('Enter Company/Organization description'),
        null=True,
        blank=True,
    )
    currency = models.CharField("Currency", max_length=4,
                                default="usd",
                                choices=CURRENCY_CHOICES)
        
        #############
        # TRUNCATED #
        #############


    subscribed = models.BooleanField("Subscribed to a boolean field", default=False)
    subscription = models.CharField("Subscription Status", max_length=32,
                                    null=True, blank=True)
    supports_card = models.BooleanField("Supports Card", default=False)
    # in-built attribute for checking
    perm_groups_created = models.BooleanField(default=False)

    # slug = models.SlugField(unique=True)
    def get_employee_choices(self):
        return self.employee_set.all()

    def get_activated_applications_details(self):
        mapper = {
            AUTHORIZED_APPS_CHOICES.appointment: dict(model="appointment.Booking",
                                                      filter_kwargs=dict(status=APPOINTMENT_STATUS.pending),
                                                      appending_text="new appointments",
                                                      app_name="Appointment Scheduler"),
            AUTHORIZED_APPS_CHOICES.shoppingcart: dict(model="shoppingcart.Order",
                                                       filter_kwargs=dict(
                                                           status__in=[SHOPPING_STATUS.new,
                                                                       SHOPPING_STATUS.pending]
                                                       ),
                                                       appending_text="online orders",
                                                       app_name="Shopping Cart"),
            AUTHORIZED_APPS_CHOICES.newsletter: dict(model="newsletter.Subscriber",
                                                     filter_kwargs=dict(),
                                                     appending_text="subscribers",
                                                     app_name="Newsletter"),
        }
        # todo later they will be added as per widgets.
        result = []
        for app in self.activated_applications.values_list("linked_app_name", flat=True):
        
        #############
        # TRUNCATED #
        #############

    def verify(self):
        self.verified = True
        self.save()

    def __str__(self):
        return '{s.name}'.format(s=self)

    def save(self, *args, **kwargs):
        if not self.id:
            self.date_joined = timezone.now()
        super().save(*args, **kwargs)


post_save.connect(assign_company_owner_apps_wide_permissions, sender=Company)
post_save.connect(create_default_perm_groups, sender=Company)


class ActivatedWidget(models.Model):
    widget = models.ForeignKey(Widget, on_delete=models.CASCADE, related_name="widget")
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name="company_widget")
    is_global = models.BooleanField('is_global', default=False)


class Employee(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="employee")
    company = models.ForeignKey(Company, on_delete=models.CASCADE)

    # if not active, will not have any privileges
    is_active = models.BooleanField("Is Active", default=True)
    groups = models.ManyToManyField(
        "accounts.PermissionGroup",
        verbose_name=_('groups'),
        blank=True,
        help_text=_(
            'The groups this employee belongs to. An employee will get all permissions '
            'granted to each of their groups.'
        )
    )
        
        #############
        # TRUNCATED #
        #############


m2m_changed.connect(add_employee_permissions_groups, sender=Employee.groups.through)


class PermissionGroup(Group):
    company = models.ForeignKey("accounts.Company",
                                on_delete=models.CASCADE)


class Customer(models.Model):
    user = models.ForeignKey('accounts.User', related_name="customers",
                             on_delete=models.SET_NULL,
                             null=True)
    # redundancies
    name = models.CharField("Customer name", max_length=128,
                            null=True, blank=True)
    email = models.EmailField("Customer email",
                              null=True, blank=True)
    phone = models.CharField("Customer phone", max_length=64,
                             null=True, blank=True)
    ip_address = models.GenericIPAddressField(
        _("IP address"),
        protocol='IPv4',
        blank=True,
        editable=False,
        null=True)
    address_one = models.CharField(
        _("Address 1"),
        max_length=1024,
        null=True,
        blank=False
    )
    address_two = models.CharField(
        _("Address 2"),
        max_length=1024,
        null=True,
        blank=True
    )
    country = models.CharField(
        _("Country"),
        max_length=255,
        blank=False,
        null=True
    )
    city = models.CharField(
        _("City"),
        max_length=1024,
        blank=False,
        null=True
    )
    state = models.CharField(
        _("State"),
        max_length=1024,
        blank=False,
        null=True
    )
    zip = models.CharField(
        _("Zip"),
        max_length=16,
        blank=True,
        null=True
    )

    def delete(self, using=None, keep_parents=False):
        # not deleting the customer info because we can't
        return False

    def save(self, *args, **kwargs):
        self.name = "unnamed"
        if not self.name and self.user:
        
        #############
        # TRUNCATED #
        #############

