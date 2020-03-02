from six import text_type

from django.contrib.contenttypes.models import ContentType
from django.core import validators
from django.core.exceptions import ValidationError
from django.utils.feedgenerator import rfc3339_date
from rest_framework.response import Response
from rest_framework.generics import ListAPIView
from rest_framework.renderers import JSONRenderer

from accounts.api.feeds.serializers import FeedCommentModelSerializer


class CustomAbstractActivityStream(object):
    """
    Abstract base class for all stream rendering.
    Supports hooks for fetching streams and formatting actions.

    overrides: actstream.feeds.AbstractActivityStream
    """
    def get_stream(self, *args, **kwargs):
        """
        Returns a stream method to use.
        """
        raise NotImplementedError

    def get_object(self, *args, **kwargs):
        """
        Returns the object (eg user or actor) that the stream is for.
        """
        raise NotImplementedError

    def items(self, *args, **kwargs):
        """
        Returns a queryset of Actions to use based on the stream method and object.
        """
        return self.get_stream()(self.get_object(*args, **kwargs))

    def format(self, action, *args):
        """
        Returns a formatted dictionary for the given action.
        """
        request = None
        #####################
        #     TRUNCATED     #
        #####################
            'id': obj.id,
            'objectType': ContentType.objects.get_for_model(obj).name,
            'displayName': text_type(obj)
        }

    def format_actor(self, action, request=None):
        """
        Returns a formatted dictionary for the actor of the action.
        """
        obj = getattr(action, "actor")
        object_type = ContentType.objects.get_for_model(obj).name
        try:
            avatar = obj.avatar.url if object_type in ("CustomUser", "User") else None
        except ValueError:
            avatar = ""
        if request and avatar:
            url_validator = validators.URLValidator()
            try:
                # in production we actually get FULL url
                url_validator(avatar)
            except ValidationError:
                # build only if we get relative url
                avatar = request.build_absolute_uri(avatar)
        return {
            'id': obj.id,
            'objectType': object_type,
            'avatar': avatar,
            'displayName': text_type(obj)
        }

    def format_target(self, action):
        """
        Returns a formatted dictionary for the target of the action.
        """
        return self.format_item(action, 'target')

    def format_action_object(self, action):
        """
        Returns a formatted dictionary for the action object of the action.
        """
        item_type = 'action_object'
        obj = getattr(action, item_type)
        
        return {
            'id': obj.id,
            'objectType': ContentType.objects.get_for_model(obj).name,
            'appType': ContentType.objects.get_for_model(obj).app_label,
            'displayName': text_type(obj),
            'uuid': getattr(obj, "uuid")
        }

    def format_action_object_app_type(self, action):
        """
        Returns a formatted dictionary for the action object of the action.
        """
        item_type = 'action_object_content_type'
        obj = getattr(action, item_type)

        return {
            'id': None,
            'objectType': None,
            'appType': obj.app_label,
            'displayName': None,
            'uuid': None
        }


class CustomJSONActivityFeed(CustomAbstractActivityStream, ListAPIView):
    """
    Feed that generates feeds compatible with the v1.0 JSON Activity Stream spec

    overrides: actstream.feeds.JSONActivityFeed
    """
    renderer_classes = (JSONRenderer, )

    def list(self, request, *args, **kwargs):
        data = self.serialize(request, *args, **kwargs)

        page = self.paginate_queryset(data)
        if page is not None:
            return self.get_paginated_response(page)
        return Response(data)

    def serialize(self, request, *args, **kwargs):
        items = self.items(request, *args, **kwargs)
        return [self.format(action, request) for action in items]
