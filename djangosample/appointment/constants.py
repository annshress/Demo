from collections import namedtuple

SMS_MSG = """
    Your booking #{id} of {service} at {provider} is coming soon.

    WhyUnified Team
    """
EMAIL_SUBJECT = "Reminder about your booking"
EMAIL_BODY = """
        Dear {client_name},
        
        Your booking is coming soon.
        
        Booking ID: {id}
        Service: {service}
        Service Provider: {employee}
        Service Organization: {provider}
        Scheduled Time: {eta}
        
        Regards,

        WhyUnified Team
        """

RESERVATION_GAP = 30  # minutes
STATUS = namedtuple('STATUS', 'pending confirmed cancelled')(*range(3))
BOOKING_TYPE = namedtuple('BOOKING_TYPE', 'created_or_modified coming')(*range(2))
WORKING_DAYS = namedtuple('WORKING_DAYS', 'sunday monday tuesday wednesday thursday friday saturday')(*range(7))
ROLES = namedtuple('ROLES', 'administrator regular')('administrator', 'regular')

# possible roles
ADMINISTRATOR_PERMISSIONS = (
    "delete_servicesbooking",
    "change_servicesbooking",
    "delete_appointmentuser",
    # "access_users",
    "change_booking",
    "change_service",
    "view_service",
    "add_service",
    "add_customdate",
    # "access_backup_settings",
    # "view_employee",
    "change_workingtime",
    "view_customdate",
    "delete_workingtime",
    # "access_cron_job_settings",
    "access_booking",
    "delete_customdate",
    # "access_profile_settings",
    "add_booking",
    "view_appointmentuser",
    "add_workingtime",
    "view_workingtime",
    "view_role",
    "delete_booking",
    "change_customdate",
    # "access_schedules",
    # "access_email_settings",
    "delete_service",
    "view_booking",
    # "access_dashboard_settings",
    # "access_sms_settings",
    "add_appointmentuser",
    "add_servicesbooking",
    "set_permissions",
    "reset_permissions"
)
# all permissions available to administrator
PERMISSIONS = namedtuple('PERMISSIONS', ' '.join(ADMINISTRATOR_PERMISSIONS))(*ADMINISTRATOR_PERMISSIONS)
# all regular admin permissions
REGULAR_PERMISSIONS = (
    PERMISSIONS.add_customdate,
    PERMISSIONS.access_booking,
    # PERMISSIONS.access_employee,
    # PERMISSIONS.access_services,
    PERMISSIONS.add_servicesbooking,
    PERMISSIONS.add_workingtime,
    PERMISSIONS.change_booking,
    PERMISSIONS.change_servicesbooking,
    PERMISSIONS.change_customdate,
    PERMISSIONS.view_booking,
    PERMISSIONS.view_service,
    PERMISSIONS.view_workingtime,
)
DEFAULT_SEND_SMS_BEFORE = 5  # hours
DEFAULT_SEND_EMAIL_BEFORE = 10  # hours

CLIENT_NEW_ORDER_SMS = """
    Your order - #{uuid} at {company} has been received.

    {company}@WhyUnified Team
"""
CLIENT_NEW_ORDER_EMAIL_SUBJECT = "Your Appointment Booking-{uuid} has been received."
CLIENT_NEW_ORDER_EMAIL_BODY = """
    Thank you for your booking.

    ID: {uuid}
    
    Services
    {services}
    
    Personal details
    Name: {name}
    Phone: {contact}
    Email: {email}
    
    This is the price for your booking
    Price: {price}
    Tax: {tax}
    Total: {total}
    Deposit required to confirm your booking: {deposit}
    
    Additional notes:
    {notes}

    You are free to cancel using given url: {cancel_url}

    Regards,

    {company}@WhyUnified team
"""

CLIENT_CONFIRM_PAYMENT_SUBJECT = "Payment for Appointment Booking-{uuid} has been received."
CLIENT_CONFIRM_PAYMENT_BODY = """
    Your payment has been received. 
    We've received the payment for your booking and it is now confirmed.

    ID: {uuid}

    If you want to cancel your booking follow next link: {cancel_url}

    Thank you, we will contact you ASAP.

    {company}@WhyUnified team
"""

CLIENT_CANCEL_EMAIL_SUBJECT = "Your Appointment Booking-{uuid} has been cancelled."
CLIENT_CANCEL_EMAIL_BODY = """
    Your booking has been cancelled.
    
    ID: {uuid}

    See you next time!

    Regards,

    {company}@WhyUnified team
"""

EMPLOYEE_NEW_ORDER_SMS = """
    New appointment booking - #{uuid} has been received.

    {company}@WhyUnified Team
"""
EMPLOYEE_NEW_ORDER_EMAIL_SUBJECT = "New Appointment Booking-{uuid} has been received."
EMPLOYEE_NEW_ORDER_EMAIL_BODY = """
    New Appointment has been booked.

    ID: {uuid}
    
    Services
    {services}
    
    Personal details
    Name: {name}
    Phone: {contact}
    Email: {email}
    
    Additional notes:
    {notes}
    
    {company}@WhyUnified team
"""

EMPLOYEE_CONFIRM_PAYMENT_SMS = "Payment for Appointment Booking-{uuid} has been received."
EMPLOYEE_CONFIRM_PAYMENT_SUBJECT = "Payment for Appointment Booking-{uuid} has been received."
EMPLOYEE_CONFIRM_PAYMENT_BODY = """
    Payment for Appointment Booking-{uuid} has been received. 

    Appointment Booking ID: {uuid}

    {company}@WhyUnified team
"""

EMPLOYEE_CANCEL_EMAIL_SUBJECT = "Appointment Booking-{uuid} has been cancelled."
EMPLOYEE_CANCEL_EMAIL_BODY = """
    Appointment Booking-{uuid} has been cancelled.

    Appointment Booking ID: {uuid}
    
    {company}@WhyUnified team
"""
