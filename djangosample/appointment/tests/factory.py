from datetime import datetime

import factory

from accounts.tests.factory import EmployeeFactory, CompanyFactory, UserFactory
from appointment.models import Customer, Booking, ServicesBooking, Service, AppointmentUser, \
    WorkingTime, CustomDate
from appointment.constants import STATUS
from libs.constants import PAYMENT


class CustomerFactory(factory.DjangoModelFactory):
    FACTORY_FOR = Customer

    name = factory.Sequence(lambda n: "name%d" % n)
    email = factory.Sequence(lambda n: "email%d@example.com" % n)
    address_one = factory.Sequence(lambda n: "addr%d" % n)
    country = factory.Iterator(['Nepal', 'India', 'UAE'])
    city = factory.Sequence(lambda n: "city%d" % n)


class BookingFactory(factory.DjangoModelFactory):
    FACTORY_FOR = Booking

    booking_id = factory.Sequence(lambda n: "BOOKING%d" % n)
    status = factory.Iterator(STATUS)
    payment = factory.Iterator(PAYMENT)
    client = factory.SubFactory(CustomerFactory)


class ServiceFactory(factory.DjangoModelFactory):
    FACTORY_FOR = Service

    company = factory.SubFactory(CompanyFactory)
    length = 30
    before = 10
    after = 10
    price = factory.Iterator([40, 50, 60])


class ServicesBookingFactory(factory.DjangoModelFactory):
    FACTORY_FOR = ServicesBooking

    service = factory.SubFactory(ServiceFactory)
    employee = factory.SubFactory(EmployeeFactory)
    booking = factory.SubFactory(BookingFactory)
    booked_date = factory.LazyAttribute(lambda x: datetime.now().date())
    start_time = factory.LazyAttribute(lambda x: datetime.now().time())


class AppointmentUserFactory(factory.DjangoModelFactory):
    FACTORY_FOR = AppointmentUser

    auth_user = factory.SubFactory(UserFactory)
    company = factory.SubFactory(CompanyFactory)


class WorkingTimeFactory(factory.DjangoModelFactory):
    FACTORY_FOR = WorkingTime

    employee = factory.SubFactory(EmployeeFactory)
    company = factory.SubFactory(CompanyFactory)


class CustomDateFactory(factory.DjangoModelFactory):
    FACTORY_FOR = CustomDate

    employee = factory.SubFactory(EmployeeFactory)
    company = factory.SubFactory(CompanyFactory)
