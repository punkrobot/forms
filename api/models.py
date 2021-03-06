from __future__ import unicode_literals

from model_utils import Choices
from model_utils.fields import StatusField
from model_utils.models import TimeStampedModel

from django.db import models
from django.contrib.auth.models import User
from django.contrib.postgres.fields import JSONField
from django.utils.encoding import python_2_unicode_compatible
from django.utils.translation import ugettext_lazy as _


@python_2_unicode_compatible
class Form(TimeStampedModel):
    QUESTION_TYPES = (
        ('header', _('Header')),
        ('text', _('Text')),
        ('list', _('List')),
        ('table', _('Table')),
        ('file', _('File')),
        ('related', _('Related Form'))
    )

    COLUMN_TYPES = (
        ('text', _('Text')),
        ('list', _('List')),
        ('radio', _('Radio')),
        ('checkbox', _('Checkbox'))
    )

    FORM_STATUS = Choices(
        ('editable', _('Editable')),
        ('active', _('Active')),
        ('closed', _('Closed'))
    )

    name = models.CharField(_('name'), max_length=255)
    description = models.TextField(_('description'))
    status = StatusField(_('status'), choices_name='FORM_STATUS')
    user = models.ForeignKey(User, verbose_name=_('user'))

    contents = JSONField(_('contents'))

    class Meta:
        verbose_name = _('form')
        verbose_name_plural = _('forms')

    def __str__(self):
        return self.name


@python_2_unicode_compatible
class FormResponse(TimeStampedModel):
    form = models.ForeignKey(Form, verbose_name=_('form'))
    user = models.ForeignKey(User, verbose_name=_('user'))

    class Meta:
        verbose_name = _('form response')
        verbose_name_plural = _('form responses')

    def answers(self):
        return self.response_set.order_by('code')

    def __str__(self):
        return '%s - %s' % (self.form.name, self.user.username)


@python_2_unicode_compatible
class Response(models.Model):
    code = models.CharField(_('code'), max_length=10)
    question = models.CharField(_('question'), max_length=255)
    answer = models.CharField(_('answer'), max_length=255, blank=True)
    label = models.CharField(_('label'), max_length=255, blank=True)
    related = models.BooleanField(_('realted'), default=False)

    form_response = models.ForeignKey(FormResponse, verbose_name=_('form response'))

    class Meta:
        verbose_name = _('response')
        verbose_name_plural = _('responses')

    def __str__(self):
        return self.answer


class ResponseFile(models.Model):
    file = models.FileField(verbose_name=_('file'))
    response = models.ForeignKey(Response, verbose_name=_('response'))

    class Meta:
        verbose_name = _('file')
        verbose_name_plural = _('files')
