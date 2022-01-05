import React, {useState, useEffect, useContext} from 'react'
import { Redirect } from 'react-router'
import RestaurantAuthContext from '../context/RestaurantAuthContext'
import RestaurantHeader from '../components/RestaurantHeader'


const ManageOrders = () => {

    let {restaurant, restaurantAuthTokens} = useContext(RestaurantAuthContext)
    let [orders, setOrders] = useState([])



    // Runs the following functions on each load of page
    useEffect(()=> {
            
        // If a normal user visits (With group=None), then redirect to normal users page
        if(restaurant?.group === 'None'){
            return( < Redirect to="/restaurants" /> )
        }
        
         // To get the cart items of the logged in user (all the food items added to the user's cart)
         let getOrders = async() =>{
            let response = await fetch(`http://127.0.0.1:8000/partner-with-us/get-orders/`, {
                method:'GET',
                headers:{
                    'Content-Type':'application/json',
                    // Provide the authToken when making API request to backend to access the protected route of that user
                    'Authorization':'Bearer ' + String(restaurantAuthTokens.access)
                }
            })
            let data = await response.json()

            if(response.status === 200){
                console.log('Active Orders: ', data)
                setOrders(data)
            }else {
                alert('ERROR: While getting active order\ns ', data)
            }
        }

        
        // Call these functions on each load of page
        getOrders()
    }, [])


    // To place an order
    let updateOrder = async(id) =>{
        let response = await fetch(`http://127.0.0.1:8000/partner-with-us/update-order-status/${id}`, {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                // Provide the authToken when making API request to backend to access the protected route of that user
                'Authorization':'Bearer ' + String(restaurantAuthTokens.access)
            }
        })
        
        let data = await response.json()

        if(response.status === 200){
            alert('Order Status Updated ✅')
            // Reload the page to update the local state of this order as completed
            window.location.reload()

        } else {
            alert('Error updating order status. ',data)
            console.log('ERROR: ', data)
        }
    }



    return (
        <div>
            <RestaurantHeader/>
            <p> Welcome restaurant! NAME: {restaurant.username} GROUP:{restaurant.group}</p>
            <p>You are logged to the home page!</p>
            <br/><br/>
            <p> Your active orders will show here </p>

            
            <h2> Active Orders </h2>
            {orders.map(order => (
                <div key={order.id}>
                    {order.active === true 
                    ?   <div>
                            <div>
                                <p>{order.date.split("-")[2]}-{order.date.split("-")[1]}-{order.date.split("-")[0]}</p>
                                <p>{order.time.split(":")[0]}:{order.time.split(":")[1]}</p>
                            </div>
                            <div>
                                Delivery Address:
                                <p> {order.address.area} </p>
                            </div>
                            <div>
                                {order.cart.length} items
                                {order.cart.map( cart => (
                                    <div key={cart.id}>
                                        {cart.food.name} x {cart.qty} ----- {cart.amount}
                                    </div>
                                ))}
                                BILL TOTAL: {order.cart[0].totalAmount}
                            </div>
                            <button onClick={() => updateOrder(order.id)}> Mark as delivered </button>
                    </div>
                    : (null) }
                </div>
            ))}


            <h2> Completed Orders (Inactive) </h2>
            {orders.map(order => (
                <div key={order.id}>
                    {order.active == false
                    ?   <div>
                            <div>
                                <p>{order.date.split("-")[2]}-{order.date.split("-")[1]}-{order.date.split("-")[0]}</p>
                                <p>{order.time.split(":")[0]}:{order.time.split(":")[1]}</p>
                            </div>
                            <div>
                                Delivery Address:
                                <p> {order.address.area} </p>
                            </div>
                            <div>
                                {order.cart.length} items
                                {order.cart.map( cart => (
                                    <div key={cart.id}>
                                        {cart.food.name} x {cart.qty} ----- {cart.amount}
                                    </div>
                                ))}
                                BILL TOTAL: {order.cart[0].totalAmount}
                            </div>
                    </div>
                    : (null) }
                </div>
            ))}

            
        </div>
    )
}

export default ManageOrders
