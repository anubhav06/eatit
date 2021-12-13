from django.db.utils import Error
from django.http import JsonResponse
from django.views.generic.base import RedirectView
from rest_framework import permissions, serializers
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from django.db import IntegrityError
from rest_framework import status

from eatit.models import Note, User
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
        restaurant = Restaurant.objects.get(id=id)
        restaurantsFood = FoodItem.objects.filter(restaurant = restaurant)
    except :
        return Response('Not found')
    
    serializer = FoodItemSerializer(restaurantsFood, many=True)
    return Response(serializer.data)


# To get the info of the requested restaurant
@api_view(['GET'])
def restaurantsInfo(request, id):

    try:
        restaurant = Restaurant.objects.filter(id=id)
    except KeyError:
        return Response('Not found')

    serializer = RestaurantSerializer(restaurant, many=True)
    return Response(serializer.data)
