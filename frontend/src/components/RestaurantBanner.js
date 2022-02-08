import React from 'react'
import './Header.css'
import './RestaurantBanner.css'

const RestaurantBanner = ({restaurantInfo}) => {
    

    return (
         <div className='restaurant-banner'>
            {restaurantInfo.map(info => (
                <div key={info.id}>
                    <div className='banner-left'>
                        <img src={info.image} className='banner-image' alt='restaurant'/>
                    </div>
                    <div className='banner-right'>
                        <p className='banner-heading'> {info.name} </p>
                        <p className='banner-subheading'> {info.address} </p>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default RestaurantBanner
