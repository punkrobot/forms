# -*- coding: utf-8 -*-
# Generated by Django 1.10.3 on 2016-11-28 21:01
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_response_label'),
    ]

    operations = [
        migrations.CreateModel(
            name='ResponseFile',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('file', models.FileField(upload_to=b'', verbose_name='file')),
                ('response', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.Response', verbose_name='response')),
            ],
            options={
                'verbose_name': 'file',
                'verbose_name_plural': 'files',
            },
        ),
    ]
