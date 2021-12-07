import React, {useState, useEffect, useContext} from 'react'
import { Redirect } from 'react-router'
import RestaurantAuthContext from '../context/RestaurantAuthContext'
import RestaurantHeader from '../components/RestaurantHeader'


const RestaurantHomePage = () => {
    let {restaurant} = useContext(RestaurantAuthContext)

    
    // If a normal user visits (With group=None), then redirect to normal users page
    if(restaurant?.group === 'None'){
        return( < Redirect to="/" /> )
    }

    // If user is already logged in, then redirect to the manage orders page
    if (restaurant){
        return( <Redirect to="/partner-with-us/orders" />)
    }

    return (
        <div>
            <RestaurantHeader/>
            <p> Welcome restaurant! NAME: {restaurant.username} GROUP:{restaurant.group}</p>
            <p>You are logged to the home page!</p>
            <br/><br/>
            <p> Your acive orders will show here </p>


            {/*<ul>
                {notes.map(note => (
                    <li key={note.id} >{note.body}</li>
                ))}
            </ul>*/}
        </div>
    )
}

export default RestaurantHomePage
