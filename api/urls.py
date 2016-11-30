from __future__ import unicode_literals

from rest_framework.authtoken.views import obtain_auth_token
from rest_framework.routers import DefaultRouter

from django.conf.urls import url, include

from . import views


router = DefaultRouter()
router.register(r'forms', views.FormViewSet)
router.register(r'responses', views.SurveyResponseViewSet)
router.register(r'files', views.ResponseFileViewSet)

urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'^api-auth/', include('rest_framework.urls')),
    url(r'^api-token-auth/', obtain_auth_token)
]
