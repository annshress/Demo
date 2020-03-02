from rest_framework import serializers
from rest_framework.relations import HyperlinkedIdentityField
from rest_framework.reverse import reverse


class ParameterisedHyperlinkedIdentityField(HyperlinkedIdentityField):
    """
    Represents the instance, or a property on the instance, using hyperlinking.

    lookup_fields is a tuple of tuples of the form:
        ('model_field', 'url_parameter')
    """
    lookup_fields = (('pk', 'pk'),)

    def __init__(self, *args, **kwargs):
        self.lookup_fields = kwargs.pop('lookup_fields', self.lookup_fields)
        super(ParameterisedHyperlinkedIdentityField, self).__init__(*args, **kwargs)

    def get_url(self, obj, view_name, request, format):
        """
        Given an object, return the URL that hyperlinks to the object.

        May raise a `NoReverseMatch` if the `view_name` and `lookup_field`
        attributes are not configured to correctly match the URL conf.
        """
        kwargs = {}
        for model_field, url_param in self.lookup_fields:
            attr = obj
            for field in model_field.split('.'):
                attr = getattr(attr, field)
            kwargs[url_param] = attr

        return reverse(view_name, kwargs=kwargs, request=request, format=format)


class ActionHyperlinkSerializer(ParameterisedHyperlinkedIdentityField):
    def __init__(self, *args, **kwargs):
        self.lookup_fields = kwargs.pop('lookup_fields', self.lookup_fields)
        self.action_name = kwargs.pop('action_name', None)
        super(ParameterisedHyperlinkedIdentityField, self).__init__(*args, **kwargs)
        if not self.action_name:
            raise AttributeError("Missing `action_name` attribute.")

    def to_representation(self, value):
        result = super(ActionHyperlinkSerializer, self).to_representation(value)
        return dict(
            action_name=self.action_name,
            url=result
        )


class EmptySerializer(serializers.Serializer):
    def to_representation(self, instance):
        return self.initial_data


class EmailSerializer(serializers.Serializer):
    subject = serializers.CharField()
    message = serializers.CharField()
