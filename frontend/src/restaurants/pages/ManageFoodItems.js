import React, {useState, useEffect, useContext} from 'react'
import RestaurantAuthContext from '../context/RestaurantAuthContext'
import RestaurantHeader from '../components/RestaurantHeader'
import { Link } from 'react-router-dom'
import cookingImg from '../../assets/CookingSVG.png'
import '../../components/FoodItem.css'
import '../../components/CartItems.css'
import '../../pages/UserProfile.css'


const ManageFoodItems = () => {
    let [foodItems, setFoodItems] = useState([])
    let {restaurant, restaurantAuthTokens, logoutRestaurant} = useContext(RestaurantAuthContext)

    // call getNotes on load
    useEffect(()=> {
        
        // To fetch the notes of a user
        let getFoodItems = async() =>{
            let response = await fetch('https://eatin-django.herokuapp.com/partner-with-us/manage-food-items/', {
                method:'GET',
                headers:{
                    'Content-Type':'application/json',
                    // Provide the authToken when making API request to backend to access the protected route of that user
                    'Authorization':'Bearer ' + String(restaurantAuthTokens.access)
                }
            })
            let data = await response.json()

            if(response.status === 200){
                setFoodItems(data)
            }else if(response.statusText === 'Unauthorized'){
                logoutRestaurant()
            }
            
        }

        getFoodItems()

    }, [])


    return (
        <div>
            <RestaurantHeader/>

            <div className='user-info'>
                <p className='user-name'> {restaurant.username} </p>
                <p className='user-mail'> Your added food items will show here </p>
            </div>

            <div className='row'>

                <div className='left'> 
                    <img src={cookingImg} className='cookingImg' />
                    <p> Good food is foundation of genuine happiness </p>
                </div>

                <div className='middle'>
                    {foodItems.map(food => (   
                        <div key={food.id} className='item-container'>
                            <Link to={`/partner-with-us/manage-food-items/${food.id}`} key={food.id}> 
                                <div className='item-left'>
                                    <p className='item-name'> {food.name} </p>
                                    <p className='item-description'> {food.description} </p>
                                    <p className='item-price'> Rs. {food.price} </p>
                                </div>
                                <div className='item-right'>
                                    <img src={`${food.image}`} alt='Food' height="150px" className='item-image'/>
                                </div>
                            </Link>
                        </div>    
                    ))}
                </div>

                <div className='right'>
                    <div className='cart-container'>
                        <h1 className='cart-heading'> MANAGE FOOD ITEMS </h1> <br/>
                        <p className='cart-subheading'> 
                            EATIN provides an easy interface to manage your food items. Perform any of the following operations by clicking on the corresponding food item: 
                            <br/> <br/>
                            - Change any of the existing data <br/>
                            - Add a new data <br/>
                            - Delete the existing data <br/><br/>
                        </p>
                    </div>
                </div>
            
            </div>
            
        </div>
    )
}

export default ManageFoodItems