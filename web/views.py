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
    template_name = 'web/form_detail.html'


class FormEdit(LoginRequiredMixin, DetailView):
    model = models.Form
    context_object_name = 'form'
    template_name = 'web/form_builder.html'


class FormDelete(LoginRequiredMixin, DeleteView):
    model = models.Form
    context_object_name = 'form'
    template_name = 'web/form_delete.html'
    success_url = reverse_lazy('form.list')


class ResponseList(LoginRequiredMixin, ListView):
    template_name = 'web/response_list.html'
    context_object_name = 'responses'

    def get_queryset(self):
        return models.FormResponse.objects.filter(
            form_id=self.kwargs.get("pk", None)
        ).order_by('-created')

    def get_context_data(self, **kwargs):
        context = super(ResponseList, self).get_context_data(**kwargs)
        form_response = models.FormResponse.objects.filter(form_id=self.kwargs.get("pk", None))[:1]
        context["headers"] = models.Response.objects.filter(
            form_response=form_response
        ).order_by('code')

        return context


class ResponseDetail(LoginRequiredMixin, DetailView):
    model = models.FormResponse
    context_object_name = 'response'
    template_name = 'web/response_detail.html'

    def get_context_data(self, **kwargs):
        context = super(ResponseDetail, self).get_context_data(**kwargs)

        form_response_id = self.kwargs.get("pk", None)

        context["related"] = models.FormResponse.objects.filter(
            response__related=True, response__answer=form_response_id
        )

        return context
