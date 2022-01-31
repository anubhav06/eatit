from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken

from restaurants.api.serializers import FoodItemSerializer
from eatit.api.serializers import ActiveOrdersSerializer
from eatit.models import ActiveOrders, FoodItem
from restaurants.models import Restaurant


# For user(restaurant here) authentication using JWT
# Refer: https://stackoverflow.com/a/67046746/17729597 for more details
class RestaurantTestCase(TestCase):
    @property
    def bearer_token(self):

        user = User.objects.get(id=1)
        refresh = RefreshToken.for_user(user)
        return {"HTTP_AUTHORIZATION":f'Bearer {refresh.access_token}'}


# Tests for the 'restaurant' app
class RestaurantAppViewTestCase(RestaurantTestCase):
    
    def setUp(self):
        u1 = User.objects.create(username="restaurant1@example.com", password="restaurant1")
        u1.set_password("restaurant1")
        u1.save()
        u2 = User.objects.create(username="restaurant2@example.com", password="restaurant2")
        u2.set_password("restaurant2")
        u2.save()
        u3 = User.objects.create(username="restaurant3@example.com", password="restaurant3")
        u2.set_password("restaurant3")
        u3.save()
        
        r1 = Restaurant.objects.create(user=u1, name='Restaurant_1_Name', address='Restaurant_1_address', image="Restaurant_1_image")
        r1.save()
        r2 = Restaurant.objects.create(user=u2, name='Restaurant_2_Name', address='Restaurant_2_address', image="Restaurant_2_image")
        r2.save()
        r3 = Restaurant.objects.create(user=u3, name='Restaurant_3_Name', address='Restaurant_3_address', image="Restaurant_3_image")
        r3.save()

        f1 = FoodItem.objects.create(id=1, restaurant=r1 ,name="food1", description="food1 desc", price="100", image="food1_img")
        f1.save()
        f2 = FoodItem.objects.create(id=2, restaurant=r1, name="food2", description="food2 desc", price="200", image="food2_img")
        f2.save()

        

    
    def test_get_restaurantOrders(self):
        """
        API which returns all the orders of the requested restaurant.
        Returns a 200 OK status
        """
        response = self.client.get('/partner-with-us/get-orders/', **self.bearer_token)
        r1 = Restaurant.objects.get(id=1)
        serializer = ActiveOrdersSerializer( ActiveOrders.objects.filter(restaurant=r1), many=True)

        self.assertTrue(response.status_code, 200)
        self.assertQuerysetEqual(response.json(), serializer.data)

    
    def test_invalid_restaurantOrders(self):
        """
        Check API for a user who is not logged in.
        Returns 401 status code
        """
        response = self.client.get('/partner-with-us/get-orders')
        self.assertTrue(response.status_code, 401)

    
    def test_addFoodItem(self):
        """
        API to add a new food item to user's cart.
        Returns a 200 OK status code if successfull
        """
        response = self.client.post('/partner-with-us/add-food-item/', data={'name':'food_name', 'description':'food_desc', 'price':'100', 'image':'food_img'} , **self.bearer_token)

        self.assertTrue(response.status_code, 200)
        self.assertEqual(response.json(), '✅ Your food item has been succesfully added!')

    
    def test_invalid_addFoodItem(self):
        """
        API to test invalid input type for an item to be added to cart.
        """
        # To check if empty input is provided
        emptyNameResponse = self.client.post('/partner-with-us/add-food-item/', data={'name':'', 'description':'food_desc', 'price':'100', 'image':'food_img'} , **self.bearer_token)
        emptyPriceResponse = self.client.post('/partner-with-us/add-food-item/', data={'name':'food_name', 'description':'food_desc', 'price':'', 'image':'food_img'} , **self.bearer_token)
        emptyDescriptionResponse = self.client.post('/partner-with-us/add-food-item/', data={'name':'food_name', 'description':'', 'price':'1000000', 'image':'food_img'} , **self.bearer_token)
        emptyImgResponse = self.client.post('/partner-with-us/add-food-item/', data={'name':'', 'description':'food_desc', 'price':'100', 'image':''} , **self.bearer_token)
        # To check the length of input
        invalidPriceResponse = self.client.post('/partner-with-us/add-food-item/', data={'name':'food_name', 'description':'food_desc', 'price':'1000000', 'image':'food_img'} , **self.bearer_token)
        
        self.assertEqual(emptyNameResponse.json(), 'All data is required')
        self.assertEqual(emptyPriceResponse.json(), 'All data is required')
        self.assertEqual(emptyDescriptionResponse.json(), 'All data is required')
        self.assertEqual(emptyImgResponse.json(), 'All data is required')
        self.assertEqual(invalidPriceResponse.json(), 'Max size exceeded! Enter a smaller value')


    def test_unauthorized_addFoodItem(self):
        """
        Check if unauthorized user can add a food item.
        Returns 401
        """
        response = self.client.post('/partner-with-us/add-food-item/', data={'name':'food_name', 'description':'food_desc', 'price':'100', 'image':'food_img'})
        self.assertTrue(response.status_code, 401)

    
    def test_get_manageFoodItems(self):
        """
        API to list all the food items added by the restaurant.
        Returns a 200 OK status and a list of all the food items added by restaurant.
        """
        response = self.client.get('/partner-with-us/manage-food-items/', **self.bearer_token)
        r1 = Restaurant.objects.get(id=1)
        serializer = FoodItemSerializer(FoodItem.objects.filter(restaurant=r1), many=True)

        self.assertTrue(response.status_code, 200)
        self.assertQuerysetEqual(response.json(), serializer.data)

    
    def test_unauthorized_manageFoodItems(self):
        """
        Check if an unauthorized user can access the MangeFoodItems view.
        Returns 401 status.
        """
        response = self.client.get('/partner-with-us/manage-food-items/', **self.bearer_token)
        self.assertTrue(response.status_code, 401)

    
    def test_get_editFoodItem(self):
        """
        API to list the details of a particular food item requested through it's ID.
        Returns 200 OK status and the details of the food item.
        """
        response = self.client.get('/partner-with-us/manage-food-items/1', **self.bearer_token)
        
        r1 = Restaurant.objects.get(id=1)
        serializer = FoodItemSerializer(FoodItem.objects.filter(id=1, restaurant=r1), many=True)

        self.assertTrue(response.status_code, 200)
        self.assertQuerysetEqual(response.json(), serializer.data)


    def test_unauthorized_editFoodItem(self):
        """
        Check if an unauthorized user can access the EditFoodItem view.
        Returns 401 status.
        """
        response = self.client.get('/partner-with-us/manage-food-items/1')
        self.assertTrue(response.status_code, 401)


    def test_updateFoodItem(self):
        """
        API to update the data of an existing food item.
        Returns a 200 OK status.
        """
        response = self.client.post('/partner-with-us/manage-food-items/1/update', data={'name': 'food_new_name', 'description':'food_new_desc', 'price':'150', 'image':'food_new_img'} ,**self.bearer_token)
        
        self.assertTrue(response.status_code, 200)
        self.assertQuerysetEqual(response.json(), '✅ Your food item has been succesfully updated!')
    
    
    def test_unauthorized_updateFoodItem(self):
        """
        Check if an unauthorized user can access the UpdateFoodItem view.
        Returns a 401 status.
        """
        response = self.client.post('/partner-with-us/manage-food-items/1/update', data={'name': 'food_new_name', 'description':'food_new_desc', 'price':'150', 'image':'food_new_img'})
        self.assertTrue(response.status_code, 401)

    
    def test_deleteFoodItem(self):
        """
        API to delete an existing food item which was added by the restaurant.
        Returns a 200 OK status.
        """
        response = self.client.delete('/partner-with-us/manage-food-items/1/delete', **self.bearer_token)

        self.assertTrue(response.status_code, 200)
        self.assertEqual(response.json(), ' ✅ DELETED food item successfully! ')
       

    def test_unauthorized_deleteFoodItem(self):
        """
        Check if an unauthorized user can access the DeleteFoodItem view.
        Returns 401 status.
        """
        response = self.client.delete('/partner-with-us/manage-food-items/1/delete', **self.bearer_token)

        self.assertTrue(response.status_code, 401)

    
        

        