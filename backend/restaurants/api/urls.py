from django.urls import path
from . import views
from .views import MyTokenObtainPairView

# Refer to: https://django-rest-framework-simplejwt.readthedocs.io/en/latest/getting_started.html#installation 
# for installation of JWT with DRF
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

# Refer to the corresponding view function for detailed explanation of the url routes
urlpatterns = [ 
    path('', views.getRoutes, name="index"),
    path('register/', views.register, name="restaurantRegister"),

    # To apply CRUD operations on food items
    path('add-food-item/', views.addFoodItem, name="addFoodItem"),
    path('manage-food-items/', views.manageFoodItems, name="manageFoodItems"),
    path('manage-food-items/<int:id>', views.editFoodItems, name="editFoodItems"),
    path('manage-food-items/<int:id>/update', views.updateFoodItem, name="updateFoodItem"),
    path('manage-food-items/<int:id>/delete', views.deleteFoodItem, name="deleteFoodItem"),

    # To get all the orders of the logged in restaurant
    path('get-orders/', views.getOrders, name='getOrders'),
    path('update-order-status/<int:id>', views.updateOrderStatus, name='updateOrderStatus'),

    # For payment integration using Stripe
    path('create-stripe-account/', views.createStripeAccount, name='createStripeAccount'),
    path('complete-stripe-account/', views.completeStripeAccount, name='completeStripeAccount'),
    path('create-stripe-account/get-details/', views.stripeGetDetails, name='stripeGetDetails'),
    path('create-stripe-account/refresh-url/', views.stripeRefreshURL, name='stripeRefreshURL'),
    path('create-stripe-account/return-url/', views.stripeReturnURL, name='stripeReturnURL'),

    # For user authentication
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
