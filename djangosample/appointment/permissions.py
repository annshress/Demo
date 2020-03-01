from rest_framework.permissions import BasePermission, SAFE_METHODS


class BookingMenuPermission(BasePermission):
    message = "You do not have enough privileges on Booking Menu."

    def has_permission(self, request, view):
        if view.action in ["send_sms", "send_email", "export"]:
            return request.user.has_perm('appointment.access_booking')
        elif view.action in ["create"]:
            return request.user.has_perm('appointment.add_booking')
        elif view.action in ["update", "partial_update"]:
            return request.user.has_perm('appointment.change_booking')
        elif view.action in ["destroy"]:
            return request.user.has_perm('appointment.delete_booking')
        # elif view.action is None and request.method in SAFE_METHODS:
        elif request.method in SAFE_METHODS:
            return True
        print(view.action)
        return False


class WorkingTimePermission(BasePermission):
    message = "You do not have enough privileges on Working Time Menu."

    def has_permission(self, request, view):
        if getattr(view, 'action', None):
            if view.action in ["list", "retrieve"]:
                return request.user.has_perm('appointment.view_workingtime')
            elif view.action in ["create"]:
                return request.user.has_perm('appointment.add_workingtime')
            elif view.action in ["update", "partial_update"]:
                return request.user.has_perm('appointment.change_workingtime')
            elif view.action in ["destroy"]:
                return request.user.has_perm('appointment.delete_workingtime')
            print("action not registered in workingtime permissions")
        else:
            mapper = {
                "OPTIONS": 'appointment.view_workingtime',
                "GET": 'appointment.view_workingtime',
                "POST": 'appointment.add_workingtime',
                "PUT": 'appointment.change_workingtime',
                "PATCH": 'appointment.change_workingtime',
                "DELETE": 'appointment.delete_workingtime',
            }
            return request.user.has_perm(mapper.get(request.method))
        return False


class CustomDatePermission(BasePermission):
    message = "You do not have enough privileges on Custom Working Time Menu."

    def has_permission(self, request, view):
        if getattr(view, 'action', None):
            if view.action in ["list", "retrieve"]:
                return request.user.has_perm('appointment.view_customdate')
            elif view.action in ["create"]:
                return request.user.has_perm('appointment.add_customdate')
            elif view.action in ["update", "partial_update"]:
                return request.user.has_perm('appointment.change_customdate')
            elif view.action in ["destroy"]:
                return request.user.has_perm('appointment.delete_customdate')
            print("action not registered in custom times permissions")
        else:
            mapper = {
                "OPTIONS": 'appointment.view_customdate',
                "GET": 'appointment.view_customdate',
                "POST": 'appointment.add_customdate',
                "PUT": 'appointment.change_customdate',
                "PATCH": 'appointment.change_customdate',
                "DELETE": 'appointment.delete_customdate',
            }
            return request.user.has_perm(mapper.get(request.method))
        return False


class ServiceMenuPermission(BasePermission):
    message = "You do not have enough privileges on Service Menu."

    def has_permission(self, request, view):
        if getattr(view, 'action', None):
            if view.action in ["list", "retrieve"]:
                return request.user.has_perm('appointment.view_service')
            elif view.action in ["create"]:
                return request.user.has_perm('appointment.add_service')
            elif view.action in ["update", "partial_update"]:
                return request.user.has_perm('appointment.change_service')
            elif view.action in ["destroy"]:
                return request.user.has_perm('appointment.delete_service')
            print("action not registered in service permissions")
        else:
            mapper = {
                "OPTIONS": 'appointment.view_service',
                "GET": 'appointment.view_service',
                "POST": 'appointment.add_service',
                "PUT": 'appointment.change_service',
                "PATCH": 'appointment.change_service',
                "DELETE": 'appointment.delete_service',
            }
            return request.user.has_perm(mapper.get(request.method))
        return False


class ScheduleMenuPermission(BasePermission):
    message = "You do not have access to Service Menu."

    def has_permission(self, request, view):
        return request.user.has_perm('appointment.access_schedule')


class ReportMenuPermission(BasePermission):
    message = "You do not have access to Report Menu."

    def has_permission(self, request, view):
        return request.user.has_perm('appointment.access_report')


class RoleMenuPermission(BasePermission):
    message = "You do not have enough privileges on Role Menu."

    def has_permission(self, request, view):
        if view.action in ["reset_permissions"]:
            self.message = "You do not have enough privileges to Reset"
            return request.user.has_perm('appointment.reset_permissions')
        return request.user.has_perm('appointment.view_appointmentuser')


class AlterUserPermission(BasePermission):
    message = "You do not have enough privileges to set user permissions."

    def has_permission(self, request, view):
        return request.user.has_perm('appointment.view_appointmentuser') and \
               request.user.has_perm('appointment.set_permissions')
