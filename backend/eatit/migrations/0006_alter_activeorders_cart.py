# Generated by Django 3.2.6 on 2022-01-04 17:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('eatit', '0005_auto_20220104_2301'),
    ]

    operations = [
        migrations.AlterField(
            model_name='activeorders',
            name='cart',
            field=models.ManyToManyField(default=None, to='eatit.Cart'),
        ),
    ]
