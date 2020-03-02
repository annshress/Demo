from django.contrib.sessions.models import Session
from django.http import JsonResponse
from django.urls import resolve
from accounts.models import User, SecurityQuestion


class SecurityQuestionMiddleware:
    # Called only once when the web server starts
    def __init__(self, get_response):
        self.get_response = get_response

    def throwerror(self):
        return JsonResponse(data=dict(message="Security Question Required", url="reverse/tosecurity"),
                            status=401)

    def security_check(self, request):
        question = request.user.security_question
        current_url = resolve(request.path_info).url_name
        if question.required and request.user.is_superuser == False and current_url != "updatesecurityquestion" and current_url != "getsecurityquestion":
            return self.throwerror()
        else:
            return True

    def flaguserquestion(self, user):
        return SecurityQuestion.objects.filter(pk=user.security_question.id).update(required=1)

    def __call__(self, request):
        # Code to be executed for each request before
        # the view (and later middleware) are called.
        has_access = True
        if request.user.is_authenticated:
            question = request.user.security_question
            if question:
                check = self.security_check(request)
                useragent = request.META['HTTP_USER_AGENT']
                try:
                    userexist = User.objects.filter(id=request.user.id, userlogs__user_agent=useragent).get()
                    if (userexist):
                        self.security_check(request)
        
        #############
        # TRUNCATED #
        #############


        return response
