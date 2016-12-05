from __future__ import unicode_literals

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter
from rest_framework import viewsets, permissions
from rest_framework.decorators import list_route
from rest_framework.response import Response

from . import models, serializers, filters


class FormViewSet(viewsets.ModelViewSet):
    queryset = models.Form.objects.all()
    serializer_class = serializers.FormSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @list_route()
    def simple(self, request):
        forms = models.Form.objects.all()
        serializer = serializers.SimpleFormSerializer(forms, many=True)
        return Response(serializer.data)


class FormResponseViewSet(viewsets.ModelViewSet):
    queryset = models.FormResponse.objects.all()
    serializer_class = serializers.FormResponseSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    filter_backends = (SearchFilter, DjangoFilterBackend)
    filter_class = filters.FormResponseFilter
    search_fields = ('response__answer',)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ResponseFileViewSet(viewsets.ModelViewSet):
    queryset = models.ResponseFile.objects.all()
    serializer_class = serializers.ResponseFileSerializer

    def pre_save(self, obj):
        obj.file = self.request.FILES.get('file')
