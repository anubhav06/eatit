# Generated by Django 3.2.6 on 2022-01-04 17:24

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('restaurants', '0001_initial'),
        ('eatit', '0003_orderdetails'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='OrderDetails',
            new_name='ActiveOrders',
        ),
    ]
