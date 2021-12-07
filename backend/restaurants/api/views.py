from django.contrib.auth import models
from django.core.exceptions import ObjectDoesNotExist
from django.db.utils import Error
from django.http import JsonResponse
from django.views.generic.base import RedirectView
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from django.db import IntegrityError, connections
from rest_framework import status
from restaurants.api import serializers
from restaurants.models import Restaurant, FoodItem, User
from django.contrib.auth.models import Group
from .serializers import FoodItemSerializer

from rest_framework.reverse import reverse


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
@api_view(['POST'])
def register(request):
    email = request.data["email"]
    name = request.data["name"]
    address = request.data["address"]

    # Ensure password matches confirmation
    password = request.data["password"]
    confirmation = request.data["confirmPassword"]
    if password != confirmation:
        return Response("ERROR: Passwords don't match", status=status.HTTP_406_NOT_ACCEPTABLE)

    # Input validation. Check if all data is provided
    if not email or not name or not address or not password or not confirmation:
        return Response('All data is required')
    if len(name) >= 64 or len(address) >= 320:
        return Response('Max size exceeded! Enter a smaller value')

    # Attempt to create new user
    try:
        # For restaurants, set their username as their email
        user = User.objects.create_user(username=email, email=email, password=password)
        user.save()
    except IntegrityError:
        return Response("ERROR: Email already taken", status=status.HTTP_406_NOT_ACCEPTABLE)


    # Associate user details with the Restaurant model. Store the address, name etc.
    try:
        user = User.objects.get(username=email)
        restaurant = Restaurant.objects.create(user=user, name=name, address=address)
        restaurant.save()
    except IntegrityError:
        return Response(IntegrityError)
    
    # Add it to the restaurants groups
    group = Group.objects.get(name='Restaurant') 
    group.user_set.add(user)


    return Response('Registered Successfully from backend')



@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/token',
        '/api/token/refresh',
        '/api/register',
    ]

    return Response(routes)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addFoodItem(request):
    # Get items from frontend
    name = request.data["name"]
    description = request.data["description"]
    price = request.data["price"]
    image = request.data["image"]

    # Input validation. Check if all data is provided
    if not name or not description or not price or image == 'undefined':
        return Response('All data is required')
    if len(name) >= 32 or len(description) >= 320 or len(str(price)) > 6:
        return Response('Max size exceeded! Enter a smaller value')

    # Get the logged in user's restaurant
    try:
        restaurant = Restaurant.objects.get(user= request.user)
    except Error:
        return Response('No restaurant is associated with the logged in user')

    # Save the details obtained from frontend about food item
    try:
        data = FoodItem(restaurant=restaurant, name=name, description=description, price=price, image=image)
        data.save()
    except Error:
        return Response('Error while adding the food items')

    return Response('✅ Your food item has been succesfully added!')



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def manageFoodItems(request):

    restaurant = Restaurant.objects.get(user= request.user)
    foodItems = FoodItem.objects.filter(restaurant=restaurant)
    serializer = FoodItemSerializer(foodItems, many=True)
    return Response(serializer.data)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def editFoodItems(request, id):

    restaurant = Restaurant.objects.get(user= request.user)
    foodItems = FoodItem.objects.filter(pk=id, restaurant=restaurant)
    serializer = FoodItemSerializer(foodItems, many=True)
    return Response(serializer.data)



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def updateFoodItem(request, id):
    
    name = request.data["name"]
    description = request.data["description"]
    price = request.data["price"]
    image = request.data["image"]

    # Get the logged in user's restaurant
    try:
        restaurant = Restaurant.objects.get(user= request.user)
    except Error:
        return Response('Error 1')

    # Update the details obtained from frontend about food item
    try:
        foodItem = FoodItem.objects.get(id=id)
        foodItem.name = name
        foodItem.description = description
        foodItem.price = price
        # If an image is provided, then update the image, if not provided, then let the original one remain as it is
        if image != 'undefined':
            foodItem.image = image
        foodItem.save()
    except Error:
        return Response('Error: ', Error)

    return Response('✅ Your food item has been succesfully updated!')
    


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deleteFoodItem(request, id):
    
    restaurant = Restaurant.objects.get(user= request.user)
    # Get the requested food item by its ID and delete that.
    foodItem = FoodItem.objects.get(id=id, restaurant=restaurant)
    foodItem.delete()
    
    return Response(' ✅ DELETED food item successfully! ')