import React, {useState, useEffect, useContext} from 'react'
import AuthContext from '../context/AuthContext'
import Header from '../components/Header'
import RestaurantList from '../components/RestaurantList'

import RestaurantOffer from '../assets/RestaurantOffer.png'
import RestaurantOffer1 from '../assets/RestaurantOffer1.png'
import RestaurantOffer2 from '../assets/RestaurantOffer2.png'
import RestaurantOffer3 from '../assets/RestaurantOffer3.png'

const HomePage = () => {
    let [notes, setNotes] = useState([])
    let [restaurants, setRestaurants] = useState([])
    let {authTokens, logoutUser} = useContext(AuthContext)


    useEffect(()=> {
        
        // To fetch all the restaurants
        let getRestaurants = async() =>{
            let response = await fetch('http://127.0.0.1:8000/api/restaurants/', {
                method:'GET',
                headers:{
                    'Content-Type':'application/json',
                }
            })
            let data = await response.json()

            if(response.status === 200){
                setRestaurants(data)
            }else if(response.statusText === 'Unauthorized'){
                logoutUser()
            }
            
        }
        
        getRestaurants()

    }, [])


    return (
        <div>
            <Header/>
            
            {/* OFFERS SECTION */}
            <div className='restaurant-offers-container'> 
                <div className='restaurant-offer-column'> <img src={RestaurantOffer}/> </div>
                <div className='restaurant-offer-column'> <img src={RestaurantOffer1}/> </div>
                <div className='restaurant-offer-column'> <img src={RestaurantOffer2}/> </div>
                <div className='restaurant-offer-column'> <img src={RestaurantOffer3}/> </div>
            </div>
            
            {/* RESTAURANT LISTS SECTION */}
            <div className='restaurant-row'>
                <p style={{fontSize: '42px'}}>{restaurants.length} restaurants </p><hr/>

                {restaurants.map(restaurant => (
                    <RestaurantList
                        restaurant={restaurant}
                    />
                ))}
            </div>

        </div>
    )
}

export default HomePage
