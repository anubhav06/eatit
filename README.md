# EATIN
An online food ordering web application made using React + Django similar to UberEats / Swiggy / Zomato

Try Out: https://eatin.vercel.app/

<img src="https://media.giphy.com/media/aqMpEfrP7w5QgB2jLG/giphy.gif" height="400" width="auto"/>

[![Django CI](https://github.com/anubhav06/eatit/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/anubhav06/eatit/actions/workflows/ci.yml)

## Test Credentials 🔏
#### User Account
```
Username: anubhav-test  
Password: eatin-password
```
#### Restaurant Account
```
Email: evergreen@example.com
Password: eatin-restaurant-password
```

## Features ✨
- Users can signup and optionally decide to become sellers by on-boarding to Stripe.
- Login via mobile number and OTP instead of the standard email and password
- Users can browse through the available restaurants, add food item(s) to their cart and then make test payments
- Users get order status updates through text SMS
- Card payments are accepted by the restaurants and funds are routed to the sellers connected Stripe account
- Food Items can be listed, shown, added, edited and deleted by the restaurants
- Simple admin page for restaurants to manage


## Technical Features ✨ 
- Backend is made using Django and DRF
- Frontend is made using ReactJS
- Authentication system using [JWT](https://jwt.io/) with login and signup pages
- Card payments are accepted via [Stripe Checkout](https://stripe.com/docs/checkout/quickstart) and restaurant onboarding process is done via [Stripe Connect](https://stripe.com/docs/connect)
- Text SMS using Twilio's [Verify](https://www.twilio.com/docs/verify/api) and [SMS](https://www.twilio.com/docs/sms) API for authenticating users and sending order updates
- [AWS S3](https://aws.amazon.com/s3/) buckets for storing and retrieving the static files (images, etc.)
- Backend is hosted on Heroku, and frontend is hosted on Vercel
- PostgreSQL is used as production database

<hr>

## Installation 🖥️

Split the terminal in two and follow the below steps in different terminals

### Setup Backend 🔨
1. `cd backend` to go in that directory
2. Rename `example.env` to `.env` & add respective enviroment variables
    - [Getting Stripe credentials](https://stripe.com/docs/keys)
    - [Getting AWS S3 buckets credentials](https://docs.aws.amazon.com/AmazonS3/latest/userguide/walkthrough1.html)
    - [Getting Twilio's credentials](https://www.twilio.com/docs/iam/keys/api-key)
4. Run ```pip install -r requirements.txt``` to install the dependencies
5. Run `python manage.py migrate` to migrate the database
6. Run `python manage.py runserver` to start the server
7. Add a Restaurant Group in the admin panel by following the below steps
    - Go to django's admin panel from `127.0.0.1/admin/`
    - Login with the [superuser credentials](https://docs.djangoproject.com/en/4.0/intro/tutorial02/#creating-an-admin-user)
    - Click on Groups -> Add Group -> (add the below credentials)
    - Name: `Restaurant`
    - Choose the following permissions for the restaurant: 
    - ```
        restaurants|food item|Can add food item 
        restaurants|food item|Can change food item
        restaurants|food item|Can delete food item
        restaurants|food item|Can view food item
      ```

### Setup Frontend 🔨
1. `cd frontend` to go in that directory
2. Rename `example.env` to `.env`
3. Run `npm install` to install the dependencies
4. Run `npm start` to start the server

<hr>

## Contributing 💪🏻
This repository is open to contributions.  
Feel free to create a [new issue](https://github.com/anubhav06/eatit/issues/new/choose) or work on an [existing issue](https://github.com/anubhav06/eatit/issues)  
Make sure to read the [contribution guildlines](https://github.com/anubhav06/eatit/blob/main/CONTRIBUTING.md) before jumping into it.