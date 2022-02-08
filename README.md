# EATIN
An online food ordering web application made using React + Django similar to UberEats / Swiggy / Zomato


Try Out: https://eatin.vercel.app/

<img src="https://i.ibb.co/GPyGczM/10.png" alt="EatIN Image" border="0">


## Features
- Users can signup and optionally decide to become sellers by on-boarding to Stripe.
- Login via mobile number and OTP instead of the standard email and password
- Users can browse through the available restaurants, and add food item to their cart and then make test payments
- Users get order status updates through text SMS
- Card payments are accepted by the restaurant's and funds are routed to the sellers connected Stripe account
- Food Items can be listed, shown, added, edited and deleted by the restaurants
- Simple admin page for restaurants to manage


## Technical Features
- Backend is made using Django and Frontend is made using React
- Authentication system using [JWT](https://jwt.io/) tokens with login and signup pages
- Card payments are accepted via [Stripe Checkout](https://stripe.com/docs/checkout/quickstart) and restaurant onboarding process is done via [Stripe Connect](https://stripe.com/docs/connect)
- Text SMS using Twilio's [Verify](https://www.twilio.com/docs/verify/api) and [SMS](https://www.twilio.com/docs/sms) API for authenticating users and sending order updates
- [AWS S3](https://aws.amazon.com/s3/) buckets for storing the static files (images, etc.)
- Backend is hosted on Heroku, and frontend is hosted on Vercel

## Installation 🖥️

Split the terminal in two and follow the below steps in different terminals

### Setup Backend
1. `cd backend` to go in that directory
2. Download python if not installed from https://www.python.org/downloads/
3. Run `pip install -r requirements.txt` to install the dependencies
4. Run `python manage.py migrate` to migrate the database
5. Run `python manage.py runserver` to start the server

### Setup Frontend
1. `cd frontend` to go in that directory
2. Run `npm install` to install the dependencies
3. Run `npm start` to start the server

## Contributing 
This repo is open to contributions. Feel free to create a new issue or work on an [existing issue](https://github.com/anubhav06/eatit/issues)
