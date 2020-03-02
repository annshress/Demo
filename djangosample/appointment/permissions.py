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
        
        #############
        # TRUNCATED #
        #############


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
        
        #############
        # TRUNCATED #
        #############

