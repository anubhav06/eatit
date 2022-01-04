import re
from django.db import models
from django.contrib.auth.models import User
from restaurants.models import Restaurant, FoodItem

# User's cart
class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="cartOwner")
    food = models.ForeignKey(FoodItem, on_delete=models.CASCADE, related_name="cartFood", null=True , blank=True)
    qty = models.IntegerField(default=0)
    amount = models.DecimalField(max_digits=6, decimal_places=2)
    totalAmount = models.DecimalField(max_digits=7, decimal_places=2, default=0)

    # Serialize in JSON format for sending data to frontend
    def serializer(self):
        return {
            "id" : self.id,
            "user" : self.food.id,
            "food" : {
                "id" :  self.food.id,
                "restaurant" : {
                    "id" : self.food.restaurant.id,
                    "name" : self.food.restaurant.name,
                    "address" : self.food.restaurant.address,
                },
                "name" : self.food.name,
                "price" : self.food.price,
            },
            "qty" : self.qty,
            "amount" : self.amount,
            "totalAmount" : self.totalAmount,
        }

    def __str__(self):
        return f"{self.user} added {self.food} X {self.qty}"


# User's address
class Address(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='userAddress')
    area = models.CharField(max_length=1600)
    label = models.CharField(max_length=16)

    def __str__(self):
        return f"{self.user} = {self.area}"



## Stores the order details
#class OrderDetials(models.Model):
#    # User who has placed the order
#    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='userOrder')
#    # Restaurant for which the order is placed
#    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='restaurantOrder')
#    # Cart items which the user has added
#    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='cartOrder')
#    # Address selected/chosen by the user to deliver to
#    address = models.ForeignKey(Address, on_delete=models.CASCADE, related_name='addressOrder')
    
#    def __str__(self):
#        return f"{self.user}'s order for {self.restaurant}"

