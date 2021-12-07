import React, {useContext} from 'react'
import RestaurantAuthContext from '../context/RestaurantAuthContext'
import RestaurantHeader from '../components/RestaurantHeader'
import { Redirect } from 'react-router'


const RestaurantLoginPage = () => {

    // Get the login user function from AuthContext 
    let {restaurant , loginRestaurant} = useContext(RestaurantAuthContext)


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
            Restaurant Login Page <br/>
            <form onSubmit={loginRestaurant}>
                <input type="text" name="username" placeholder="Enter Username" required/>
                <input type="password" name="password" placeholder="Enter Password" required />
                <input type="submit"/>
            </form>
        </div>
    )
}

export default RestaurantLoginPage
