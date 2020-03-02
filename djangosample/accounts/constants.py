from collections import namedtuple

from django.conf import settings
from django.contrib.auth.models import Permission

try:
    # return perms related to local/authorized apps only
    perm_queryset = Permission.objects.filter(
        content_type__app_label__in=settings.AUTHORIZED_APPS
    ).select_related("content_type").values(
        "id", "name", "content_type__app_label"
    )
    PERM_CHOICES = [
        (e["id"], " | ".join([e["content_type__app_label"],
                              e["name"]]))
        for e in perm_queryset]
except:
    PERM_CHOICES = []

"""
try:
    ...
except OperationalError:
    PERM_CHOICES = []
"""


