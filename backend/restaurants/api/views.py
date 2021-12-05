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

from django.db import IntegrityError
from rest_framework import status
from restaurants.models import Restaurant, FoodItem, User
from django.contrib.auth.models import Group

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
@api_view(['GET', 'POST'])
def register(request):
    email = request.data["email"]
    name = request.data["name"]
    address = request.data["address"]

    # Ensure password matches confirmation
    password = request.data["password"]
    confirmation = request.data["confirmPassword"]
    if password != confirmation:
        return Response("ERROR: Passwords don't match", status=status.HTTP_406_NOT_ACCEPTABLE)

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