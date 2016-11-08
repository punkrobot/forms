from __future__ import unicode_literals

from rest_framework import serializers

from . import models


class FormSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Form
        fields = ('id', 'name', 'description', 'status', 'contents')


class ResponseSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=False, required=False)

    class Meta:
        model = models.Response
        fields = ('id', 'code', 'answer', 'question')


class FormResponseSerializer(serializers.ModelSerializer):
    form = serializers.PrimaryKeyRelatedField(queryset=models.Form.objects.all())
    answers = ResponseSerializer(many=True, source='response_set')

    class Meta:
        model = models.FormResponse
        fields = ('id', 'form', 'answers')

    def create(self, validated_data):
        answers_data = validated_data.pop('response_set')
        response = models.FormResponse.objects.create(**validated_data)

        for answer_data in answers_data:
            models.Response.objects.create(form_response=response, **answer_data)

        return response

    def update(self, instance, validated_data):
        answers_data = validated_data.pop('response_set')

        for answer_data in answers_data:
            models.Response.objects.update_or_create(id=answer_data['id'], defaults=answer_data)

        return instance
