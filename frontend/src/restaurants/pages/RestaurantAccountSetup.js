import React, {useContext, useEffect, useState} from 'react'
import RestaurantAuthContext from '../context/RestaurantAuthContext'
import RestaurantHeader from '../components/RestaurantHeader'



const RestaurantAccountSetup = () => {

    let {restaurantAuthTokens} = useContext(RestaurantAuthContext)
    let [accountStatus, setAccountStatus] = useState({})

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
                console.log('GET STRIPE: ', data)
                setAccountStatus('NotCreated')
            }
            // If restaurant has created the account but has not provided all details to stripe
            else if(response.status === 230){
                console.log('GET STRIPE: ', data)
                setAccountStatus('NotCompleted')
            } 
            // If restaurant has created the account and provided all the details (i.e. fully connected with stripe)
            else if(response.status === 231) {
                console.log('GET STRIPE:', data)
                setAccountStatus('Completed')
            }
        }

        getAccountInfo()
    

    }, [])

    // To place an order
    let createStripeAccount = async() =>{
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
            console.log('CREATE STRIPE ACCOUNT DATA: ', data)
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
            console.log('CREATE STRIPE ACCOUNT DATA: ', data)
            alert('Stripe account onborading link created ✅')
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
    

    return (
        <div>
            <RestaurantHeader/>

            <h2> Account Setup Page</h2>

            {accountStatus === 'NotCreated' 
            ?    <div>
                    Setup payments using Stripe. <br/>
                    Recieve direct payments from costumers securely through Stripe <br/>
                    The payment process is securely handled via Stripe thus we store none of your bank account details <br/><br/>
                    <button onClick={createStripeAccount}> Click here to continue </button>
                </div> 
            : (null)}


            {accountStatus === 'NotCompleted'
            ?   <div>
                    Account Created but all details not provided <br/>
                    <button onClick={completeStripeAccount}> Continue to Add details  </button>
                </div>
            : (null)}


            {accountStatus === 'Completed'
            ?   <div>
                    You have completed seting up you account with Stripe. <br/>
                    Now you can directly login with stripe to monitor your payments
                </div>
            : (null)}
            
        </div>
    )
}

export default RestaurantAccountSetup
