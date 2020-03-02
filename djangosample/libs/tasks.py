from celery.app import shared_task
from sendgrid.helpers.mail import Mail

from main.notifications.email.clients import getClient


def send_mail(subject, message, from_email, recipient_list, html_message=None):
    sg = getClient()
    message = Mail(
        from_email='noreply@whyunifiedworkplace.com',
        to_emails=recipient_list,
        subject=subject,
        plain_text_content=message,
        html_content=html_message)
    sg.send(message)


@shared_task
def send_email(subject, message, from_email="noreply@whyunifiedworkplace.com", recipient_list=[],
               html_message=None):
    send_mail(
        subject=subject,
        message=message,
        from_email=from_email,
        recipient_list=recipient_list,
        html_message=html_message
    )
