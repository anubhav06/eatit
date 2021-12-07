import React, {useContext} from 'react'
import RestaurantAuthContext from '../context/RestaurantAuthContext'
import RestaurantHeader from '../components/RestaurantHeader'
import { Redirect } from 'react-router'


const RestaurantRegisterPage = () => {

    let {restaurant, registerRestaurant} = useContext(RestaurantAuthContext)
    
    // If a normal user is logged in, then tell them to logout with the normal account to access the restaurant login
    if(localStorage.getItem('authTokens') !== null){
        return(  
            <p> You need to logout from your main account to login with the restaurant account ! </p>
        )
    }
    
    // If a restaurant is already logged in
    if(restaurant){
        return( <Redirect to="/partner-with-us/orders" /> )
    }

    return (
        <div>
            <RestaurantHeader/>
            <form onSubmit={registerRestaurant}>
                <input type="text" name="email" placeholder="Enter Email" />
                <input type="password" name="password" placeholder="Enter Password"/>
                <input type="password" name="confirmPassword" placeholder="Enter Password Again"/>
                <input type="text" name="name" placeholder="Enter Restaurant Name"/>
                <input type="text" name="address" placeholder="Enter Restaurant Address"/>
                
                <input type="submit"/>
            </form>
        </div>
    )
}

export default RestaurantRegisterPage
