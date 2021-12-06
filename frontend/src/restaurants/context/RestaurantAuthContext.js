// AuthContext for the restaurant app (partner-with-us)

import { createContext, useState, useEffect } from 'react'
import jwt_decode from "jwt-decode";
import { useHistory } from 'react-router-dom'
import axios from "axios";

const RestaurantAuthContext = createContext()

export default RestaurantAuthContext;


export const RestaurantAuthProvider = ({children}) => {

    // Get the value of authToken from local storage. If the local storage contains authTokens, then parse the token(get the value back) , else set that to null
    // Callback function sets the value only once on inital load 
    let [authTokens, setAuthTokens] = useState(()=> localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
    // If the local storage contains authTokens, then decode the token, else set that to null
    let [restaurant, setRestaurant] = useState(()=> localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')) : null)
    let [loading, setLoading] = useState(true)

    const history = useHistory()


    // Login Restaurant method
    let loginRestaurant = async (e )=> {
        e.preventDefault()

        // Make a post request to the api with the Restaurant's credentials.
        let response = await fetch('http://127.0.0.1:8000/restaurant/api/token/', {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            // 'e.target' is the form, '.username' gets the username field and '.password' gets the password field from wherever it is called (LoginPage.js here)
            body:JSON.stringify({'username':e.target.username.value, 'password':e.target.password.value})
        })
        // Get the access and refresh tokens
        let data = await response.json()

        if(response.status === 200){
            // Update the state with the logged in tokens
            setAuthTokens(data) 
            // Decode the access token and store the information
            setRestaurant(jwt_decode(data.access))
            // Set the authTokens in the local storage
            localStorage.setItem('authTokens', JSON.stringify(data))
            // Redirect restaurant to home page
            history.push('/partner-with-us/orders')
        }else{
            alert('Something went wrong!')
        }
    }

    
    // Logout Restaurant method
    let logoutRestaurant = () => {
        // To logout, set 'setAuthTokens' and 'setUser' to null and remove the 'authTokens' from local storage
        setAuthTokens(null)
        setRestaurant(null)
        localStorage.removeItem('authTokens')
        //history.push('/login')
    }



    // To register a Restaurant
    let registerRestaurant = async (e) => {
        e.preventDefault()

        // Make a post request to the api with the user's credentials.
        let response = await fetch('http://127.0.0.1:8000/restaurant/register/', {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            // 'e.target' is the form, '.username' gets the username field and '.password' gets the password field from wherever it is called (RegisterPage.js here)
            body:JSON.stringify({ 'email':e.target.email.value, 'password':e.target.password.value, 'confirmPassword':e.target.confirmPassword.value, 'name':e.target.name.value, 'address':e.target.address.value})
        })
        // Get the access and refresh tokens
        let data = await response.json()

        if(response.status === 200){
            console.log('Registered Successfully')
            alert(data)
            history.push('/')
        }else{
            console.log(data)
            alert(data)
        }

    }




    // To add a new food item
    let addFoodItem = async (e) => {
        e.preventDefault()

        // Reference: https://medium.com/@emeruchecole9/uploading-images-to-rest-api-backend-in-react-js-b931376b5833
        let form_data = new FormData();
        form_data.append('image', e.target.image.files[0]);
        form_data.append('name', e.target.name.value);
        form_data.append('description', e.target.description.value);
        form_data.append('price', e.target.price.value);

        let url = 'http://127.0.0.1:8000/restaurant/add-food-item/';
        axios.post(url, form_data, {
        headers: {
            'content-type': 'multipart/form-data',
            'Authorization':'Bearer ' + String(authTokens.access)
        }
        })
        .then(res => {
          alert(res.data);
        })
        .catch(err => alert(err))
        
    }

    

    // Context data for AuthContext so that it can be used in other pages
    let contextData = {
        restaurant:restaurant,
        authTokens:authTokens,
        loginRestaurant:loginRestaurant,
        logoutRestaurant:logoutRestaurant,
        registerRestaurant:registerRestaurant,
        addFoodItem:addFoodItem
    }


    // To update the access tokens after every few time interval
    useEffect(()=> {

        // --------------------------- updateToken method  ----------------------------------------
        // To update the access token
        let updateToken = async ()=> {

            // If no authToken exists i.e. restaurant is not logged in then return
            if(!authTokens){
                setLoading(false)
                return
            }
            // Make a post request to the api with the refresh token to update the access token
            let response = await fetch('http://127.0.0.1:8000/restaurant/api/token/refresh/', {
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                // Send the refresh token
                body:JSON.stringify({'refresh':authTokens?.refresh})
            })
            let data = await response.json()
            
            if (response.status === 200){   
                // Update the data as done similarly in the login restaurant method
                setAuthTokens(data)
                setRestaurant(jwt_decode(data.access))
                localStorage.setItem('authTokens', JSON.stringify(data))
            }else{
                logoutRestaurant()
            }

            if(loading){
                setLoading(false)
            }
        }
        // --------------------------- updateToken method end  ----------------------------------------


        if(loading){
            updateToken()
        }

        let fourMinutes = 1000 * 60 * 4

        let interval =  setInterval(()=> {
            if(authTokens){
                updateToken()
            }
        }, fourMinutes)
        // Clear the interval after firing preventing re-initializing every time, refer to docs for more details
        return ()=> clearInterval(interval)

    }, [authTokens, loading])

    return(
        <RestaurantAuthContext.Provider value={contextData} >
            {/* Render children components only after AuthContext loading is complete */}
            {loading ? null : children}
        </RestaurantAuthContext.Provider>
    )
}
