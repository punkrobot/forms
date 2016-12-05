from __future__ import unicode_literals

import django_filters

from .models import FormResponse


class FormResponseFilter(django_filters.rest_framework.FilterSet):
    class Meta:
        model = FormResponse
        fields = ['form']
