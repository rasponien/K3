# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-03-25 01:03
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('WildAnimalsRegister', '0002_auto_20170325_0101'),
    ]

    operations = [
        migrations.AlterField(
            model_name='animalobservation',
            name='last_seen_time',
            field=models.DateTimeField(),
        ),
    ]