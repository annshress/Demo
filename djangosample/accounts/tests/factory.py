import factory

from accounts.models import PermissionGroup, Customer
from crm.models.feeds import FeedComment
from ..models import User, Employee, Company, ShippingAddress


class UserFactory(factory.DjangoModelFactory):
    FACTORY_FOR = User

    first_name = factory.Sequence(lambda n: 'first_name%d' % n)
    last_name = factory.Sequence(lambda n: 'last_name%d' % n)
    username = factory.Sequence(lambda n: 'username%d' % n)
    email = factory.Sequence(lambda n: 'test%d@email.com' % n)
    contact = factory.Sequence(lambda n: '986756421%d' % n)


class CompanyFactory(factory.DjangoModelFactory):
    FACTORY_FOR = Company

    name = factory.Sequence(lambda n: 'company%d' % n)
    reg_number = factory.Sequence(lambda n: 'company_reg%d' % n)
    location = factory.Sequence(lambda n: 'location%d' % n)
    address = factory.Sequence(lambda n: 'address%d' % n)

    admin = factory.SubFactory(UserFactory)
    verified = True


class EmployeeFactory(factory.DjangoModelFactory):
    FACTORY_FOR = Employee

    user = factory.SubFactory(UserFactory)
    company = factory.SubFactory(CompanyFactory)


class PermissionGroupFactory(factory.DjangoModelFactory):
    FACTORY_FOR = PermissionGroup

    company = factory.SubFactory(CompanyFactory)
    name = factory.Sequence(lambda n: 'name %d' % n)
    # permissions


class CustomerFactory(factory.DjangoModelFactory):
    FACTORY_FOR = Customer

    user = factory.SubFactory(UserFactory)


class ShippingAddressFactory(factory.DjangoModelFactory):
    FACTORY_FOR = ShippingAddress

    client = factory.SubFactory(UserFactory)
    country = factory.Iterator(['us', 'out'])
    state = factory.Sequence(lambda n: "State%d" % n)
    city = factory.Sequence(lambda n: "Thing-thing %d" % n)
    zip = factory.Sequence(lambda n: "Thing-thing %d" % n)
    address_1 = factory.Sequence(lambda n: "Thing-thing %d" % n)
    address_2 = factory.Sequence(lambda n: "Thing-thing %d" % n)
    is_default_shipping = False
    is_default_billing = False


class FeedCommentFactory(factory.DjangoModelFactory):
    FACTORY_FOR = FeedComment

    message = factory.Sequence(lambda n: "message %d" % n)
    company = factory.SubFactory(CompanyFactory)
    owner = factory.SubFactory(UserFactory)
    # action = provide it yourself
