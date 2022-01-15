from django.contrib import admin
from .models import Cart, Address, ActiveOrders, MobileNumber
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User

# For admin view
admin.site.register(ActiveOrders)
admin.site.register(Cart)
admin.site.register(Address)


# To display the user's phone number as a field in the admin view of user's model
# Refer: https://docs.djangoproject.com/en/4.0/topics/auth/customizing/#extending-the-existing-user-model

class MobileInline(admin.StackedInline):
    model = MobileNumber
    can_delete = False
    verbose_name_plural = 'number'

class UserAdmin(BaseUserAdmin):
    inlines = (MobileInline,)

# Re-Register UserAdmin
admin.site.unregister(User)
admin.site.register(User, UserAdmin)
