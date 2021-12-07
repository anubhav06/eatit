import React, {useState, useEffect, useContext} from 'react'
import RestaurantAuthContext from '../context/RestaurantAuthContext'
import RestaurantHeader from '../components/RestaurantHeader'


const EditFoodItem = ({match}) => {
    let [foodItem, setFoodItem] = useState([])
    let [updateFood , updateFoodItem] = useState(null)
    let { editFoodItem, deleteFoodItem, restaurantAuthTokens} = useContext(RestaurantAuthContext)

    let foodId = match.params.id

    useEffect(() => {
        getFood()
    }, [foodId] )

    // API Route to update food based on the ID
    let getFood = async () => {
        let response = await fetch(`http://127.0.0.1:8000/restaurant/manage-food-items/${foodId}`, {
            method: 'GET',
            headers:{
                'Content-Type':'application/json',
                // Provide the authToken when making API request to backend to access the protected route of that user
                'Authorization':'Bearer ' + String(restaurantAuthTokens.access)
            }
        })
        let data = await response.json()
        setFoodItem(data)
    }


    return (
        <div>
            <RestaurantHeader/>
            <p> Edit you food item here: </p> <br/>

            {foodItem.map( food => (
                
                <div key={food.id}>

                    {/* Form to edit the food item details */}
                    <form onSubmit={editFoodItem}>
                        <input type="hidden" name="id" defaultValue={food.id} />
                        <input type="text" name="name" defaultValue={food.name} onChange={(e) => {updateFoodItem({...updateFood, 'body': e.target.value})}} />
                        <input type="text" name="description" defaultValue={food.description} onChange={(e) => {updateFoodItem({...updateFood, 'body': e.target.value})}} /> <br/>
                        <input type="number" min="0" step="0.01" name="price" defaultValue={food.price} onChange={(e) => {updateFoodItem({...updateFood, 'body': e.target.value})}} /> <br/>
                        <input type="file" accept="image/x-png,image/jpeg,image/jpg" name="image"/> <br/>
                        
                        <input type="submit" value="Update"/>
                    </form>

                    {/* Button to delete the food item */}
                    <button onClick={deleteFoodItem} name="id" value={food.id}> 
                        DELETE ITEM 
                    </button>
                </div>
            ))}
        
    
        </div>
    )
}

export default EditFoodItem
