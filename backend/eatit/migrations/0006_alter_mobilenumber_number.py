# Generated by Django 3.2.6 on 2022-01-15 19:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('eatit', '0005_alter_mobilenumber_number'),
    ]

    operations = [
        migrations.AlterField(
            model_name='mobilenumber',
            name='number',
            field=models.BigIntegerField(default=None, unique=True),
        ),
    ]