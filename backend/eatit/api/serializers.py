from rest_framework.serializers import ModelSerializer
from eatit.models import Cart


# Creates JSON objects out of the Python objects
class CartSerializer(ModelSerializer):

    class Meta:
        model = Cart
        fields = '__all__'