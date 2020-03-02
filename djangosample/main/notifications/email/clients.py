from sendgrid import SendGridAPIClient
from django.conf import settings


def getClient():
    return SendGridAPIClient(settings.SENDGRID_API_KEY)
