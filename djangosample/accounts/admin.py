from django.contrib import admin
from .models import User, Company, Employee, ApplicationCategory, ActivatedApplication, Widget, ActivatedWidget, \
    SecurityQuestion, Question, UserLogs

# Register your models here.
admin.site.register(User)
admin.site.register(Company)
admin.site.register(Employee)
admin.site.register(ApplicationCategory)
admin.site.register(ActivatedApplication)
admin.site.register(Widget)
admin.site.register(ActivatedWidget)
admin.site.register(Question)
admin.site.register(SecurityQuestion)
admin.site.register(UserLogs)
