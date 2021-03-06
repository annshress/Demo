from datetime import datetime

from celery.app import shared_task

from appointment.constants import SMS_MSG, EMAIL_BODY, EMAIL_SUBJECT, STATUS
from appointment.models.configurations import Configuration
from libs.logutils import setup_loghandlers

logger = setup_loghandlers()


@shared_task
def send_sms_task(pk=None, **kwargs):
    from appointment.models import ServicesBooking

    obj = ServicesBooking.objects.get(pk=pk)
    logger.info('SMS task started, sending sms for service-booking: %d' % obj.id)
    msg = SMS_MSG
    message = msg.format(id=obj.booking.booking_id,
                         service=obj.service.name,
                         provider=obj.booking.company.name)
    message = kwargs.get('message', message)
    send_to_customer = kwargs.get('send_to_customer', True)
    send_to_employee = kwargs.get('send_to_employee', False)
    try:
        obj.send_sms_notification(message, send_to_customer=send_to_customer, send_to_employee=send_to_employee)
        logger.debug('Successfully sent SMS, service-booking #%d' % obj.id)
        return 0
    except Exception as e:
        logger.debug('Reason: %s' % e)
        logger.debug('Failed to send SMS, service-booking #%d' % obj.id)
        return 1


@shared_task
def send_email_task(pk=None, **kwargs):
    from appointment.models import ServicesBooking

    obj = ServicesBooking.objects.get(pk=pk)

        
        #############
        # TRUNCATED #
        #############


    except Exception as e:
        logger.debug('Reason: %s' % e)
        logger.debug('Failed to send EMAIL, service-booking #%d' % obj.id)
        return 1


@shared_task
def send_booking_email_task(pk=None, **kwargs):
    from appointment.models import Booking

    try:
        booking = Booking.objects.get(pk=pk)
    except Booking.DoesNotExist:
        logger.error('Booking of ID #%d does not exist' % pk)
    logger.info('Email task started, sending email for booking: %d' % pk)
    try:
        conf = booking.company.appointment_configuration
    except AttributeError:
        conf = Configuration.objects.create(company=booking.company)
    client_msg = {
        STATUS.pending: conf.client_new_order_email,
        STATUS.confirmed: conf.client_payment_confirm_email,
        STATUS.cancelled: conf.client_cancel_email
    }[booking.status].format(**booking.get_email_kwargs())
    employee_msg = {
        STATUS.pending: conf.employee_new_order_email,
        STATUS.confirmed: conf.employee_payment_confirm_email,
        STATUS.cancelled: conf.employee_cancel_email
    }[booking.status].format(**booking.get_email_kwargs())
        
        #############
        # TRUNCATED #
        #############


    logger.debug('Sending to customer ({}) and employee ({})'.format(send_to_customer, send_to_employee))
    try:
        booking.send_email_notification(subject=client_subject,
                                        body=client_msg,
                                        send_to_customer=send_to_customer,
                                        send_to_employee=False)
        booking.send_email_notification(subject=employee_subject,
                                        body=employee_msg,
                                        send_to_customer=False,
                                        send_to_employee=send_to_employee)
        logger.info('Successfully sent EMAIL, booking #%d' % booking.id)
        return 0
    except Exception as e:
        logger.debug('Reason: %s' % e)
        logger.error('Failed to send EMAIL, booking #%d' % booking.id)
        return 1
