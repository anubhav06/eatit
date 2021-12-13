import React, {useState, useEffect, useContext} from 'react'
import Header from '../components/Header'


const ViewFoodItems = ({match}) => {

    let [foodItems, setFoodItems] = useState([])
    let [restaurantInfo, setRestaurantInfo] = useState([])

    let restaurantId = match.params.id

    // call getNotes on load
    useEffect(()=> {
        
        // To fetch the food items of a restaurant
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
                console.log('FoodData: ', data)
            }else {
                alert(response)
            }
            
        }
        

        // To fetch the info of the requested restaurant (like name, address)
        let getRestaurantInfo = async() =>{
            let response = await fetch(`http://127.0.0.1:8000/api/restaurants/info/${restaurantId}`, {
                method:'GET',
                headers:{
                    'Content-Type':'application/json',
                }
            })
            let data = await response.json()

            if(response.status === 200){
                setRestaurantInfo(data)
                console.log('Restaurant Info: ', restaurantInfo)
            }else {
                alert(response)
            }
            
        }
        

        getRestaurantInfo()
        getFoodItems()
    }, [])


    return (
        <div>
            <Header/>

            <br/>
            <hr/>
            {restaurantInfo.map(info => (
                <div key={info.id}>
                    <h2> {info.name} </h2>
                    <h3> {info.address} </h3>
                </div>
            ))}
            <hr/>
            <br/><br/>
            
                {foodItems.map(food => (   
                    <div key={food.id} >
                        Name: {food.name} <br/>
                        Description: {food.description} <br/>
                        Price: {food.price} <br/>
                        <img src={`http://localhost:8000${food.image}`} alt='Food' height="150px"/> <br/><br/><br/>
                        <button name='add' id={food.id}> Add </button>
                    </div>  
                ))}

        </div>
    )
}

export default ViewFoodItems
