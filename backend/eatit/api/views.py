from os import error, stat
from django.core.exceptions import ObjectDoesNotExist
from django.db import IntegrityError
from django.db.utils import Error
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

import os
from twilio.rest import Client

from eatit.models import Cart, User, Address, ActiveOrders
from eatit.api.serializers import CartSerializer, AddressSerializer, UserSerializer, ActiveOrdersSerializer

from restaurants.models import Restaurant, FoodItem, Stripe
from restaurants.api.serializers import RestaurantSerializer, FoodItemSerializer

import json
from decouple import config
import stripe
from django.http import HttpResponse


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
    username = request.data["username"]
    email = request.data["email"]

    # Ensure password matches confirmation
    password = request.data["password"]
    confirmation = request.data["confirmPassword"]
    if password != confirmation:
        return Response("ERROR: Passwords don't match", status=status.HTTP_406_NOT_ACCEPTABLE)
    
    # Input validation. Check if all data is provided
    if not email or not username or not password or not confirmation:
        return Response('All data is required')

    # Attempt to create new user
    try:
        user = User.objects.create_user(username, email, password)
        user.save()
    except IntegrityError:
        return Response("ERROR: Username already taken", status=status.HTTP_406_NOT_ACCEPTABLE)
    return Response('Registered Successfully from backend')



# Refer: https://www.twilio.com/docs/verify/api?code-sample=code-step-3-check-the-verification-token&code-language=Python&code-sdk-version=7.x
# To send a text message with verification code to the requested mobile
@api_view(['POST'])
def mobileSendMessage(request):
    
    mobileNumber = request.data['number']
    print("Mobile Number: ", mobileNumber)

    # Find your Account SID and Auth Token at twilio.com/console
    # and set the environment variables. See http://twil.io/secure
    account_sid = config('TWILIO_ACCOUNT_SID')
    auth_token = config('TWILIO_AUTH_TOKEN')
    
    client = Client(account_sid, auth_token)

    try:
        verification = client.verify \
                            .services('VA7bedb5bcad76dea67499207e1b8b50f8') \
                            .verifications \
                            .create(to= '+' + mobileNumber, channel='sms')
            
        print(verification.status)
        return Response({'Message Sent ✅'})

    except Exception as exception:
        # Check twilio's error code from here: https://www.twilio.com/docs/verify/api/v1/error-codes
        if exception.code == 60200:
            return Response({'Invalid Phone Number'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
        elif exception.code == 60203:
            return Response({'Max attempts reached. Try sending message after some time ⚠️'}, status=status.HTTP_429_TOO_MANY_REQUESTS)
        else:
            return Response({'An unknown error occurred while sending message 🔴'}, status=status.HTTP_429_TOO_MANY_REQUESTS)




# To verify the verification code sent by Twilio to the user's mobile
@api_view(['POST'])
def mobileVerification(request):
    
    mobileNumber = request.data['number']
    verificationCode = request.data['code']

    # Find your Account SID and Auth Token at twilio.com/console
    # and set the environment variables. See http://twil.io/secure
    account_sid = config('TWILIO_ACCOUNT_SID')
    auth_token = config('TWILIO_AUTH_TOKEN')
    client = Client(account_sid, auth_token)

    try:
        verification_check = client.verify \
                                .services('VA7bedb5bcad76dea67499207e1b8b50f8') \
                                .verification_checks \
                                .create(to= '+' + mobileNumber , code= verificationCode )
        
        print(verification_check.status)
        
        if verification_check.status == 'approved':
            return Response({'Phone number verified ✅'})
        elif verification_check.status == 'pending':
            return Response({'Invalid verification code ⚠️'}, status=status.HTTP_412_PRECONDITION_FAILED)
        else:
            return Response({verification_check}, status=status.HTTP_406_NOT_ACCEPTABLE)


    except Exception as exception:
        # Check Twilio's error codes from here: https://www.twilio.com/docs/verify/api/v1/error-codes
        if exception.code == 60202:
            return Response({'Max verification attempt reached. Try after some time ⚠️'})
        else:
            return Response({'An unknown error occurred while verifying code 🔴'}, status=status.HTTP_429_TOO_MANY_REQUESTS)



# ------------------------------------
@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/token',
        '/api/token/refresh',
        '/api/register',
    ]

    return Response(routes)



# To view all the available/registered restaurants
@api_view(['GET'])
def restaurants(request):
    
    # Uses the restaurant model from the 'restaurants' app
    restaurants = Restaurant.objects.all()
    serializer = RestaurantSerializer(restaurants, many=True)
    return Response(serializer.data)
    

# To get the food items of the requested restaurant
@api_view(['GET'])
def restaurantsFood(request, id):

    try:
        # Get the requested restaurant
        restaurant = Restaurant.objects.get(id=id)
        # Get the food items of the above restaurant
        restaurantsFood = FoodItem.objects.filter(restaurant = restaurant)
    except :
        return Response('Not found')
    
    serializer = FoodItemSerializer(restaurantsFood, many=True)
    return Response(serializer.data)


# To get the info of the requested restaurant
@api_view(['GET'])
def restaurantsInfo(request, id):

    try:
        # Get the requested restaurant
        restaurant = Restaurant.objects.filter(id=id)
    except KeyError:
        return Response('Not found')

    serializer = RestaurantSerializer(restaurant, many=True)
    return Response(serializer.data)



# To get the items in the cart of the requested user
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getCartItems(request):
    
    cart = Cart.objects.filter(user=request.user)
    return Response([cart.serializer() for cart in cart])
    

# To add a food item to cart
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addToCart(request, id):
    
    # Add the food item to the user's cart
    try:
        # Get the requested foodItem
        food = FoodItem.objects.get(id=id)

        # Error checking: If user add's a food item from another restaurant (can add from only 1), then return with error message
        try:
            # Get the restaurant's ID of the current food items in cart
            presentCart = Cart.objects.filter(user=request.user).first()
            presentCartFood = FoodItem.objects.get(id= presentCart.food.id)
            # Check if the restaurant's ID of item in cart is not same as the requested food item to add.
            if food.restaurant != presentCartFood.restaurant:
                return Response({'You already have items added to cart from another restaurant'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
        except AttributeError:
            pass


        # If the user's cart contains the requested food item, then increase it's quantity by 1
        try:
            getFood =  Cart.objects.get(food=food)
            getFood.qty += 1
            # Update the amount of the food item added in cart in accordance of it's quantity
            getFood.amount = float(food.price * getFood.qty)
            getFood.save()
        # If the cart doesn't contain the food, then add it to cart and set quantity to 1
        except ObjectDoesNotExist :
            addItem = Cart(user=request.user, food=food, qty=1, amount=food.price)
            addItem.save()
            
        # Update the cart's totalAmount by adding the current food item's price
        oldTotalAmount = Cart.objects.filter(user=request.user).first().totalAmount
        Cart.objects.filter(user=request.user).update(totalAmount = float(oldTotalAmount+food.price))
        

        # Get the added cart item of the requested user (for passing to serializer)
        cart = Cart.objects.get(user=request.user, food=id)
    
    # If a request is made with an invalid food ID, i.e food item doesn't exist, then return error
    except KeyError:
        return Response('Not found')
    
    # Serialize the cart for sending to frontend in appropriate format
    serializer = CartSerializer(cart)
    return Response(cart.serializer())
    

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def removeFromCart(request, id):
    # Remove the food item from the user's cart
    try:
        # Get the requested foodItem
        food = FoodItem.objects.get(id=id)

        # If the user's cart contains the requested food item, then decrease it's quantity by 1
        try:
            getFood =  Cart.objects.get(food=food)

            # If the item's quantity is more than 1, then decrease it's quantity
            if getFood.qty > 1:
                getFood.qty -= 1
                # Update the amount of the food items removed from cart in accordance with its quantity
                getFood.amount = food.price * getFood.qty
                getFood.save()
            # If the item's quantity is 1 i.e the last item, then delete the item
            elif getFood.qty == 1:
                getFood.delete()
            # Else throw an error if qty is less than 1
            else :
                # If food qty is already 0, then return
                return Response('Food already removed from cart')
                

        # If the cart doesn't contain the food, then return
        except ObjectDoesNotExist :
            return Response('Food is not present in the cart')
            
        try:
            # Update the cart's totalAmount by subtracting the current food item's price
            oldTotalAmount = Cart.objects.filter(user=request.user).first().totalAmount
            Cart.objects.filter(user=request.user).update(totalAmount = float(oldTotalAmount-food.price))
        except AttributeError:
            pass    

    # If a request is made with an invalid food ID, i.e food item doesn't exist, then return error
    except KeyError:
        return Response('Not found')
    
    return Response('Removed from cart')



# To add an address of a user
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addAddress(request):
    
    area = request.data['area']
    label = request.data['label']

    addAddress = Address(user=request.user, area=area, label=label)
    addAddress.save()

    return Response({'Address Added'})


# To get all the added address of a user
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getAddress(request):

    address = Address.objects.filter(user=request.user)
    serializer = AddressSerializer(address, many=True)
    
    return Response(serializer.data)




# To place an order of a customer with the requested data
# Creates a Stripe checkout session and returns back a URL to redirect to.
# Refer: https://stripe.com/docs/connect/enable-payment-acceptance-guide?platform=web#web-create-checkout for more information.
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def checkout(request):

    stripe.api_key = config('STRIPE_API_KEY')
    
    # Get the cart items of the user
    cart = Cart.objects.filter(user=request.user)
    # Get the chosen delivery address passed from the frontend
    addressID = request.data['address'].get('id')


    getCartFoodID = cart.first().food.id
    getRestaurant = FoodItem.objects.get(id=getCartFoodID).restaurant
    accountID = Stripe.objects.get(restaurant=getRestaurant).accountID
    
    # To create a stripe checkout session which returns back the checkout session url
    try:
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[
                cart.checkoutSerializer() for cart in cart
            ],
            mode='payment',
            success_url='http://localhost:3000/my-account',
            cancel_url='http://localhost:3000/checkout/cancel',
            stripe_account = str(accountID) ,
            # Passes the metadata to a successfull checkout session by stripe if checkout is completed.
            # The metadata will be used to save order details
            metadata = {
                "user" : str(request.user.id),
                "addressID" : str(addressID), 
            }
        )
    except Exception as e:
        print('ERROR: ', e)
        return Response({'This restaurant has not setup payment acceptance with Stripe yet !'}, status=status.HTTP_412_PRECONDITION_FAILED)

    return Response({session.url}, status=status.HTTP_303_SEE_OTHER)




# Stripe webhook to check if the payment is completed
# If payment is successfully completed, then save the order details
@api_view(['POST'])
def webhook_received(request):

    print('Running')

    stripe.api_key = config('STRIPE_API_KEY')
    endpoint_secret = config('endpoint_secret')

    payload = request.body
    sig_header = request.META['HTTP_STRIPE_SIGNATURE']
    event = None

    # Verify webhook signature and extract the event.
    # See https://stripe.com/docs/webhooks/signatures for more information.
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except ValueError as e:
        # Invalid payload.
        print('INVALID PAYLOAD')
        return HttpResponse(status=400)
    except stripe.error.SignatureVerificationError as e:
        # Invalid Signature.
        print('INVALID SIGNATURE', e)
        return HttpResponse(status=400)

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        connected_account_id = event["account"]
        handle_completed_checkout_session(connected_account_id, session, request)

    else:
        print('Unhandled event type {}'.format(event['type']))
        
    return HttpResponse(status=200)




# If the checkout is completed, then call this function
def handle_completed_checkout_session(connected_account_id, session, request):
    # Fulfill the purchase.
    print('Connected account ID: ' + connected_account_id)
    print(str(session))
    print('PAYMENT COMPLETED ✅')

    print('Session Metadata:', session.metadata)
    print('Session Metadata USER:', session.metadata.user)
    print('Session Metadata ADDRESS ID:', session.metadata.addressID)
    print('request: ', request)
    print('request user: ', request.user)

    # ---- Save the order details ----

    # Get the cart items of the user
    sessionUser = User.objects.get(id = session.metadata.user)
    cart = Cart.objects.filter(user=sessionUser)
    # Get the chosen delivery address passed from the frontend
    addressID = session.metadata.addressID
    address = Address.objects.get(id=addressID)
    # Get the corresponding restaurant from the food items of the cart
    restaurant = FoodItem.objects.filter(id = cart.first().food.id).first().restaurant

    # Save the details in active orders model
    addOrder = ActiveOrders(user=sessionUser, restaurant=restaurant, address=address)
    addOrder.save()
    # Add the user's cart's foodItems to the active order which user has placed
    for cartItem in cart:
        addOrder.cart.add(cartItem)

    print('Saved order details ✅')





# To get the info of the logged in user like name, email etc.
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserInfo(request):

    serializer = UserSerializer(request.user)
    return Response(serializer.data)


# To get the active orders of the logged in user
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrders(request):
    
    activeOrders = ActiveOrders.objects.filter(user=request.user).order_by('-id')
    serializer = ActiveOrdersSerializer(activeOrders, many=True)
    return Response(serializer.data)
