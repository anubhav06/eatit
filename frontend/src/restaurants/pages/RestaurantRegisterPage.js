import React, {useContext} from 'react'
import RestaurantAuthContext from '../context/RestaurantAuthContext'
import RestaurantHeader from '../components/RestaurantHeader'
import { Redirect } from 'react-router'
import '../../components/LoginForm.css'
import './RestaurantLoginPage.css'

const RestaurantRegisterPage = () => {

    let {restaurant, registerRestaurant, formLoading} = useContext(RestaurantAuthContext)

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
            <div className='row'>

                <div className='restaurants-form-column-left'>
                    <div className='restaurants-form-background'>
                        <div className='form-header'> Registration Form </div>
                        <form onSubmit={registerRestaurant}>
                            <input type="text" name="email" placeholder="Enter Email" required className='form-input'/> 
                            <input type="password" name="password" placeholder="Enter Password" required className='form-input'/>
                            <input type="password" name="confirmPassword" placeholder="Enter Password Again" required className='form-input'/> 
                            <input type="text" name="name" placeholder="Enter Restaurant Name" required className='form-input'/>
                            <input type="text" name="address" placeholder="Enter Restaurant Address" required className='form-input'/>
                            <div className='form-file-input-label'> Upload a restaurant image to be shown on main page </div>
                            <input type="file" accept="image/x-png,image/jpeg,image/jpg" name="image" placeholder="Main page food Image" required className='form-file-input'/> <br/>
                            
                            <input type="submit" disabled={formLoading} className='form-submit-btn'/>
                            {formLoading ? <p> Registering your account. Please wait . . </p> : (null)}
                        </form>
                    </div>
                
                </div>
                <div className='restaurants-form-column-right'>    
                    <p className='formRight-heading'> EATIN </p>
                    <p className='formRight-subHeading'> Partner with us by filling the form</p>
                    <p className='formRight-subHeading2'> EATIN offers an easy onboarding process </p>
                </div>
            </div>
        </div>
    )
}

export default RestaurantRegisterPage
