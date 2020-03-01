from django.apps import AppConfig


class AppointmentConfig(AppConfig):
    name = 'appointment'

    def ready(self):
        from actstream import registry
        registry.register(self.get_model('Booking'))
