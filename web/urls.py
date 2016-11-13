from __future__ import unicode_literals

from django.conf.urls import url
from django.contrib.auth.views import login, logout

from . import views


urlpatterns = [
    url(r'^$', views.FormList.as_view(), name='form.list'),
    url(r'^formulario/nuevo$', views.FormCreate.as_view(), name='form.create'),
    url(r'^formulario/(?P<pk>[0-9]+)$', views.FormDetail.as_view(), name='form.view'),
    url(r'^formulario/(?P<pk>[0-9]+)/editar$', views.FormEdit.as_view(), name='form.edit'),
    url(r'^formulario/(?P<pk>[0-9]+)/borrar$', views.FormDelete.as_view(), name='form.delete'),

    url(r'^accounts/login/$', login, {'template_name': 'admin/login.html'}),
    url(r'^accounts/logout/$', logout),
]
