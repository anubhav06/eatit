import React, {useState, useEffect, useContext} from 'react'
import { Redirect } from 'react-router'
import RestaurantAuthContext from '../context/RestaurantAuthContext'
import RestaurantHeader from '../components/RestaurantHeader'
import RestaurantOrderPage from '../components/RestaurantOrdersPage'

import '../../components/OrdersPage.css'
import orderImage from '../../assets/Delivery.png'
import './ManageOrders.css'
import '../../pages/UserProfile.css'
import loadingImg from '../../assets/loading.gif'


const ManageOrders = () => {

    let {restaurant, restaurantAuthTokens} = useContext(RestaurantAuthContext)
    let [orders, setOrders] = useState([])

    let [loading, setLoading] = useState(false)



    useEffect(()=> {
            
        // If a normal user visits (With group=None), then redirect to normal users page
        if(restaurant?.group === 'None'){
            return( < Redirect to="/restaurants" /> )
        }
        
         // To get the cart items of the logged in user (all the food items added to the user's cart)
         let getOrders = async() =>{
            setLoading(true)
            let response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/partner-with-us/get-orders/`, {
                method:'GET',
                headers:{
                    'Content-Type':'application/json',
                    // Provide the authToken when making API request to backend to access the protected route of that user
                    'Authorization':'Bearer ' + String(restaurantAuthTokens.access)
                }
            })
            let data = await response.json()
            setLoading(false)

            if(response.status === 200){
                setOrders(data)
            }else {
                alert('ERROR: While getting active order\ns ', data)
            }
        }

        
        // Call these functions on each load of page
        getOrders()
    }, [restaurant, restaurantAuthTokens])


    // To place an order
    let updateOrder = async(id) =>{
        setLoading(true)
        let response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/partner-with-us/update-order-status/${id}`, {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                // Provide the authToken when making API request to backend to access the protected route of that user
                'Authorization':'Bearer ' + String(restaurantAuthTokens.access)
            }
        })
        
        let data = await response.json()
        setLoading(false)

        if(response.status === 200){
            alert('Order Status Updated ✅')
            // Reload the page to update the local state of this order as completed
            window.location.reload()

        } else {
            alert('Error updating order status. ',data)
        }
    }



    return (
        <div>
            <RestaurantHeader/>
            <div className='user-info'>
                
                <p className='user-name'> {restaurant.username} </p>
                <p className='user-mail'> Your orders will show here </p>

            </div>
            <div className='orders-container'>
                <div className='order-container-left'>
                    <img src={orderImage} className='order-img' alt='order' />
                    The joy of getting best
                </div>
                <div className='order-container-right'>
                    {loading 
                    ?   <div>
                            <img src={loadingImg} style={{width: 50, marginTop:25, marginLeft: 25}} alt='loading' />
                            <p style={{marginLeft: 25}}> Getting your orders. Please wait . . .  </p>
                        </div>
                    : <div>
                        <p className='active-order'> ACTIVE ORDERS </p>
                        <RestaurantOrderPage
                            orders={orders}
                            updateOrder={updateOrder}
                            showBtn={true}
                        />
                        <br/><hr/><br/>
                        <p className='inactive-order'> COMPLETED ORDERS (Inactive) </p>
                        <RestaurantOrderPage
                            orders={orders}
                            updateOrder={updateOrder}
                            showBtn={false}
                        />
                    
                    </div>
                    }
                </div>
            </div>
            
        </div>
    )
}

export default ManageOrders
