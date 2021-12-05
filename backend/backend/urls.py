from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('eatit.api.urls')),
    path('restaurant/', include('restaurants.api.urls')),
]
