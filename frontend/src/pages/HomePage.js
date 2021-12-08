import React, {useState, useEffect, useContext} from 'react'
import AuthContext from '../context/AuthContext'
import Header from '../components/Header'
import { Link } from 'react-router-dom'


const HomePage = () => {
    let [notes, setNotes] = useState([])
    let [restaurants, setRestaurants] = useState([])
    let {authTokens, logoutUser} = useContext(AuthContext)


    // call getNotes on load
    useEffect(()=> {
        
        // To fetch the notes of a user
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

            <ul>
                {restaurants.map(restaurant => (
                    <Link to={`/restaurants/${restaurant.id}`} key={restaurant.id}>
                        <li key={restaurant.id} >
                            <p> ID: {restaurant.id} </p>
                            <p> NAME: {restaurant.name} </p>
                            <p> ADDRESS: {restaurant.address} </p>
                        </li>
                    </Link>
                ))}
            </ul>

        </div>
    )
}

export default HomePage
