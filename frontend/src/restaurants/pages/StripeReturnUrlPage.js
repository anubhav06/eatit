import React, {useContext, useEffect, useState} from 'react'
import RestaurantAuthContext from '../context/RestaurantAuthContext'
import RestaurantHeader from '../components/RestaurantHeader'
import { Redirect, useHistory } from 'react-router-dom'


const StripeReturnUrlPage = () => {

    let {restaurantAuthTokens} = useContext(RestaurantAuthContext)
    let [returnURLData, setReturnURLData] = useState({})
    const history = useHistory()

    useEffect(() => {
        
        // To get the stripe refresh url
        let getStripeReturnURL = async() =>{
            let response = await fetch(`http://127.0.0.1:8000/partner-with-us/create-stripe-account/return-url/`, {
                method:'GET',
                headers:{
                    'Content-Type':'application/json',
                    // Provide the authToken when making API request to backend to access the protected route of that user
                    'Authorization':'Bearer ' + String(restaurantAuthTokens.access),
                }
            })
            
            let data = await response.json()

            // Redirect to the link generated from backend
            if(response.status === 200){
                setReturnURLData(true)
                console.log('GET STRIPE RETURN URL ', data)
                alert(data)

            } 
            else {
                setReturnURLData(false)
                alert(data)
                console.log('ERROR: ', data)
            }
        }

        getStripeReturnURL()
    }, [])


    let returnToAccountSetup = async () => {
        history.push('/partner-with-us/account-setup')
    }

    return (
        <div>
            {returnURLData === true
            ?   <div>
                    STRIPE ONBOARDING PROCESS COMPLETED <br/>
                    YOUR ACCOUNT IS NOW SETUP <br/>
                    SIT BACK AND RELAX WHILE ANY PURCHASE AUTOMATICALLY COMES TO YOUR ACCOUNT <br/>
                    <button onClick={returnToAccountSetup}> Go back to Account Setup </button>
                </div>
            :   <div>
                    STRIPE ONBORADING PROCESS WAS NOT COMPLETED ⚠️ <br/>
                    <button onClick={returnToAccountSetup}> Go back to Account Setup </button>
                </div>
            }
        </div>
    )

}

export default StripeReturnUrlPage
