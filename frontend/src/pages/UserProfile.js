import React, {useState, useEffect, useContext} from 'react'
import Header from '../components/Header'
import AuthContext from '../context/AuthContext'
import './UserProfile.css'
import OrdersPage from '../components/OrdersPage'

const UserProfile = () => {

    let {authTokens} = useContext(AuthContext)
    let [userInfo, setUserInfo] = useState({})
    let [orders, setOrders] = useState([])
    

    // useEffect runs the following methods on every load of page
    useEffect(()=> {
        
        // To get the cart items of the logged in user (all the food items added to the user's cart)
        let getUserInfo = async() =>{
            let response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/get-user-info/`, {
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
            let response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/get-orders/`, {
                method:'GET',
                headers:{
                    'Content-Type':'application/json',
                    // Provide the authToken when making API request to backend to access the protected route of that user
                    'Authorization':'Bearer ' + String(authTokens.access)
                }
            })
            let data = await response.json()

            if(response.status === 200){
                setOrders(data)
            }else {
                alert('ERROR: While getting active order\ns ', data)
            }
        }

        
        // Call these functions on each load of page
        getUserInfo()
        getOrders()
    }, [authTokens])




    return (
        <div>
            <Header/>
            <div className='user-info'>
                <p className='user-name'> {userInfo.username} </p>
                <p className='user-mail'> {userInfo.email} </p>
            </div>
            <OrdersPage
                orders={orders}
            />
        </div>
    )
}

export default UserProfile
