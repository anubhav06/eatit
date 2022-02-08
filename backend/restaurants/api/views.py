from django.core.exceptions import ObjectDoesNotExist
from django.db.utils import Error
from django.contrib.auth.models import Group
from django.db import IntegrityError
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from twilio.rest import Client

from eatit.models import ActiveOrders, MobileNumber
from eatit.api.serializers import ActiveOrdersSerializer

from restaurants.models import Restaurant, FoodItem, User, Stripe
from .serializers import FoodItemSerializer

from decouple import config
import stripe


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
@api_view(['POST'])
def register(request):
    email = request.data["email"]
    name = request.data["name"]
    address = request.data["address"]
    image = request.data["image"]

    # Ensure password matches confirmation
    password = request.data["password"]
    confirmation = request.data["confirmPassword"]
    if password != confirmation:
        return Response("ERROR: Passwords don't match", status=status.HTTP_406_NOT_ACCEPTABLE)

    # Input validation. Check if all data is provided
    if not email or not name or not address or not password or not confirmation:
        return Response('All data is required', status=status.HTTP_406_NOT_ACCEPTABLE)
    if len(name) >= 64 or len(address) >= 320:
        return Response('Max size exceeded! Enter a smaller value', status=status.HTTP_406_NOT_ACCEPTABLE)

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
        restaurant = Restaurant.objects.create(user=user, name=name, address=address, image=image)
        restaurant.save()
    except IntegrityError as e:
        return Response(e, status=status.HTTP_406_NOT_ACCEPTABLE)
    
    # Add it to the restaurants groups
    group = Group.objects.get(name='Restaurant') 
    group.user_set.add(user)


    return Response('Registered Successfully from backend')




# For a restaurant to add a new food item
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addFoodItem(request):
    # Get items from frontend
    name = request.data["name"]
    description = request.data["description"]
    price = request.data["price"]
    image = request.data["image"]

    # Input validation. Check if all data is provided
    if not name or not description or not price or image == 'undefined':
        return Response('All data is required', status=status.HTTP_406_NOT_ACCEPTABLE)
    if len(name) >= 32 or len(description) >= 320 or len(str(price)) > 6:
        return Response('Max size exceeded! Enter a smaller value', status=status.HTTP_406_NOT_ACCEPTABLE)

    # Get the logged in user's restaurant
    try:
        restaurant = Restaurant.objects.get(user= request.user)
    except Error:
        return Response('No restaurant is associated with the logged in user', status=status.HTTP_404_NOT_FOUND)

    # Save the details obtained from frontend about food item
    try:
        data = FoodItem(restaurant=restaurant, name=name, description=description, price=price, image=image)
        data.save()
    except Error:
        return Response('Error while adding the food items', status=status.HTTP_404_NOT_FOUND)

    return Response('✅ Your food item has been succesfully added!')



# For restaurants to view all the added food items
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def manageFoodItems(request):

    restaurant = Restaurant.objects.get(user= request.user)
    foodItems = FoodItem.objects.filter(restaurant=restaurant)
    # Serialize the data for sending to frontend
    serializer = FoodItemSerializer(foodItems, many=True)
    return Response(serializer.data)



# To edit the data of an existing food item. Returns the data of the requested food item
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def editFoodItems(request, id):

    restaurant = Restaurant.objects.get(user= request.user)
    foodItems = FoodItem.objects.filter(pk=id, restaurant=restaurant)
    serializer = FoodItemSerializer(foodItems, many=True)
    return Response(serializer.data)



# To update the data of a food item.
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def updateFoodItem(request, id):
    
    name = request.data["name"]
    description = request.data["description"]
    price = request.data["price"]
    image = request.data["image"]

    # Update the details obtained from frontend about food item
    try:
        foodItem = FoodItem.objects.get(id=id)
        foodItem.name = name
        foodItem.description = description
        foodItem.price = price
        # If an image is provided, then update the image, if not provided, then let the original one remain as it is
        if image != 'undefined':
            foodItem.image = image
        foodItem.save()
    except Error as e:
        return Response(e, status=status.HTTP_406_NOT_ACCEPTABLE)

    return Response('✅ Your food item has been succesfully updated!')
    


# To delete a food item
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deleteFoodItem(request, id):
    
    restaurant = Restaurant.objects.get(user= request.user)
    # Get the requested food item by its ID and delete that.
    foodItem = FoodItem.objects.get(id=id, restaurant=restaurant)
    foodItem.delete()
    
    return Response(' ✅ DELETED food item successfully! ')


# To get all the orders of the requested restaurant (logged in restaurant)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrders(request):

    restaurant = Restaurant.objects.get(user=request.user)
    activeOrders = ActiveOrders.objects.filter(restaurant=restaurant)

    serializer = ActiveOrdersSerializer(activeOrders, many=True)
    return Response(serializer.data)


# To update the order status as delivered
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def updateOrderStatus(request, id):

    restaurant = Restaurant.objects.get(user=request.user)
    order = ActiveOrders.objects.get(id=id, restaurant=restaurant)
    order.active = False
    order.save()

    # --- To send the user a text SMS about the updated order status ----

    # Get the mobile number of the user who placed the order
    orderedBy = User.objects.get(id=order.user.id)
    number = MobileNumber.objects.get(user=orderedBy).number

    # Find your Account SID and Auth Token at https://twilio.com/console
    # and set the environment variables. See http://twil.io/secure
    account_sid = config('TWILIO_ACCOUNT_SID')
    auth_token = config('TWILIO_AUTH_TOKEN')
    client = Client(account_sid, auth_token)

    message = client.messages \
                    .create(
                        messaging_service_sid='MG3689472a26e433f57909e6a580e2d9be',
                        to='+' + str(number),
                        body="Your order #" + str(order.id) + " has been delivered! Thanks for ordering at EatIN ! " 
                    )

    print('Message sent ✅ ', message.status)

    serializer = ActiveOrdersSerializer(order)
    return Response(serializer.data)


# To create a new stripe account
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createStripeAccount(request):
    
    # Get the restaurant for which stripe account has to be created
    getRestaurant = Restaurant.objects.get(user=request.user)

    stripe.api_key = config('STRIPE_API_KEY')
    
    # Check if account is already created, if so then return back otherwise continue to create a stripe account for restaurant
    try:
        getStripeData = Stripe.objects.get(restaurant=getRestaurant)
        return Response({'Stripe account already created'}, status=412)
    except ObjectDoesNotExist:
        pass

    # To create a stripe account
    # For more info refer to: https://stripe.com/docs/connect/enable-payment-acceptance-guide?platform=web#web-create-standard-account
    response = stripe.Account.create(
        type = "standard",
        country = "US",
        email = request.user.email, 

    )
    # TODO: Add business profile details later like name address etc. 
    # https://stripe.com/docs/api/accounts/create#create_account-business_profile

    # Store the stripe acccount ID of the restaurant owner
    stripeModel = Stripe.objects.create(restaurant = getRestaurant, accountID=response.id)
    stripeModel.save()
    
    # To create an account link for user start the onboarding process.
    # Refer: https://stripe.com/docs/connect/enable-payment-acceptance-guide?platform=web#web-create-account-link
    accountLinkResponse = stripe.AccountLink.create(
        account = response.id,
        # Get the deployed URL from env variables
        refresh_url = config('CORS_FRONTEND_HOST') + "/partner-with-us/account-setup/refresh-url",
        return_url = config('CORS_FRONTEND_HOST') + "/partner-with-us/account-setup/return-url",
        type = "account_onboarding",
    )

    # Return the URL generated by stripe
    return Response({accountLinkResponse.url})



# To complete a stripe account which already has stripe account created but not completed 
# (all details are not provided as required by stripe)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def completeStripeAccount(request):
    
    # Check if stripe is created.
    # Only continue if account is created, but onboarding process is not completed
    try:
        getRestaurant = Restaurant.objects.get(user=request.user)
        getStripeData = Stripe.objects.get(restaurant=getRestaurant)
    except ObjectDoesNotExist:
        return Response({'Stripe account not created'}, status=status.HTTP_412_PRECONDITION_FAILED)

    # To create an account link. 
    # Refer: https://stripe.com/docs/connect/enable-payment-acceptance-guide?platform=web#web-create-account-link
    accountLinkResponse = stripe.AccountLink.create(
        account = getStripeData.accountID,
        # Get the hosted URL from env variables
        refresh_url = config('CORS_FRONTEND_HOST') + "/partner-with-us/account-setup/refresh-url",
        return_url = config('CORS_FRONTEND_HOST') + "/partner-with-us/account-setup/return-url",
        type = "account_onboarding",
    )

    # Return the URL generated by stripe
    return Response({accountLinkResponse.url})


# To get the stripe account details of the restaurant.
# This checks 3 different conditions, and passes it to frontend,using custom status codes, 
# where frontend conditonally renders according to this data.
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def stripeGetDetails(request):
    

    # CASE 1: Check if stripe account is not created.
    try:
        getRestaurant = Restaurant.objects.get(user=request.user)
        getStripeData = Stripe.objects.get(restaurant=getRestaurant)
    except ObjectDoesNotExist:
        return Response({'Stripe account does not exist'})

    # CASE 2: Check if account is created, but the stripe onboarding process is not completed (all details are not provided)
    stripe.api_key = config('STRIPE_API_KEY')

    # Retrieves the details of the stripe account from stripe's server
    # Refer: https://stripe.com/docs/api/accounts/retrieve
    stripeAccount = stripe.Account.retrieve(getStripeData.accountID)
    details_submitted = stripeAccount.details_submitted
    charges_enabled = stripeAccount.charges_enabled

    if details_submitted == False or charges_enabled == False:
        return Response({'Connect Onboarding Process not completed'}, status=230)
    

    # CASE 3: Account is created and all the details have also been provided
    return Response({'Stripe account connected ✅'}, status=231)


# In the case when stripe onborading is not completed, the following function is called
# Refer: https://stripe.com/docs/connect/enable-payment-acceptance-guide?platform=web#web-refresh-url
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def stripeRefreshURL(request):

    getRestaurant = Restaurant.objects.get(user=request.user)

    try:
        getStripeData  = Stripe.objects.get(restaurant=getRestaurant)
        # To create an account link. 
        # Refer: https://stripe.com/docs/connect/enable-payment-acceptance-guide?platform=web#web-create-account-link
        accountLinkResponse = stripe.AccountLink.create(
            account = getStripeData.accountID,
            # Get the hosted URL from env variables
            refresh_url = config('CORS_FRONTEND_HOST') + "/partner-with-us/account-setup/refresh-url",
            return_url = config('CORS_FRONTEND_HOST') + "/partner-with-us/account-setup/return-url",
            type = "account_onboarding",
        )
    except ObjectDoesNotExist:
        return Response({'Stripe account not created'})


    # Return the URL generated by stripe
    return Response({accountLinkResponse.url})


# If connect onborading is completed then this function is called
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def stripeReturnURL(request):

    stripe.api_key = config('STRIPE_API_KEY')
    
    try:
        # Get the restaurant's stripe account ID stored in our database
        getRestaurant = Restaurant.objects.get(user=request.user)
        getStripeData  = Stripe.objects.get(restaurant=getRestaurant)
    except ObjectDoesNotExist:
        return Response({'Stripe account not created'})

    # Retrieves the details of the stripe account from stripe's server
    # Refer: https://stripe.com/docs/api/accounts/retrieve
    stripeAccount = stripe.Account.retrieve(getStripeData.accountID)
    details_submitted = stripeAccount.details_submitted
    charges_enabled = stripeAccount.charges_enabled

    if details_submitted == False or charges_enabled == False:
        return Response({'Connect Onboarding Process not completed'}, status=status.HTTP_412_PRECONDITION_FAILED)

    return Response({'Stripe onboarding process completed successfully ✅'})




# -------- For DRF view -------------------
@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/token/',
        '/api/token/refresh/',
        '/api/register/',
        '/api/add-food-item/',
        '/api/manage-food-items/',
        '/api/manage-food-items/<int:id>/',
        '/api/manage-food-items/<int:id>/update/',
        '/api/manage-food-items/<int:id>/delete/',
        '/api/get-orders/',
        '/api/update-order-status/<int:id>/',
        '/api/create-stripe-account/',
        '/api/complete-stripe-account/',
        '/api/create-stripe-account/get-details/',
        '/api/create-stripe-account/refresh-url/',
        '/api/create-stripe-account/return-url/',
    ]

    return Response(routes)