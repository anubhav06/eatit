from rest_framework.serializers import ModelSerializer
from restaurants.api.serializers import RestaurantSerializer, FoodItemSerializer
from eatit.models import Cart, Address, User, ActiveOrders


# Creates JSON objects out of the Python objects
class CartSerializer(ModelSerializer):
    food = FoodItemSerializer(read_only=True)
    class Meta:
        model = Cart
        fields = ['id', 'user', 'food', 'qty', 'amount', 'totalAmount']


class AddressSerializer(ModelSerializer):

    class Meta:
        model = Address
        fields = '__all__'


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'username', 'first_name', 'last_name']


class ActiveOrdersSerializer(ModelSerializer):

    restaurant = RestaurantSerializer(read_only=True)
    cart = CartSerializer(read_only=True, many=True)
    address = AddressSerializer(read_only=True)
    
    class Meta:
        model = ActiveOrders
        fields = ['id', 'restaurant', 'cart', 'address', 'date', 'time', 'active']
