import React, {useContext} from 'react'
import { Link } from 'react-router-dom'
import RestaurantAuthContext from '../context/RestaurantAuthContext'

const RestaurantHeader = () => {
    // Get the variables and functions from context data in AuthContext
    let {restaurant, logoutRestaurant} = useContext(RestaurantAuthContext)


    
    return (
        <div>
            <Link to="/partner-with-us" >Home</Link>

            <span>  |  </span>
            {/* If user is logged in then show logout button else show login button */}
            {restaurant ? (
                <Link to="/partner-with-us">
                    <span onClick={logoutRestaurant}>Logout</span>
                </Link>
            ): (
                <Link to="/partner-with-us/login" >Login</Link>
            )}

            <span>  |  </span>
            {restaurant ? (
                <Link to="/partner-with-us/manage-food-items"> Manage Food Items </Link>
            ) 
            : (
                <Link to="/partner-with-us/register" >Register</Link>
            )}

            <span>  |  </span>
            {restaurant ? (
                <Link to="/partner-with-us/add-food-item"> Add Food Item </Link>
            ) 
            : (
                <Link to="/" > Main Site </Link>
            )}


                
           
        </div>
    )
}

export default RestaurantHeader
