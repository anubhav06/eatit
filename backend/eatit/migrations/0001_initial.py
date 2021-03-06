# Generated by Django 3.2.6 on 2022-01-06 10:05

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('restaurants', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Cart',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('qty', models.IntegerField(default=0)),
                ('amount', models.DecimalField(decimal_places=2, max_digits=6)),
                ('totalAmount', models.DecimalField(decimal_places=2, default=0, max_digits=7)),
                ('food', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='cartFood', to='restaurants.fooditem')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='cartOwner', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Address',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('area', models.CharField(max_length=1600)),
                ('label', models.CharField(max_length=16)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='userAddress', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='ActiveOrders',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField(auto_now_add=True)),
                ('time', models.TimeField(auto_now_add=True)),
                ('active', models.BooleanField(default=True)),
                ('address', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='addressOrder', to='eatit.address')),
                ('cart', models.ManyToManyField(to='eatit.Cart')),
                ('restaurant', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='restaurantOrder', to='restaurants.restaurant')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='userOrder', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
