from __future__ import unicode_literals

from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy
from django.views.generic import ListView, TemplateView, DetailView, DeleteView

from api import models


class FormList(LoginRequiredMixin, ListView):
    template_name = 'web/form_list.html'
    context_object_name = 'forms'

    def get_queryset(self):
        return models.Form.objects.order_by('-created')


class FormCreate(LoginRequiredMixin, TemplateView):
    template_name = 'web/form_builder.html'


class FormDetail(LoginRequiredMixin, DetailView):
    model = models.Form
    context_object_name = 'form'
    template_name = 'web/form_view.html'


class FormEdit(LoginRequiredMixin, DetailView):
    model = models.Form
    context_object_name = 'form'
    template_name = 'web/form_builder.html'


class FormDelete(LoginRequiredMixin, DeleteView):
    model = models.Form
    context_object_name = 'form'
    template_name = 'web/form_delete.html'
    success_url = reverse_lazy('form.list')
