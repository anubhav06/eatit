import React, {useState, useEffect, useContext} from 'react'
import { Redirect } from 'react-router'
import RestaurantAuthContext from '../context/RestaurantAuthContext'
import RestaurantHeader from '../components/RestaurantHeader'


const ManageOrders = () => {
    let {restaurant} = useContext(RestaurantAuthContext)

    
    // If a normal user visits (With group=None), then redirect to normal users page
    if(restaurant?.group === 'None'){
        return( < Redirect to="/" /> )
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

export default ManageOrders
