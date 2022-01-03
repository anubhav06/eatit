# Generated by Django 3.2.6 on 2022-01-02 19:21

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('restaurants', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Cart',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('qty', models.IntegerField(default=0)),
                ('totalAmount', models.DecimalField(decimal_places=2, max_digits=6)),
                ('food', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='cartFood', to='restaurants.fooditem')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='cartOwner', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
