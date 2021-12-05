import React, {useState, useEffect, useContext} from 'react'
import { Redirect } from 'react-router'
import RestaurantAuthContext from '../context/RestaurantAuthContext'
import RestaurantHeader from '../components/RestaurantHeader'


const RestaurantHomePage = () => {
    let [notes, setNotes] = useState([])
    let {restaurant, authTokens, logoutRestaurant} = useContext(RestaurantAuthContext)

    // call getNotes on load
    useEffect(()=> {
        
        // To fetch the notes of a user
        let getNotes = async() =>{
            let response = await fetch('http://127.0.0.1:8000/api/notes/', {
                method:'GET',
                headers:{
                    'Content-Type':'application/json',
                    // Provide the authToken when making API request to backend to access the protected route of that user
                    'Authorization':'Bearer ' + String(authTokens.access)
                }
            })
            let data = await response.json()

            if(response.status === 200){
                setNotes(data)
            }else if(response.statusText === 'Unauthorized'){
                logoutRestaurant()
            }
            
        }

        getNotes()

        // eslint-disable-next-line react-hooks/exhaustive-deps

    }, [])

    //if (restaurant.group === "None"){
    //    return( <Redirect to="/" /> )
    //}

    return (
        <div>
            <RestaurantHeader/>
            <p> Welcome restaurant! NAME: {restaurant.username} GROUP:{restaurant.group}</p>
            <p>You are logged to the home page!</p>


            <ul>
                {notes.map(note => (
                    <li key={note.id} >{note.body}</li>
                ))}
            </ul>
        </div>
    )
}

export default RestaurantHomePage
