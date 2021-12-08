import { Route, Redirect } from 'react-router-dom'
import { useContext } from 'react'
import RestaurantAuthContext from '../context/RestaurantAuthContext'

const RestaurantPrivateRoute = ({children, ...rest}) => {
    let {restaurant} = useContext(RestaurantAuthContext)

    // If a normal user visits (With group=None), then redirect to normal users page
    if(restaurant?.group === 'None'){
        return( < Redirect to="/restaurants" /> )
    }
   
    return(
        // If restaurant is not authenticated, redirect to login, else continue with the request
        <Route {...rest}>{!restaurant ? <Redirect to="/partner-with-us/login" /> :   children}</Route>
    )
}

export default RestaurantPrivateRoute;