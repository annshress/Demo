import string
import random

from django.core.files.uploadedfile import SimpleUploadedFile
from django.core.validators import RegexValidator
from rest_framework.settings import api_settings


# todo use PhoneNumberField (3rd party)
phone_regex = RegexValidator(regex=r'^\+?1?\d{9,15}$',
                             message="Phone should in the format:'+999999999'.Upto 15 digits allowed.")


def generate_random_uuid(n):
    return ''.join([random.choice(string.ascii_uppercase + string.digits)
                    for each in range(n)])


def get_test_image():
    return SimpleUploadedFile(name='test_image.jpg',
                              content=open("yo.png", 'rb').read(),
                              content_type='image/jpeg')


class View:
    def __init__(self, action):
        self.action = action


def get_identity(request):
    """returns ip based on X-FORWARDED-FOR or REMOTE-ADDR headers

    copied shamelessly from: rest_framework.throttling.BaseThrottle#get_ident"""
    xff = request.META.get("HTTP_X_FORWARDED_FOR")
    remote_addr = request.META.get("REMOTE_ADDR")
    num_proxies = api_settings.NUM_PROXIES

    if num_proxies is not None:
        if num_proxies == 0 and xff is None:
            return remote_addr
        addrs = xff.split(",")
        client_address = addrs[-min(num_proxies, len(addrs))]
        return client_address.strip()

    return ''.join(xff.split()) if xff else remote_addr


def get_identity_websocket(scope):
    """returns ip based on X-FORWARDED-FOR or REMOTE-ADDR headers

    copied shamelessly from: rest_framework.throttling.BaseThrottle#get_ident"""
    xff = list(filter(lambda x: x[0].decode() == ("x-forwarded-for"), scope["headers"])) or None
    if xff:
        xff = xff[0][1].decode()
    remote_addr = list(filter(lambda x: x[0].decode() == ("remote-addr"), scope["headers"])) or None
    if remote_addr:
        remote_addr = remote_addr[0][1].decode()
    num_proxies = api_settings.NUM_PROXIES

    if num_proxies is not None:
        if num_proxies == 0 and xff is None:
            return remote_addr
        addrs = xff.split(",")
        client_address = addrs[-min(num_proxies, len(addrs))]
        return client_address.strip()

    return ''.join(xff.split()) if xff else remote_addr
