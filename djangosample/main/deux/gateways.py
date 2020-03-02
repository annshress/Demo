from __future__ import absolute_import

from deux.app_settings import mfa_settings
from django.urls import reverse
from django.utils import translation
from django.utils.translation import pgettext, ugettext
from twilio.rest import Client
from twilio.base.exceptions import TwilioRestException
from urllib.parse import urlencode


# Supported voice languages, see http://bit.ly/187I5cr
VOICE_LANGUAGES = ('en', 'en-gb', 'es', 'fr', 'it', 'de', 'da-DK', 'de-DE',
                   'en-AU', 'en-CA', 'en-GB', 'en-IN', 'en-US', 'ca-ES',
                   'es-ES', 'es-MX', 'fi-FI', 'fr-CA', 'fr-FR', 'it-IT',
                   'ja-JP', 'ko-KR', 'nb-NO', 'nl-NL', 'pl-PL', 'pt-BR',
                   'pt-PT', 'ru-RU', 'sv-SE', 'zh-CN', 'zh-HK', 'zh-TW')


class Twilio(object):
    """
    Gateway for sending text messages and making phone calls using Twilio_.
    All you need is your Twilio Account SID and Token, as shown in your Twilio
    account dashboard.
    ``TWILIO_ACCOUNT_SID``
      Should be set to your account's SID.
    ``TWILIO_AUTH_TOKEN``
      Should be set to your account's authorization token.
    ``TWILIO_CALLER_ID``
      Should be set to a verified phone number. Twilio_ differentiates between
      numbers verified for making phone calls and sending text messages.
    .. _Twilio: http://www.twilio.com/
    """
    def __init__(self):
        self.client = Client(getattr(mfa_settings, 'TWILIO_ACCOUNT_SID'),
                             getattr(mfa_settings, 'TWILIO_AUTH_TOKEN'))

    def make_call(self, phone_number, token):
        locale = translation.get_language()
        validate_voice_locale(locale)

        self.client.calls.create(to=phone_number.as_e164,
                                 from_=getattr(mfa_settings, 'TWILIO_CALLER_ID'),
                                 method='GET', timeout=15)

    def send_sms(self, phone_number, token):
        body = ugettext('Your authentication token is %s') % token
        try:
            self.client.messages.create(
                to=phone_number.as_e164,
                from_=getattr(mfa_settings, 'TWILIO_CALLER_ID'),
                body=body)
        except TwilioRestException as e:
            print("Unable to access Twilio API because of following reason:"
                  "%s" % e)


def validate_voice_locale(locale):
    with translation.override(locale):
        voice_locale = pgettext('twilio_locale', 'en')
        if voice_locale not in VOICE_LANGUAGES:
            raise NotImplementedError('The language "%s" is not '
                                      'supported by Twilio' % voice_locale)