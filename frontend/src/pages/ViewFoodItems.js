import React, {useState, useEffect, useContext} from 'react'
import Header from '../components/Header'


const ViewFoodItems = ({match}) => {

    let [foodItems, setFoodItems] = useState([])

    let restaurantId = match.params.id

    // call getNotes on load
    useEffect(()=> {
        
        // To fetch the notes of a user
        let getFoodItems = async() =>{
            let response = await fetch(`http://127.0.0.1:8000/api/restaurants/${restaurantId}`, {
                method:'GET',
                headers:{
                    'Content-Type':'application/json',
                }
            })
            let data = await response.json()

            if(response.status === 200){
                setFoodItems(data)
            }else {
                alert(response)
            }
            
        }

        getFoodItems()

    }, [])


    return (
        <div>
            <Header/>

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

export default ViewFoodItems
