import React from 'react'
import { Link } from 'react-router-dom'
import './Header.css'
import './RestaurantList.css'


const RestaurantList = ({restaurant}) => {
    

    return (
        <Link to={`/restaurants/${restaurant.id}`} key={restaurant.id} className='restaurant-list-column'>
            <div key={restaurant.id} >
                <img src={`${restaurant.image}`} alt='Food' height="150px" className='restaurant-image'/>
                <p className='restaurant-heading'> {restaurant.name} </p>
                <p className='restaurant-address'> {restaurant.address} </p>
            </div>
        </Link>

    )
}

export default RestaurantList