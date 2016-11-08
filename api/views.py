from __future__ import unicode_literals

from rest_framework import viewsets, permissions


from . import models, serializers


class FormViewSet(viewsets.ModelViewSet):
    queryset = models.Form.objects.all()
    serializer_class = serializers.FormSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class SurveyResponseViewSet(viewsets.ModelViewSet):
    queryset = models.FormResponse.objects.all()
    serializer_class = serializers.FormResponseSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
