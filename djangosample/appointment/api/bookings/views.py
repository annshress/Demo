from rest_framework import mixins, viewsets, generics
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED

from appointment.api.bookings.serializers import BookingModelSerializer, BookingModelMinimalSerializer, \
    ServiceBookingExportSerializer, ServicesBookingSerializer, ScheduleSerializer
from appointment.api.filters import BookingFilter, ScheduleFilter
from appointment.mixins import AppointmentAppCheckMixin
from libs.mixins import CompanyPermissionCheckMixin, SetCompanySerializerMixin
from appointment.api.serializers import SmsSerializer, EmailSerializer
from libs.serializers import EmptySerializer
from appointment.models import Booking, ServicesBooking
from appointment.permissions import BookingMenuPermission


class BookingModelViewSet(AppointmentAppCheckMixin,
                          mixins.CreateModelMixin,
                          viewsets.GenericViewSet):
    """
        Based on company ID,

        customers can see its services
        customers can see its employees available for appointment

        In order to make an appointment,
            choose a service, an employee, book time slot
            on submit, show along with the prices
            add client information
            show the terms and condition
            submit along with the client information
    """
    serializer_class = BookingModelSerializer
    
    def get_serializer_context(self):
        from accounts.models import Company
        context = super(BookingModelViewSet, self).get_serializer_context()
        context.update(dict(company=Company.objects.get(id=self.kwargs["company"])))
        return context

    def create(self, request, *args, **kwargs):
        super(BookingModelViewSet, self).create(request, *args, **kwargs)
        return Response(status=HTTP_201_CREATED)


class AdminBookingModelViewSet(CompanyPermissionCheckMixin,
                               AppointmentAppCheckMixin,
                               SetCompanySerializerMixin,
                               viewsets.ModelViewSet):
        
        #############
        # TRUNCATED #
        #############


    def create(self, request, *args, **kwargs):
        super(AdminBookingModelViewSet, self).create(request, *args, **kwargs)
        return Response(status=HTTP_201_CREATED)

    @action(methods=["POST"], detail=False)
    def export(self, request, company=None):
        if not request.data:
            return Response(dict(message="Expected values: `date`, `bookings` for filtering"),
                            status=400)
        exports = ServicesBooking.objects.get_export_data(**request.data)
        serialized_exports = ServiceBookingExportSerializer(exports, many=True).data
        # todo might need to return csv | front can create it based on response | django has xlsx module (check restro)
        return Response(data=serialized_exports, status=200)


class AdminServiceBookingModelViewSet(CompanyPermissionCheckMixin,
                                      AppointmentAppCheckMixin,
                                      SetCompanySerializerMixin,
                                      mixins.CreateModelMixin,
                                      mixins.DestroyModelMixin,
                                      viewsets.GenericViewSet):
    serializer_class = ServicesBookingSerializer
    queryset = ServicesBooking.objects.all()
    permission_classes = [IsAuthenticated, BookingMenuPermission]

    def create(self, request, *args, **kwargs):
        self.booking = kwargs.get("booking")
        return super(AdminServiceBookingModelViewSet, self).create(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(booking_id=self.booking)

    def get_serializer_class(self):
        if self.action == "send_sms":
            return SmsSerializer
        elif self.action == "send_email":
            return EmailSerializer
        return super(AdminServiceBookingModelViewSet, self).get_serializer_class()

    def get_queryset(self):
        return super(AdminServiceBookingModelViewSet, self).get_queryset().filter(
            booking__company=self.company
        )

    @action(methods=["POST"], detail=True)
    def send_sms(self, request, company=None, pk=None):
        serializer = self.get_serializer_class()(data=request.data)
        if not serializer.is_valid():
            return Response(data=serializer.errors,
                            status=400)
        # serializer.save()  # todo uncommment, once sms is setup
        return Response(data={"message": "Cannot send right now. Sorry. Reach developer team."},
                        status=400)
        # return Response(data={"message": "Your email is queued for sending."},
        #                 status=200)

    @action(methods=["POST"], detail=True)
    def send_email(self, request, company=None, pk=None):
        serializer = self.get_serializer_class()(data=request.data)
        if not serializer.is_valid():
            return Response(data=serializer.errors,
                            status=400)
        serializer.save()
        return Response(data={"message": "Your email is queued for sending."},
                        status=200)


class ServicesBookingListAPIView(generics.ListAPIView):
    queryset = ServicesBooking.objects.all()
    filterset_class = ScheduleFilter
    serializer_class = ScheduleSerializer


class ServicesBookingListAPIViewBackend(generics.ListAPIView):
    queryset = ServicesBooking.objects.all()
    filterset_class = ScheduleFilter
    serializer_class = ScheduleSerializer

    def get_queryset(self):
        return super(ServicesBookingListAPIViewBackend, self).get_queryset().filter(
            booking__company=self.kwargs.get('company')
        )
