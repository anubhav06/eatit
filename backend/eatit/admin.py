from django.contrib import admin
from .models import Cart, Address

# For admin view
admin.site.register(Cart)
admin.site.register(Address)
