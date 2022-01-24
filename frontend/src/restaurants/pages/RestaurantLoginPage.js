import React, {useContext} from 'react'
import RestaurantAuthContext from '../context/RestaurantAuthContext'
import RestaurantHeader from '../components/RestaurantHeader'
import { Redirect } from 'react-router'
import '../../components/LoginForm.css'

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
            <br/><br/><br/><br/>
            <div className='row'>

                <div className='form-column-left'>    
                    <div className='form-background'>
                        
                        <div className='form-header'> Restaurant Login Page </div>
                        <form onSubmit={loginRestaurant}>
                            <input type="text" name="username" placeholder="Enter Username" required className='form-input'/>
                            <input type="password" name="password" placeholder="Enter Password" required className='form-input' /> <br/>
                            <input type="submit" className='form-submit-btn'/>
                        </form>
                    </div>
                </div>
                <div className='form-column-right'>    
                    <p className='formRight-heading'> EATIN </p>
                    <p className='formRight-subHeading'> Login with your restaurant account </p>
                    <p className='formRight-subHeading2'> Restaurant administration made easy with EATIN </p>
                </div>
            </div>

        </div>
    )
}

export default RestaurantLoginPage
