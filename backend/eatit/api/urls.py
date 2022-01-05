from django.urls import path
from . import views
from .views import MyTokenObtainPairView

# Refer to: https://django-rest-framework-simplejwt.readthedocs.io/en/latest/getting_started.html#installation 
# for installation of JWT with DRF

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

# Refer to the corresponding view function for more detials of the url routes
urlpatterns = [ 
    path('', views.getRoutes, name="index"),
    path('register/', views.register, name="register" ),

    path('restaurants/', views.restaurants, name="restaurants"),
    path('restaurants/<int:id>', views.restaurantsFood, name="restaurantsFood"),
    path('restaurants/info/<int:id>', views.restaurantsInfo, name="restaurantsInfo"),
    
    path('get-cart-items/', views.getCartItems, name="getCartItems"),
    path('add-to-cart/<int:id>', views.addToCart, name="addToCart"),
    path('remove-from-cart/<int:id>', views.removeFromCart, name="removeFromCart"),

    # To add a user's address, and to get all the address added by the user
    path('add-address/', views.addAddress, name='addAddress'),
    path('get-address/', views.getAddress, name='getAddress'),

    # To place an order, to get a user's existing orders, and to get the logged in user's info
    path('place-order/', views.placeOrder, name="placeOrder"),
    path('get-orders/', views.getOrders, name='getOrders'),
    path('get-user-info/', views.getUserInfo, name='getUserInfo'),

    # For user authentication
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
