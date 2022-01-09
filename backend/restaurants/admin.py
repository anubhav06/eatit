from django.contrib import admin

# Register your models here.
from .models import Restaurant, FoodItem, Stripe

admin.site.register(Restaurant)
admin.site.register(FoodItem)
admin.site.register(Stripe)