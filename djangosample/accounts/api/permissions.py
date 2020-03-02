from rest_framework import permissions


class AnonPermissionOnly(permissions.BasePermission):
    message = 'You are already authenticated. Please log out to try again.'
    """
    Non-authenicated Users only
    """

    def has_permission(self, request, view):
        return not request.user.is_authenticated  # request.user.is_authenticated


class IsOwnerOrReadOnly(permissions.BasePermission):
    message = 'You must be the owner of this content to change.'
    """
    Object-level permission to only allow owners of an object to edit it.
    Assumes the model instance has an `owner` attribute.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Instance must have an attribute named `owner`.
        # if obj.user == request.user:
        #     return True
        return obj.owner == request.user


class IsCompanyAdmin(permissions.BasePermission):
    def company(self, request, view):
        if hasattr(view, "company"):
            return view.company
        else:
            from accounts.models import Company
            return Company.objects.get(id=request.parser_context["kwargs"]["company"])

    def has_permission(self, request, view):
        """This menu should only be accessible to company admin."""
        return self.company(request, view).admin == request.user or request.user.is_superuser

    def has_object_permission(self, request, view, obj):
        """
        :param request: WSGIRequest
        :param view: EmployeeModelViewSet
        :param obj: Employee
        :return: bool
        """
        return obj.company == self.company(request, view) or request.user.is_superuser


class IsAnyCompanyAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return hasattr(request.user, "admin_of")
