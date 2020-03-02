from rest_framework import routers

from accounts.api.application.views import ApplicationCategoryViewSet, ActivatedApplicationViewSet

router = routers.DefaultRouter()
router.register("categories", ApplicationCategoryViewSet, base_name="category")
router.register("solutions", ActivatedApplicationViewSet, base_name="application")

urlpatterns = [] + router.urls
