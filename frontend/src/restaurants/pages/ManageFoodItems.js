import React, {useState, useEffect, useContext} from 'react'
import RestaurantAuthContext from '../context/RestaurantAuthContext'
import RestaurantHeader from '../components/RestaurantHeader'


const ManageFoodItems = () => {
    let [foodItems, setFoodItems] = useState([])
    let {authTokens, logoutRestaurant} = useContext(RestaurantAuthContext)

    // call getNotes on load
    useEffect(()=> {
        
        // To fetch the notes of a user
        let getFoodItems = async() =>{
            let response = await fetch('http://127.0.0.1:8000/restaurant/manage-food-items/', {
                method:'GET',
                headers:{
                    'Content-Type':'application/json',
                    // Provide the authToken when making API request to backend to access the protected route of that user
                    'Authorization':'Bearer ' + String(authTokens.access)
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
            <p> All your food items will show here: </p>


            <ul>
                {foodItems.map(food => (
                    
                    <li key={food.id} >
                        Name: {food.name} <br/>
                        Description: {food.description} <br/>
                        Price: {food.price} <br/>
                        <img src={`http://localhost:8000${food.image}`} alt='Food' height="150px"/> <br/><br/><br/>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default ManageFoodItems
