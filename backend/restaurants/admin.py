from django.contrib import admin

# Register your models here.
from .models import Restaurant, FoodItem

admin.site.register(Restaurant)
admin.site.register(FoodItem)