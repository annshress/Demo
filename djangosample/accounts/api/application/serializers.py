from rest_framework import serializers

from accounts.models import ApplicationCategory, ActivatedApplication


class ApplicationCategoryModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApplicationCategory
        fields = ["id", "name"]


class ActivatedApplicationModelSerializer(serializers.ModelSerializer):
    display_name = serializers.SerializerMethodField()    

    class Meta:
        model = ActivatedApplication
        fields = ["id", "linked_app_name", "featured", "display_name"]

    def get_display_name(self, obj):
        return obj.get_linked_app_name_display()

