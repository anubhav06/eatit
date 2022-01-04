from django.contrib import admin
from .models import Cart, Address, ActiveOrders

# For admin view
admin.site.register(ActiveOrders)
admin.site.register(Cart)
admin.site.register(Address)
