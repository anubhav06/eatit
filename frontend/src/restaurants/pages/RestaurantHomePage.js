import React, {useState, useEffect, useContext} from 'react'
import { Redirect } from 'react-router'
import RestaurantAuthContext from '../context/RestaurantAuthContext'
import RestaurantHeader from '../components/RestaurantHeader'


const RestaurantHomePage = () => {
    let {restaurant} = useContext(RestaurantAuthContext)

    // If user is already logged in, then redirect to the manage orders page
    if (restaurant){
        return( <Redirect to="/partner-with-us/orders" />)
    }

    return (
        <div>
            <RestaurantHeader/>
            <p> You can partner with us. Our partners - - - etc....</p>
            
        </div>
    )
}

export default RestaurantHomePage
