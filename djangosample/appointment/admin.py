from django.contrib import admin
from .models.bookings import Booking, Customer, ServicesBooking
from .models.services import Service, WorkingTime, CustomDate



class WorkingTimeAdminMode(admin.ModelAdmin):
    list_display = ['company', 'saturday_off', 'sunday_off']


admin.site.register(Booking)
admin.site.register(ServicesBooking)
admin.site.register(Service)
admin.site.register(CustomDate)
admin.site.register(Customer)

admin.site.register(WorkingTime, WorkingTimeAdminMode)
