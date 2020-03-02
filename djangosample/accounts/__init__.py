from collections import namedtuple

default_app_config = 'accounts.apps.AccountsConfig'

# this list is for activation/deactivation page for this business account
authorized_apps_list = ['appointment',
                        'shoppingcart',
                        'emails',
                        'invoicemanager',
                        'hotel_booking',
                        'cleaning',
                        'food_delivery',
                        'crm',
                        'newsletter',
                        'class_scheduling',
                        'cloudphone']
AUTHORIZED_APPS_CHOICES = namedtuple("AUTHORIZED_APPS", authorized_apps_list)(*authorized_apps_list)
# effects:
#   ActivatedApplication Model,
#   CustomFeed.map_category_to_app_model
