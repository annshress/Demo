from django.urls import path, re_path
from rest_framework import routers

from appointment.api.reports.views import EmployeeReportAPIView, ServiceReportAPIView
from appointment.api.roles.views import AppointmentUserModelViewSet, AppointmentUserPermissionsView
from appointment.api.views import DashBoardAPIView, get_service_employee_availabilities, ConfigurationDetailAPIView, \
    CreateEmployeeApi, PublicServicesAPIView, WidgetsApiView, NewBookingsWidgetApiView
from .views import viewServices, \
    viewService, Workingtime, addWorkingTime, CustomTimes, addCustomTime, EmployeeCustomTimes, RetrieveCustomTime, \
    GetTimeFromService, GetEmployeesList, UpdateRetrieveEmployee
from appointment.api.bookings.views import BookingModelViewSet, AdminBookingModelViewSet, \
    AdminServiceBookingModelViewSet, ServicesBookingListAPIView, ServicesBookingListAPIViewBackend

router = routers.DefaultRouter()

router.register('public_booking', BookingModelViewSet, base_name='public-booking')  # this is public api for customers
router.register('booking', AdminBookingModelViewSet, base_name='booking')
router.register('service_booking', AdminServiceBookingModelViewSet, base_name='service-booking')
router.register('public/services', PublicServicesAPIView, base_name='public-services')

router.register('roles', AppointmentUserModelViewSet, base_name='roles')

create_service_booking = AdminServiceBookingModelViewSet.as_view({
    'post': 'create',
})

urlpatterns = [
                  path('dashboard/', DashBoardAPIView.as_view(), name='dashboard'),
                  # widgets Urls Starts here
                  path('dashboard/upcoming/', WidgetsApiView.as_view(), name='dashboard_upcoming'),
                  path('dashboard/allbookings/', WidgetsApiView.as_view(), name='dashboard_allbookings'),
                  path('dashboard/latest/', WidgetsApiView.as_view(), name='dashboard_latest'),
                  path('dashboard/today/', WidgetsApiView.as_view(), name='dashboard_today'),
                  path('dashboard/liveinsight/', WidgetsApiView.as_view(), name='dashboard_liveinsight'),
                  path('dashboard/new_bookings/', NewBookingsWidgetApiView.as_view(), name='dashboard_new_bookings'),

                  # widgets url ends here

                  path('options/', ConfigurationDetailAPIView.as_view(), name='options'),
                  path('schedules/', ServicesBookingListAPIView.as_view(), name='schedules'),
                  path('schedule/', ServicesBookingListAPIViewBackend.as_view(), name='schedule'),
                  path('service/<int:pk>', viewService.as_view(), name='viewService'),
                  path('booking/<int:booking>/service_booking/', create_service_booking, name='service-booking-create'),
                  path('roles/<int:pk>/permissions/', AppointmentUserPermissionsView.as_view(),
                       name='roles-permissions'),
                  path('services/', viewServices.as_view(), name='view-services'),
                  path('get_times/<int:employee>/<date>', GetTimeFromService.as_view(), name='get-times'),
                  path('get_service_times/<int:service>/<date>', get_service_employee_availabilities,
                       name='get-service-times'),
                  path('get_employees_list/', GetEmployeesList.as_view(), name='employeeslist'),
                  path('create_employee/', CreateEmployeeApi.as_view(), name='createemployee'),
                  path('update_retrieve_employee/<int:employee>', UpdateRetrieveEmployee.as_view(),
                       name='updateRetrieveEmployee'),
                  # path('service/<int:pk>', viewService.as_view({'get':'retrieve'}), name='viewService'),
                  path('working_time/', Workingtime.as_view(), name='view-working-time'),
                  path('add_working_time/', addWorkingTime.as_view(), name='add-working-time'),
                  path('working_time/<int:employee>', Workingtime.as_view(), name='working-time-employee'),
                  path('get_custom_time/<int:pk>', RetrieveCustomTime.as_view(), name='get-custom-time'),
                  path('get_custom_time/<int:employee>/<int:pk>', RetrieveCustomTime.as_view(), name='get-custom-time'),
                  path('custom_times/', CustomTimes.as_view(), name='custom-times'),
                  path('custom_times/<int:employee>/', EmployeeCustomTimes.as_view(), name='employee-custom-time'),
                  path('add_custom_time/', addCustomTime.as_view(), name='add-custom-time'),

                  path('report/employee/', EmployeeReportAPIView.as_view(), name='employee-report'),
                  path('report/service/', ServiceReportAPIView.as_view(), name='service-report'),
              ] + router.urls
