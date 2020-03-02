from .clients import getClient
from sendgrid.helpers.mail import Mail
from django.template.loader import get_template
from django.core.exceptions import ValidationError


def sendEmail(type, to, subject, params=None):
    if type == "registration":
        htmly = get_template('notifications/email/registration.html')
    elif type == "password_change":
        htmly = get_template('notifications/email/change_password.html')
    elif type == "reset_password":
        htmly = get_template('password_reset_email/user_reset_password.html')
    else:
        htmly = get_template('notifications/email/registration.html')
    d = params
    html_content = htmly.render(d)
    message = Mail(
        from_email='noreply@whyunifiedworkplace.com',
        to_emails=to,
        subject=subject,
        html_content=html_content)
    sg = getClient()
    try:
        return sg.send(message)
    except ValidationError as error:
        print("unable to send Email for Registration")
        print(error)
        return error



