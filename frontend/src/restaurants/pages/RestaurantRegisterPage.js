import React, {useContext} from 'react'
import RestaurantAuthContext from '../context/RestaurantAuthContext'
import RestaurantHeader from '../components/RestaurantHeader'


const RestaurantRegisterPage = () => {

    let {registerRestaurant} = useContext(RestaurantAuthContext)
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
