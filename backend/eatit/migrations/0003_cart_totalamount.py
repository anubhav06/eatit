# Generated by Django 3.2.6 on 2022-01-03 07:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('eatit', '0002_rename_totalamount_cart_amount'),
    ]

    operations = [
        migrations.AddField(
            model_name='cart',
            name='totalAmount',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=7),
        ),
    ]
