from django.db import models

from appointment.constants import (CLIENT_CONFIRM_PAYMENT_SUBJECT, CLIENT_NEW_ORDER_SMS,
                                   CLIENT_NEW_ORDER_EMAIL_BODY, CLIENT_NEW_ORDER_EMAIL_SUBJECT,
                                   CLIENT_CONFIRM_PAYMENT_BODY, CLIENT_CANCEL_EMAIL_SUBJECT,
                                   CLIENT_CANCEL_EMAIL_BODY, EMPLOYEE_NEW_ORDER_EMAIL_SUBJECT,
                                   EMPLOYEE_NEW_ORDER_EMAIL_BODY, EMPLOYEE_CONFIRM_PAYMENT_SMS,
                                   EMPLOYEE_CONFIRM_PAYMENT_SUBJECT, EMPLOYEE_NEW_ORDER_SMS,
                                   EMPLOYEE_CONFIRM_PAYMENT_BODY, EMPLOYEE_CANCEL_EMAIL_SUBJECT,
                                   EMPLOYEE_CANCEL_EMAIL_BODY)


class Configuration(models.Model):
    # order
    company = models.OneToOneField("accounts.Company",
                                   on_delete=models.CASCADE,
                                   related_name="appointment_configuration")
    accept_bookings_prior = models.PositiveSmallIntegerField(
        "Accept bookings X hours before appointment start time",
        default=0
    )
    cancel_bookings_prior = models.PositiveSmallIntegerField(
        "Clients can cancel a booking up to X hours before appointment start time",
        default=0
    )
    accept_booking_prior_days = models.PositiveSmallIntegerField(
        "Accept bookings X days ahead",
        default=100
    )

    tax = models.DecimalField("Tax percent",
                              default=10,
                              max_digits=10, decimal_places=2)
    deposit = models.DecimalField("Deposit percent",
                                  default=15,
                                  max_digits=10, decimal_places=2)

    # pending and confirmed status are left as is
    terms = models.TextField("Terms and conditions", blank=True, default="")

    # client emails values
    client_new_order_email_subject = models.TextField(default=CLIENT_NEW_ORDER_EMAIL_SUBJECT)
    client_new_order_email = models.TextField(default=CLIENT_NEW_ORDER_EMAIL_BODY)
    send_client_new_order_email = models.BooleanField(default=False)
    # client_new_order_sms = models.TextField(default=CLIENT_NEW_ORDER_SMS)
    # send_client_new_order_sms = models.BooleanField(default=False)
    client_payment_confirm_email_subject = models.TextField(default=CLIENT_CONFIRM_PAYMENT_SUBJECT)
    client_payment_confirm_email = models.TextField(default=CLIENT_CONFIRM_PAYMENT_BODY)
    send_client_payment_confirm_email = models.BooleanField(default=False)

    client_cancel_email_subject = models.TextField(default=CLIENT_CANCEL_EMAIL_SUBJECT)
    client_cancel_email = models.TextField(default=CLIENT_CANCEL_EMAIL_BODY)
    send_client_cancel_email = models.BooleanField(default=False)
    # employee emails values
    employee_new_order_email_subject = models.TextField(default=EMPLOYEE_NEW_ORDER_EMAIL_SUBJECT)
    employee_new_order_email = models.TextField(default=EMPLOYEE_NEW_ORDER_EMAIL_BODY)
    send_employee_new_order_email = models.BooleanField(default=False)

    # employee_new_order_sms = models.TextField(default=EMPLOYEE_NEW_ORDER_SMS)
    # send_employee_new_order_sms = models.BooleanField(default=False)
    employee_payment_confirm_email_subject = models.TextField(default=EMPLOYEE_CONFIRM_PAYMENT_SUBJECT)
    employee_payment_confirm_email = models.TextField(default=EMPLOYEE_CONFIRM_PAYMENT_BODY)
    send_employee_payment_confirm_email = models.BooleanField(default=False)

    # employee_payment_confirm_sms = models.TextField(default=EMPLOYEE_CONFIRM_PAYMENT_SMS)
    # send_employee_payment_confirm_sms = models.BooleanField(default=False)
    employee_cancel_email_subject = models.TextField(default=EMPLOYEE_CANCEL_EMAIL_SUBJECT)
    employee_cancel_email = models.TextField(default=EMPLOYEE_CANCEL_EMAIL_BODY)
    send_employee_cancel_email = models.BooleanField(default=False)
