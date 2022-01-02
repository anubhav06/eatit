import re
from django.core.exceptions import ObjectDoesNotExist
from django.db.utils import Error
from django.views.generic.base import RedirectView
from rest_framework import permissions, serializers
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from django.db import IntegrityError
from rest_framework import status
from eatit.api.serializers import CartSerializer
from eatit.models import Cart

from eatit.models import User
from rest_framework.reverse import reverse

from restaurants.models import Restaurant, FoodItem
from restaurants.api.serializers import RestaurantSerializer, FoodItemSerializer



# For customizing the token claims: (whatever value we want)
# Refer here for more details: https://django-rest-framework-simplejwt.readthedocs.io/en/latest/customizing_token_claims.html

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        
        if user.groups.filter(name="Restaurant").exists():
            token['group'] = "Restaurant"
        else:
            token['group'] = "None"
        # ...

        return token


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer




# User registration logic
@api_view(['GET', 'POST'])
def register(request):
    username = request.data["username"]
    email = request.data["email"]

    # Ensure password matches confirmation
    password = request.data["password"]
    confirmation = request.data["confirmPassword"]
    if password != confirmation:
        return Response("ERROR: Passwords don't match", status=status.HTTP_406_NOT_ACCEPTABLE)
    
    # Input validation. Check if all data is provided
    if not email or not username or not password or not confirmation:
        return Response('All data is required')

    # Attempt to create new user
    try:
        user = User.objects.create_user(username, email, password)
        user.save()
    except IntegrityError:
        return Response("ERROR: Username already taken", status=status.HTTP_406_NOT_ACCEPTABLE)
    return Response('Registered Successfully from backend')



@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/token',
        '/api/token/refresh',
        '/api/register',
    ]

    return Response(routes)



# To view all the available/registered restaurants
@api_view(['GET'])
def restaurants(request):
    
    # Uses the restaurant model from the 'restaurants' app
    restaurants = Restaurant.objects.all()
    serializer = RestaurantSerializer(restaurants, many=True)
    return Response(serializer.data)
    

# To get the food items of the requested restaurant
@api_view(['GET'])
def restaurantsFood(request, id):

    try:
        # Get the requested restaurant
        restaurant = Restaurant.objects.get(id=id)
        # Get the food items of the above restaurant
        restaurantsFood = FoodItem.objects.filter(restaurant = restaurant)
    except :
        return Response('Not found')
    
    serializer = FoodItemSerializer(restaurantsFood, many=True)
    return Response(serializer.data)


# To get the info of the requested restaurant
@api_view(['GET'])
def restaurantsInfo(request, id):

    try:
        # Get the requested restaurant
        restaurant = Restaurant.objects.filter(id=id)
    except KeyError:
        return Response('Not found')

    serializer = RestaurantSerializer(restaurant, many=True)
    return Response(serializer.data)



# To get the items in the cart of the requested user
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getCartItems(request):
    
    cart = Cart.objects.filter(user=request.user)
    serializer = CartSerializer(cart, many=True)

    return Response(serializer.data)
    

# To add a food item to cart
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addToCart(request, id):
    
    # Add the food item to the user's cart
    try:
        # Get the requested foodItem
        food = FoodItem.objects.get(id=id)

        # If the user's cart contains the requested food item, then increase it's quantity by 1
        try:
            getFood =  Cart.objects.get(food=food)
            getFood.qty += 1
            getFood.save()
        # If the cart doesn't contain the food, then add it to cart and set quantity to 1
        except ObjectDoesNotExist :
            addItem = Cart(user=request.user, food=food, qty=1)
            addItem.save()
            
        # Get all the cart items of the requested user (for passing to serializer)
        cart = Cart.objects.get(user=request.user, id=id)
    
    # If a request is made with an invalid food ID, i.e food item doesn't exist, then return error
    except KeyError:
        return Response('Not found')
    
    # Serialize the cart for sending to frontend in appropriate format
    serializer = CartSerializer(cart)
    return Response(serializer.data)
    
