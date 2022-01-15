from django.contrib import admin
from .models import Cart, Address, ActiveOrders, User

# For admin view
admin.site.register(User)
admin.site.register(ActiveOrders)
admin.site.register(Cart)
admin.site.register(Address)
