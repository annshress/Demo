from accounts import AUTHORIZED_APPS_CHOICES
from libs.mixins import CompanyActivatedAppCheckMixin


class AppointmentAppCheckMixin(CompanyActivatedAppCheckMixin):
    """
    This mixin simply provides app_name attribute to the api views
    and checks if company has activated it
    """
    app_name = AUTHORIZED_APPS_CHOICES.appointment
