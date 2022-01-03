import re
from django.db import models
from django.contrib.auth.models import User

from restaurants.models import FoodItem


# User's cart
class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="cartOwner")
    food = models.ForeignKey(FoodItem, on_delete=models.CASCADE, related_name="cartFood", null=True , blank=True)
    qty = models.IntegerField(default=0)
    amount = models.DecimalField(max_digits=6, decimal_places=2)
    totalAmount = models.DecimalField(max_digits=7, decimal_places=2, default=0)

    def __str__(self):
        return f"{self.user} added {self.food} X {self.qty}"