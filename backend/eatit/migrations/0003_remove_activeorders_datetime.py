# Generated by Django 3.2.6 on 2022-01-05 19:17

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('eatit', '0002_auto_20220106_0016'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='activeorders',
            name='datetime',
        ),
    ]
