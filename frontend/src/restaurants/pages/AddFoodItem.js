import React, {useContext} from 'react'
import RestaurantAuthContext from '../context/RestaurantAuthContext'
import RestaurantHeader from '../components/RestaurantHeader'


const AddFoodItem = () => {

    let {addFoodItem} = useContext(RestaurantAuthContext)
    console.log('Add food item page')
    return (
        <div>
            <RestaurantHeader/>
            You can add a new food item here:
            <br/>
            
            <form onSubmit={addFoodItem}>
                <input type="text" name="name" placeholder="Food name" /> <br/>
                <input type="text" name="description" placeholder="Food Description"/> <br/>
                <input type="number" min="0" step="0.01" name="price" placeholder="Price"/> <br/>
                <input type="file" accept="image/x-png,image/jpeg,image/jpg" name="image" placeholder="Food Image"/> <br/>
                
                <input type="submit"/>
            </form>
        </div>
    )
}

export default AddFoodItem
