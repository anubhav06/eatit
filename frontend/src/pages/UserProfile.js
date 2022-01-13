import React, {useState, useEffect, useContext, setState} from 'react'
import { useHistory } from 'react-router-dom'
import Header from '../components/Header'
import AuthContext from '../context/AuthContext'
import './ViewFoodItems.css'

const UserProfile = ({match}) => {

    let {authTokens} = useContext(AuthContext)
    let [userInfo, setUserInfo] = useState({})
    let [orders, setOrders] = useState([])
    
    const history = useHistory()

    // Runs the following functions on each load of page
    useEffect(()=> {
        
        // To get the cart items of the logged in user (all the food items added to the user's cart)
        let getUserInfo = async() =>{
            let response = await fetch(`http://127.0.0.1:8000/api/get-user-info/`, {
                method:'GET',
                headers:{
                    'Content-Type':'application/json',
                    // Provide the authToken when making API request to backend to access the protected route of that user
                    'Authorization':'Bearer ' + String(authTokens.access)
                }
            })
            let data = await response.json()

            if(response.status === 200){
                setUserInfo(data)
            }else {
                alert('ERROR: While getting user\ns data. ', response)
            }
        }

         // To get the cart items of the logged in user (all the food items added to the user's cart)
         let getOrders = async() =>{
            let response = await fetch(`http://127.0.0.1:8000/api/get-orders/`, {
                method:'GET',
                headers:{
                    'Content-Type':'application/json',
                    // Provide the authToken when making API request to backend to access the protected route of that user
                    'Authorization':'Bearer ' + String(authTokens.access)
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
        getUserInfo()
        getOrders()
    }, [])






    return (
        <div>
            <Header/>
            <div>
                <p> {userInfo.email} </p>
                <p> {userInfo.username} </p>
            </div>
            <hr/>
            <div>
                {orders.map(order => (
                    <div key={order.id}>
                        {order.active == true 
                        ?   <div>
                                🍽️ Your order has been placed
                            </div>
                        :   <div>
                                ✅Order delivered successfully
                            </div>
                        }
                        <div>
                            <p>{order.date.split("-")[2]}-{order.date.split("-")[1]}-{order.date.split("-")[0]}</p>
                            <p>{order.time.split(":")[0]}:{order.time.split(":")[1]}</p>
                        </div>
                        <div>
                            <h2> {order.restaurant.name} </h2>
                            <p> {order.restaurant.address} </p>
                        </div>
                        <div>
                            | <br/> | <br/> 
                            <h2> {order.address.label} </h2>
                            <p> {order.address.area} </p>
                        </div>
                        <div>
                            {order.cart.length} items
                            {order.cart.map( cart => (
                                <div key={cart.id}>
                                    {cart.food.name} x {cart.qty} ----- {cart.amount}
                                </div>
                            ))}
                            BILL TOTAL: {order.cart[0]?.totalAmount}
                        </div>
                    </div>
                ))} 
            </div>
        </div>
    )
}

export default UserProfile
