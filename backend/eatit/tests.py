from django.test import TestCase
from django.contrib.auth.models import User
from eatit.api.serializers import AddressSerializer, ActiveOrdersSerializer, UserSerializer, RestaurantSerializer, FoodItemSerializer
from eatit.models import Cart, MobileNumber, Address, ActiveOrders
from restaurants.models import FoodItem, Restaurant
from rest_framework_simplejwt.tokens import RefreshToken


# For user authentication using JWT
# Refer: https://stackoverflow.com/a/67046746/17729597 for more details
class EatitTestCase(TestCase):
    @property
    def bearer_token(self):

        user = User.objects.get(id=1)
        refresh = RefreshToken.for_user(user)
        return {"HTTP_AUTHORIZATION":f'Bearer {refresh.access_token}'}


# Tests for the 'eatit' app
class EatitAppViewTestCase(EatitTestCase):

    def setUp(self):
        u1 = User.objects.create(username="aaa", email="aaa@example.com", password="aaa")
        u1.set_password("aaa")
        u1.save()
        u2 = User.objects.create(username="bbb", email="bbb@example.com", password="bbb")
        u2.set_password("bbb")
        u2.save()
        u3 = User.objects.create(username="restaurant1@example.com", password="restaurant1")
        u3.set_password("restaurant1")
        u3.save()
        u4 = User.objects.create(username="restaurant2@example.com", password="restaurant2")
        u4.set_password("restaurant2")
        u4.save()
        u5 = User.objects.create(username="ccc", email="ccc@example.com", password="ccc")
        u5.set_password("ccc")
        u5.save()
        u6 = User.objects.create(username="ddd", email="ddd@example.com", password="ddd")
        u6.set_password("ddd")
        u6.save()
        
        r1 = Restaurant.objects.create(user=u3, name="restaurant 1", address="restaurant1 address", image="restaurant1_img")
        r1.save()
        r2 = Restaurant.objects.create(user=u4, name="restaurant 2", address="restaurant2 address", image="restaurant2_img")
        r2.save()

        f1 = FoodItem.objects.create(id=1, restaurant=r1 ,name="food1", description="food1 desc", price="100", image="food1_img")
        f1.save()
        f2 = FoodItem.objects.create(id=2, restaurant=r1, name="food2", description="food2 desc", price="200", image="food2_img")
        f2.save()
        f3 = FoodItem.objects.create(id=3, restaurant=r1, name="food3", description="food3 desc", price="200", image="food3_img")
        f3.save()
        
        m1 = MobileNumber.objects.create(id=1, number='1234567890', user=u1)
        m1.save()
        m2 = MobileNumber.objects.create(id=2, number='123456781310', user=u2)
        m2.save()
        m3 = MobileNumber.objects.create(id=3, number='123246789', user=u5)
        m3.save()

        a1 = Address.objects.create(user=u1, area='area_1', label='label_1')
        a1.save()
        a2 = Address.objects.create(user=u1, area='area_2', label='label_2')
        a2.save()
        a3 = Address.objects.create(user=u2, area='area_3', label='label_3')
        a3.save()

        c1 = Cart.objects.create(user=u1, food=f1, qty=1, amount=100, totalAmount=100)
        c1.save()
        c2 = Cart.objects.create(user=u1, food=f2, qty=2, amount=150, totalAmount=300)
        c2.save()
        c3 = Cart.objects.create(user=u2, food=f1, qty=2, amount=100, totalAmount=150)   
        c3.save()
        c4 = Cart.objects.create(user=u2, food=f2, qty=1, amount=100, totalAmount=100)
        c4.save()
        c5 = Cart.objects.create(user=u5, food=f1, qty=0, amount=100, totalAmount=100)
        c5.save()
        c6 = Cart.objects.create(user=u5, food=f2, qty=1, amount=0, totalAmount=0)
        c6.save()
        
        order1 = ActiveOrders.objects.create(user=u1, restaurant=r1, address=a1)
        order1.cart.add(c1)
        order1.save()
        order2 = ActiveOrders.objects.create(user=u1, restaurant=r1, address=a2)
        order2.cart.add(c2)
        order2.save()



    # To test the total amount
    def test_valid_totalAmount(self):
        """
        Returns True as Total Amount = Quantity * Amount
        """
        u1 = User.objects.get(username="aaa")
        f1 = FoodItem.objects.get(name="food1")
        c = Cart.objects.get(user=u1, food=f1)
        self.assertTrue(c.is_valid_totalAmount())


    # To test the total amount
    def test_invalid_totalAmount(self):
        """
        Returns False as Total Amount != Quantity * Amount
        """
        u2 = User.objects.get(username="bbb")
        f1 = FoodItem.objects.get(name="food1")
        c = Cart.objects.get(user=u2, food=f1)
        self.assertFalse(c.is_valid_totalAmount())


    # To test valid amount i.e. amount > 0
    def test_valid_amount(self):
        """
        Checks if amount value is greater than 0.
        Returns True
        """
        u1 = User.objects.get(username="aaa")
        f1 = FoodItem.objects.get(name="food1")
        c = Cart.objects.get(user=u1, food=f1)
        self.assertTrue(c.is_valid_amount())


    # To test invalid qty, i.e. qty > 0
    def test_invalid_qty(self):
        """
        Checks if quantity is more than 0.
        Returns True
        """
        u5 = User.objects.get(username="ccc")
        f1 = FoodItem.objects.get(name="food1")
        c = Cart.objects.get(user=u5, food=f1)
        self.assertFalse(c.is_valid_amount())


    # To test invalid amount i.e. amount should be > 0
    def test_invalid_amount(self):
        """
        Checks if amount value is more than 0.
        Returns False.
        """
        u5 = User.objects.get(username="ccc")
        f2 = FoodItem.objects.get(name="food2")
        c = Cart.objects.get(user=u5, food=f2)
        self.assertFalse(c.is_valid_amount())


    def test_get_cartItems(self):
        """
        Gets all the cart items from the API. 
        Returns 200 status code with a JSON response of all the user's cart items
        """
        u1 = User.objects.get(id=1)
        cart = Cart.objects.filter(user=u1)
        response = self.client.get('/api/get-cart-items/' , **self.bearer_token)

        self.assertTrue(response.status_code, 200)
        self.assertQuerysetEqual(response.json(), [cart.serializer() for cart in cart])


    def test_get_invalidCartItems(self):
        """
        API to get the cart items of a user.
        Returns 401 status code because user's authentication details are not provided
        """
        response = self.client.get('/api/get-cart-items/')
        self.assertTrue(response.status_code, 401)


    def test_addToCart(self):
        """
        Adding a new food item to user's cart and then verifying if item has been added.
        Returns 200 OK status code.
        """
        postResponse = self.client.post('/api/add-to-cart/3', **self.bearer_token)
        getResponse = self.client.get('/api/get-cart-items/', **self.bearer_token)

        u1 = User.objects.get(id=1)
        cart = Cart.objects.filter(user=u1)

        self.assertTrue(postResponse.status_code, 200)
        self.assertTrue(getResponse.status_code, 200)
        self.assertQuerysetEqual(getResponse.json(), [cart.serializer() for cart in cart])


    def test_removeFromCart(self):
        """
        Removing an existing food item from user's cart then verifying if item has been removed,
        Returns 200OK status code.
        """
        
        postResponse = self.client.post('/api/remove-from-cart/2', **self.bearer_token)
        getResponse = self.client.get('/api/get-cart-items/', **self.bearer_token)
        
        u1 = User.objects.get(id=1)
        cart = Cart.objects.filter(user=u1)

        self.assertTrue(postResponse.status_code, 200)
        self.assertTrue(getResponse.status_code, 200)
        self.assertQuerysetEqual(getResponse.json(), [cart.serializer() for cart in cart])
    
    
    # To test valid phone number length i.e. = 10
    def test_valid_mobile_number_length(self):
        """
        Check if mobile number length is 10 digits.
        Returns True.
        """
        m = MobileNumber.objects.get(id=1)
        self.assertTrue(m.is_valid_number_length())


    def test_invalid_mobile_number_length(self):
        """
        Check if mobile number length is 10 digits.
        Returns False as length is more than 10 digits.
        """
        m = MobileNumber.objects.get(id=2)
        self.assertFalse(m.is_valid_number_length())


    def test_invalid_mobile_number_length2(self):
        """
        Check if mobile number length is 10 digits.
        Returns False as length is less than 10 digits.
        """
        m = MobileNumber.objects.get(id=3)
        self.assertFalse(m.is_valid_number_length())

    
    def test_get_address(self):
        """
        Get all the saved addresses of the user.
        Returns 200 OK status along with a JSON response of all the addresses
        """
        response = self.client.get('/api/get-address/', **self.bearer_token)

        u1 = User.objects.get(id=1)
        address = Address.objects.filter(user=u1)
        serializer = AddressSerializer(address, many=True)

        self.assertTrue(response.status_code, 200)
        self.assertQuerysetEqual(response.json(), serializer.data )


    def test_add_address(self):
        """
        Add a new address for the user.
        Returns 200 OK status and the return response mentioned in the view function.
        """
        postResponse = self.client.post('/api/add-address/', data={'area': 'test_area', 'label':'test_label'} ,**self.bearer_token)
     
        self.assertTrue(postResponse.status_code, 200)
        self.assertQuerysetEqual(postResponse.json(), ['Address Added'])

    
    def test_invalid_address(self):
        """
        Check if a non logged in user tries to add/get the addresses.
        Returns 401 status 
        """
        getResponse = self.client.get('/api/get-address/')
        postResponse = self.client.post('/api/add-address/')

        self.assertTrue(getResponse.status_code, 401)
        self.assertTrue(postResponse.status_code, 401)
    

    def test_get_orders(self):
        """
        Returns all the orders of the user.
        """
        response = self.client.get('/api/get-orders/', **self.bearer_token)

        u1 = User.objects.get(id=1)
        orders = ActiveOrders.objects.filter(user=u1).order_by('-id')

        serializer = ActiveOrdersSerializer(orders, many=True)

        self.assertTrue(response.status_code, 200)
        self.assertQuerysetEqual(response.json(), serializer.data)


    def test_get_invalid_orders(self):
        """
        Check if a non logged in user tries to get all the orders status.
        Returns 401 status 
        """
        response = self.client.get('/api/get-orders/')
        self.assertTrue(response.status_code, 401)

    
    def test_get_userInfo(self):
        """
        Returns the user info of the requested user
        """
        response = self.client.get('/api/get-user-info/', **self.bearer_token)

        u1 = User.objects.get(username='aaa')
        serializer = UserSerializer(u1)

        self.assertTrue(response.status_code, 200)
        # assertEqual is used instead of assertQuerysetEqual because only 1 dictionary is returned and not a QuerySet
        self.assertEqual(response.json(), serializer.data)

    
    def test_get_invalid_userInfo(self):
        """
        Check if a non logged in user tries to access the user info
        Returns 401 status
        """
        response = self.client.get('/api/get-user-info/')
        self.assertTrue(response.status_code, 401)

    
    def test_get_restaurants(self):
        """
        Returns the list of all restaurants.
        Returns a 200 OK status
        """
        response = self.client.get('/api/restaurants/')
        serializer = RestaurantSerializer(Restaurant.objects.all(), many=True)

        self.assertTrue(response.status_code, 200)
        self.assertQuerysetEqual(response.json(), serializer.data)

    
    def test_get_restaurantFood(self):
        """
        Returns all the food items of the requested restaurant
        """
        response = self.client.get('/api/restaurants/1')
        r1 = Restaurant.objects.get(id=1)
        serializer = FoodItemSerializer(FoodItem.objects.filter(restaurant=r1), many=True)

        self.assertTrue(response.status_code, 200)
        self.assertQuerysetEqual(response.json(), serializer.data)


    def test_get_restaurantInfo(self):
        """
        API to get the information of the requested restaurant.
        Returns 200 OK status
        """
        response = self.client.get('/api/restaurants/info/1')
        serializer = RestaurantSerializer(Restaurant.objects.get(id=1))
        
        self.assertTrue(response.status_code, 200)
        # serializer.data is enclosed in brackets becuase the corresponding view function returns data in that form
        self.assertEqual(response.json(), [serializer.data])
