from django.http import JsonResponse
from rest_framework.exceptions import NotAuthenticated, AuthenticationFailed, PermissionDenied

from accounts.models import Company, ActivatedApplication
from appointment.models import AppointmentUser


class CompanyPermissionCheckMixin:
    """
    Mixin to initialize company and check for permissions as well
    Add it in your ADMIN viewsets **(NOT public ones)**
    access company via self.company
    """

    def dispatch(self, request, *args, **kwargs):
        # fixme why this redundancy
        from copy import copy
        orig_request = copy(request)

        company = kwargs.get('company')
        try:
            # for now slug will simply be pk, later might change to sth like uuid or slug
            company = Company.objects.get(id=company, verified=True)
        except (Company.DoesNotExist, ValueError):
            return JsonResponse(data=dict(message="Missing Company ID"), status=400)

        self.company = company

        #####################
        #     TRUNCATED     #
        #####################

            if request.user.is_superuser:
                has_access = True
            elif company.admin == request.user:
                has_access = True
            elif hasattr(request.user,
                         "employee") and request.user.employee.company == self.company and request.user.employee.is_active:
                # employee are going to play the role of business user
                has_access = True
        if has_access:
            return super(CompanyPermissionCheckMixin, self).dispatch(orig_request, *args, **kwargs)
        return JsonResponse(data=dict(message="Permission Denied"), status=403)


class CompanyViewSetQuerysetMixin:
    def get_queryset(self):
        return super(CompanyViewSetQuerysetMixin, self).get_queryset().filter(
            company=self.company
        )


class SetCompanySerializerMixin:
    """
    A mixin to pass company kwarg to the serializer.
    """

    def get_serializer_context(self):
        context = super(SetCompanySerializerMixin, self).get_serializer_context()
        context.update(dict(company=self.company))
        return context


class SetCompanyForSerializerSaveMixin:
    """
    During save, adds company attr into validated_data
    Requires `SetCompanySerializerMixin` in the view, though.
    """

    def validate(self, attrs):
        attrs = super(SetCompanyForSerializerSaveMixin, self).validate(attrs)
        attrs["company"] = self.context["company"]
        return attrs


class CompanyActivatedAppCheckMixin(object):
    def dispatch(self, request, *args, **kwargs):
        """
            requires
            app_name = "literally the settings.app-name given view is part of"
            company = company object
        """
        app_name = kwargs.get("app_name", self.app_name)
        company = getattr(self, "company", None) or Company.objects.get(id=kwargs.get("company"))
        activation_app = ActivatedApplication.objects.get(linked_app_name=app_name)
        if activation_app.id in company.activated_applications.values_list("id", flat=True):
            return super(CompanyActivatedAppCheckMixin, self).dispatch(request, *args, **kwargs)
        return JsonResponse(dict(message="{} is de-activated".format(app_name)), status=403)
