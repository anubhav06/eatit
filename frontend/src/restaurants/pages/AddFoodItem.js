import React, {useContext} from 'react'
import RestaurantAuthContext from '../context/RestaurantAuthContext'
import RestaurantHeader from '../components/RestaurantHeader'
import '../../components/LoginForm.css'

const AddFoodItem = () => {

    let {addFoodItem, formLoading} = useContext(RestaurantAuthContext)
    
    return (
        <div>
            <RestaurantHeader/>

            <div className='row'>
                <div className='form-column-left'>
                    <div className='form-background'>

                        <div className='form-header'> Add food item here </div>
                        <form onSubmit={addFoodItem}>
                            <input type="text" name="name" placeholder="Food name" required className='form-input' /> <br/>
                            <input type="text" name="description" placeholder="Food Description" required className='form-input'/> <br/>
                            <input type="number" min="0" step="0.01" name="price" placeholder="Price" required className='form-input'/> <br/>
                            <div className='form-file-input-label'> Upload the food's image: </div>
                            <input type="file" accept="image/x-png,image/jpeg,image/jpg" name="image" placeholder="Food Image" required className='form-file-input'/> <br/>
                            
                            <input type="submit" disabled={formLoading} className='form-submit-btn'/>
                            {formLoading ? <p> Adding food. Please wait . . </p> : (null)}
                        </form>

                    </div>
                </div>
                <div className='form-column-right'>
                    <p className='formRight-heading'> EATIN </p>
                    <p className='formRight-subHeading'> Add a new food item to your inventory </p>
                    <p className='formRight-subHeading2'> Adding food made easy with EATIN </p>
                </div>
            </div>
        </div>
    )
}

export default AddFoodItem
