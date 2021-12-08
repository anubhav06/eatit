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
    path('register/', views.register, name="restaurantRegister"),

    path('add-food-item/', views.addFoodItem, name="addFoodItem"),
    path('manage-food-items/', views.manageFoodItems, name="manageFoodItems"),
    path('manage-food-items/<int:id>', views.editFoodItems, name="editFoodItems"),
    path('manage-food-items/<int:id>/update', views.updateFoodItem, name="updateFoodItem"),
    path('manage-food-items/<int:id>/delete', views.deleteFoodItem, name="deleteFoodItem"),

    #path('restaurants/', views.restaurants, name="restaurants"),

    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
