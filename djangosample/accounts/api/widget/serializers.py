from django.conf import settings
from rest_framework import serializers
from rest_framework.reverse import reverse as api_reverse
from accounts.models import Widget, ActivatedWidget


class WidgetSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model = Widget
        fields = ["id", "application", "name", "url"]

        
        #############
        # TRUNCATED #
        #############

