from django.urls import path
from . import views
from .views import MyTokenObtainPairView

# Refer to: https://django-rest-framework-simplejwt.readthedocs.io/en/latest/getting_started.html#installation 
# for installation of JWT with DRF

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [ 
    path('', views.getRoutes, name="index"),
    path('register/', views.register, name="register" ),
    #path('notes/', views.getNotes, name="getNotes"),

    path('restaurants/', views.restaurants, name="restaurants"),
    path('restaurants/<int:id>', views.restaurantsFood, name="restaurantsFood"),

    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
