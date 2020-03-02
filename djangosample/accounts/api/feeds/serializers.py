from rest_framework import serializers

from accounts.api.serializers import UserSerializer
from crm.models.feeds import FeedComment


class FeedCommentModelSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    loved_by_count = serializers.SerializerMethodField()
    is_loved = serializers.SerializerMethodField()

    class Meta:
        model = FeedComment
        fields = ["id", "message", "action", "owner", "created_on",
                  "last_modified", "loved_by_count", "is_loved"]
        extra_kwargs = dict(
            created_on=dict(read_only=True),
            last_modified=dict(read_only=True)
        )

    def get_is_loved(self, instance):
        return instance.is_loved(self.context["request"].user)

    @staticmethod
    def get_loved_by_count(instance):
        return instance.loved_by.count()

    def validate(self, attrs):
        attrs["company"] = self.context["company"]
        attrs["owner"] = self.context["request"].user
        return attrs


class FeedSerializer(serializers.Serializer):
    verb = serializers.CharField(max_length=256)
