from django.db import models
from django.db.models import fields
from rest_framework.serializers import ModelSerializer
from eatit.models import Cart, Address


# Creates JSON objects out of the Python objects
class CartSerializer(ModelSerializer):

    class Meta:
        model = Cart
        fields = '__all__'



class AddressSerializer(ModelSerializer):

    class Meta:
        model = Address
        fields = '__all__'