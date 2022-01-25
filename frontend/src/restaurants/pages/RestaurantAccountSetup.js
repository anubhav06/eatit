import React, {useContext, useEffect, useState} from 'react'
import RestaurantAuthContext from '../context/RestaurantAuthContext'
import RestaurantHeader from '../components/RestaurantHeader'
import './RestaurantsAccountSetup.css'
import bankIcon from '../../assets/bankIcon.png'
import '../../pages/UserProfile.css'
import { Link } from 'react-router-dom'

const RestaurantAccountSetup = () => {

    let {restaurant, restaurantAuthTokens} = useContext(RestaurantAuthContext)
    let [accountStatus, setAccountStatus] = useState({})

    // To disable a submit btn once it's pressed, till it get's back a response
    let [disabled, setDisabled] = useState(false)

    useEffect(() => {
        
        // To place an order
        let getAccountInfo = async() =>{
            let response = await fetch(`http://127.0.0.1:8000/partner-with-us/create-stripe-account/get-details/`, {
                method:'GET',
                headers:{
                    'Content-Type':'application/json',
                    // Provide the authToken when making API request to backend to access the protected route of that user
                    'Authorization':'Bearer ' + String(restaurantAuthTokens.access),
                }
            })
            
            let data = await response.json()

            // If restaurant has not created any account yet (probably because landed for first time)
            if(response.status === 200){
                //console.log('GET STRIPE: ', data)
                setAccountStatus('NotCreated')
            }
            // If restaurant has created the account but has not provided all details to stripe
            else if(response.status === 230){
                //console.log('GET STRIPE: ', data)
                setAccountStatus('NotCompleted')
            } 
            // If restaurant has created the account and provided all the details (i.e. fully connected with stripe)
            else if(response.status === 231) {
                //console.log('GET STRIPE:', data)
                setAccountStatus('Completed')
            }
        }

        getAccountInfo()

    }, [])

    // To place an order
    let createStripeAccount = async() =>{
        setDisabled(true)
        let response = await fetch(`http://127.0.0.1:8000/partner-with-us/create-stripe-account/`, {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                // Provide the authToken when making API request to backend to access the protected route of that user
                'Authorization':'Bearer ' + String(restaurantAuthTokens.access),
            }
        })
        
        let data = await response.json()

        if(response.status === 200){
            //console.log('CREATE STRIPE ACCOUNT DATA: ', data)
            alert('Stripe account created ✅')
            window.location.href = `${data}`
        }
        else if(response.status === 412){
            alert(data)
            console.log('Account Already Created')
        } 
        else {
            alert('Error creating a stripe account ',data)
            console.log('ERROR: ', data)
        }
    }
    


    // To place an order
    let completeStripeAccount = async() =>{
        setDisabled(true)
        let response = await fetch(`http://127.0.0.1:8000/partner-with-us/complete-stripe-account/`, {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                // Provide the authToken when making API request to backend to access the protected route of that user
                'Authorization':'Bearer ' + String(restaurantAuthTokens.access),
            }
        })
        
        let data = await response.json()

        if(response.status === 200){
            //console.log('CREATE STRIPE ACCOUNT DATA: ', data)
            alert('Stripe account onborading link created ✅')
            window.location.href = `${data}`
        }
        else if(response.status === 412){
            alert(data)
            //console.log('Account Already Created')
        } 
        else {
            alert('Error creating a stripe account ',data)
            console.log('ERROR: ', data)
        }
    }
    
    //console.log('account status: ', accountStatus)

    return (
        <div>
            <RestaurantHeader/>

            <div className='user-info'>
                <p className='user-name'> {restaurant.username} </p>
                <p className='user-mail'> Account Setup Page </p>
            </div>

            {accountStatus === 'NotCreated' 
            ?   <div> 
                    <div className='newAccount-setup-center'>
                        <img src={bankIcon} className='bank-image' /> <br/>
                        <h2>Setup payouts to list on EATIN.</h2> 
                        EATIN partners with Stripe to transfer earnings to your (test) bank account. <br/>
                        All payments are directly transfered to your account after deducting applicable fees <br/>
                        <button className='account-setup-btn' onClick={createStripeAccount} disabled={disabled}> Click here to continue </button>
                        {/* If checkout button is clicked, then show a redirecting text */}
                        {disabled == true 
                        ?   <div style={{marginTop: '-10px'}}> Please wait. Redirecting . . . </div>
                        : (null)}
                        <p className='redirect-text'> You'll be redirected to Stripe to complete the onboarding proces.</p>
                        <div className='accountSetup-warning'>
                            NOTE: A test US account will be created with stripe. No real payments will be processed <br/>
                            Certain test data needs to be entered to trigger the verification. The required data is given below
                        </div>
                    </div>
                    <div className='test-section'>
                        <p className='test-heading'> Section 1: Stripe Sign Up</p>
                        <p className='test-details'> Sign up on stripe with your genuine credentials i.e. email, password, and mobile number</p>
                        <p className='test-heading'> Section 2: Tell us about your business </p>
                        <p className='test-details'> Address Line 1: address_full_match </p>
                        <p className='test-details'> City, State, ZIP: any United States address <br/> EXAMPLE- State:Alabama, City:Montgomery, ZIP:35005 </p>
                        <p className='test-heading'> Section 3: Personal Details </p>
                        <p className='test-details'> Name, Email: [any example value] <br/> DOB: 01/01/1901 <br/> Phone: 0000000000 <br/> SSN: 000-00-0000</p>
                        <p className='test-heading'> Section 4: Business details </p>
                        <p className='test-details'> Industry: Software <br/> Website: https://github.com/anubhav06/eatit <br/> Desc: test stripe account for eatin </p>
                        <p className='test-heading'> Section 5: Customer support details</p>
                        <p className='test-details'> Statement descriptor: [your restaurant name] </p>
                    </div>
                </div> 
            : (null)}


            {accountStatus === 'NotCompleted'
            ?   <div className='incompleteAccount-setup-center'>
                    <img src={bankIcon} className='bank-image' /> <br/>
                    Stripe account created but all details are not provided <br/>
                    <button onClick={completeStripeAccount} className='account-setup-btn' disabled={disabled}> Continue to Add details  </button>
                    {/* If checkout button is clicked, then show a redirecting text */}
                    {disabled == true 
                    ?   <div style={{marginTop: '-10px'}}> Please wait. Redirecting . . . </div>
                    : (null)}
                    <p className='redirect-text'> You'll be redirected to Stripe to complete the onboarding proces.</p>
                    <div className='accountSetup-warning'>
                        NOTE: If you have already provided all the details, then please wait for 2-5 minutes for stripe to verify and update the status.
                    </div>
                </div>
            : (null)}


            {accountStatus === 'Completed'
            ?   <div className='account-setup-center'>
                    <img src={bankIcon} className='bank-image' /> <br/>
                    You have completed setting up your account with Stripe. <br/>
                    Now you can directly login with stripe to monitor your payments <br/>
                    <form action='https://stripe.com/'>  
                        <button className='account-setup-btn'> Take me to stripe →  </button>
                    </form>
                </div>
            : (null)}
            
        </div>
    )
}

export default RestaurantAccountSetup
