import React, {useContext} from 'react'
import { Redirect } from 'react-router'
import RestaurantAuthContext from '../context/RestaurantAuthContext'
import RestaurantHeader from '../components/RestaurantHeader'
import './RestaurantHomePage.css'

const RestaurantHomePage = () => {
    let {restaurant} = useContext(RestaurantAuthContext)

    // If user is already logged in, then redirect to the manage orders page
    if (restaurant){
        return( <Redirect to="/partner-with-us/orders" />)
    }

    return (
        <div>
            <RestaurantHeader/>
            <div className='homePage-bg'>
                <div className='homePage-row'>
                    <p className='homePage-column-heading'> EATIN </p>
                    <p className='homePage-column-subheading'> Partner with EATIN </p>
                    <p className='homePage-column-subheading'> Get listed on the food ordering platform </p>
                </div>
                <div className='homePage-row2'>
                    <div className='homePage-row2-heading'>
                        GET STARTED IN 3 EASY STEPS
                    </div>
                    <div className='homePage-column'>
                        <p className='homePage-row2-subheading'> SIGN UP </p>
                        <p className='homePage-row2-subheading2'> Start with signing up on our platform </p>
                    </div>
                    <div className='homePage-column'>   
                        <p className='homePage-row2-subheading'> SET UP </p>
                        <p className='homePage-row2-subheading2'> Then complete onboarding with Stripe for payments </p>
                    </div><div className='homePage-column'>
                        <p className='homePage-row2-subheading'> SELL </p>
                        <p className='homePage-row2-subheading2'> Add, delete, manage your food items, and start receiving orders</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RestaurantHomePage
