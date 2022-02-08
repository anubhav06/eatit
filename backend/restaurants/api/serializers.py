from rest_framework.serializers import ModelSerializer
from restaurants.models import FoodItem, Restaurant


# Creates JSON objects out of the Python objects
class FoodItemSerializer(ModelSerializer):
    class Meta:
        model = FoodItem
        fields = '__all__'


class RestaurantSerializer(ModelSerializer):
    class Meta:
        model = Restaurant
        fields = '__all__'
