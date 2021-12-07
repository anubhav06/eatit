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
                <input type="text" name="name" placeholder="Food name" required /> <br/>
                <input type="text" name="description" placeholder="Food Description" required/> <br/>
                <input type="number" min="0" step="0.01" name="price" placeholder="Price" required/> <br/>
                <input type="file" accept="image/x-png,image/jpeg,image/jpg" name="image" placeholder="Food Image" required/> <br/>
                
                <input type="submit"/>
            </form>
        </div>
    )
}

export default AddFoodItem
