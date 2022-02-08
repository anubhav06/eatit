import React, {useState, useEffect, useContext} from 'react'
import AuthContext from '../context/AuthContext'
import Header from '../components/Header'
import RestaurantList from '../components/RestaurantList'

import RestaurantOffer from '../assets/RestaurantOffer.png'
import RestaurantOffer1 from '../assets/RestaurantOffer1.png'
import RestaurantOffer2 from '../assets/RestaurantOffer2.png'
import RestaurantOffer3 from '../assets/RestaurantOffer3.png'
import loadingGIF from '../assets/loading.gif'

const HomePage = () => {
    let [restaurants, setRestaurants] = useState([])
    let {logoutUser} = useContext(AuthContext)


    useEffect(()=> {
        
        
        // To fetch all the restaurants
        let getRestaurants = async() =>{
            let response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/restaurants/`, {
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

    }, [logoutUser])


    return (
        <div>
            <Header/>
            
            {/* OFFERS SECTION */}
            <div className='restaurant-offers-container'> 
                <div className='restaurant-offer-column'> <img src={RestaurantOffer} alt='offerImg 1'/> </div>
                <div className='restaurant-offer-column'> <img src={RestaurantOffer1} alt='offerImg 2'/> </div>
                <div className='restaurant-offer-column'> <img src={RestaurantOffer2} alt='offerImg 3'/> </div>
                <div className='restaurant-offer-column'> <img src={RestaurantOffer3} alt='offerImg 4'/> </div>
            </div>
            
            {/* RESTAURANT LISTS SECTION */}
            <div className='restaurant-row'>
                {/* To display a loading symbol until the API gets back a response from backend  */}
                {Object.keys(restaurants).length === 0 
                ?   <div>
                        <img src={loadingGIF} style={{width: 50, marginTop:25, marginLeft: 25}} alt='loading' />
                        <p style={{fontSize: '28px'}}> Getting restaurants for you. Please wait . . .  </p>
                    </div>
                : <div>
                    <p style={{fontSize: '42px'}}>{restaurants.length} restaurants </p><hr/>
                  </div>
                }

                {restaurants.map(restaurant => (
                    <RestaurantList
                        restaurant={restaurant}
                        key={restaurant.id}
                    />
                ))}

            </div>

        </div>
    )
}

export default HomePage
