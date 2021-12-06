import React, {useContext} from 'react'
import RestaurantAuthContext from '../context/RestaurantAuthContext'
import RestaurantHeader from '../components/RestaurantHeader'
import { Redirect } from 'react-router'


const RestaurantLoginPage = () => {

    // Get the login user function from AuthContext 
    let {restaurant , loginRestaurant} = useContext(RestaurantAuthContext)

    if(restaurant){
        return( <Redirect to="/partner-with-us" /> )
    }

    //if (restaurant.group === "None"){
    //    return( <Redirect to="/" /> )
    //}
    
    return (
        <div>
            <RestaurantHeader/>
            Restaurant Login Page <br/>
            <form onSubmit={loginRestaurant}>
                <input type="text" name="username" placeholder="Enter Username" />
                <input type="password" name="password" placeholder="Enter Password" />
                <input type="submit"/>
            </form>
        </div>
    )
}

export default RestaurantLoginPage
