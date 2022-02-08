import { createContext, useState, useEffect } from 'react'
import jwt_decode from "jwt-decode";
import { useHistory } from 'react-router-dom'

const AuthContext = createContext()

export default AuthContext;


export const AuthProvider = ({children}) => {

    // Get the value of authToken from local storage. If the local storage contains authTokens, then parse the token(get the value back) , else set that to null
    // Callback function sets the value only once on inital load 
    let [authTokens, setAuthTokens] = useState(()=> localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
    // If the local storage contains authTokens, then decode the token, else set that to null
    let [user, setUser] = useState(()=> localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')) : null)
    let [loading, setLoading] = useState(true)

    // To check the API state, before an API is called, and after the API has returned a response.
    let [formLoading, setFormLoading] = useState(false)

    const history = useHistory()



    // To login a custom user who wishes to login using mobile authentication (i.e. text SMS verification code)
    let loginCustomUser = async (e)=> {
        e.preventDefault()
        setFormLoading(true)
        // To submit the twilio's SMS verification code

        // Make a post request to the api with the mobile number.
        let twilioResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/mobile-verification/`, {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({'number':e.target.number.value, 'code':e.target.code.value})
        })
        let twilioData = await twilioResponse.json()

        // If verification code is invalid, then backend returns a status code of 412
        if (twilioResponse.status === 412){
            alert(twilioData)
        }
        else if(twilioResponse.status !== 200){
            //console.log("ERROR: ", twilioData)
            alert(twilioData)
        }
        // If verification code is correct, then go on to login the user
        else{

            // Make a post request to the api with the user's credentials.
            let response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/custom-login/`, {
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({'number': e.target.number.value})
            })
            // Get the access and refresh tokens
            let data = await response.json()
            setFormLoading(false)

            if(response.status === 200){

                // If a restaurant owner tries to login, the return without allocating the authTokens
                if(jwt_decode(data.access)['group'] === 'Restaurant'){
                    alert('You need to login with a user account')
                    return 
                }

                // Update the state with the logged in tokens
                setAuthTokens(data) 
                // Decode the access token and store the information
                setUser(jwt_decode(data.access))
                // Set the authTokens in the local storage
                localStorage.setItem('authTokens', JSON.stringify(data))
                // Redirect user to home page
                history.push('/restaurants')
            }
            // Status Code 406 means no user exists with the provided phone number
            else if(response.status === 406){
                alert(data)
            }
            else{
                alert('Something went wrong!')
            }

        }
    }



    // Login User method
    let loginUser = async (e )=> {
        e.preventDefault()
        setFormLoading(true)

        // Make a post request to the api with the user's credentials.
        let response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/token/`, {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            // 'e.target' is the form, '.username' gets the username field and '.password' gets the password field from wherever it is called (LoginPage.js here)
            body:JSON.stringify({'username':e.target.username.value, 'password':e.target.password.value})
        })
        // Get the access and refresh tokens
        let data = await response.json()
        setFormLoading(false)

        if(response.status === 200){

            // If a restaurant owner tries to login, the return without allocating the authTokens
            if(jwt_decode(data.access)['group'] === 'Restaurant'){
                alert('You need to login with a user account')
                return 
            }

            // Update the state with the logged in tokens
            setAuthTokens(data) 
            // Decode the access token and store the information
            setUser(jwt_decode(data.access))
            // Set the authTokens in the local storage
            localStorage.setItem('authTokens', JSON.stringify(data))
            // Redirect user to home page
            history.push('/restaurants')
        }else{
            alert('Something went wrong!')
        }
    }

    
    // Logout User method
    let logoutUser = () => {
        // To logout, set 'setAuthTokens' and 'setUser' to null and remove the 'authTokens' from local storage
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem('authTokens')
        history.push('/')
    }


    // To register a user
    let registerUser = async (e) => {
        e.preventDefault()
        setFormLoading(true)

        // Make a post request to the api with the user's credentials.
        let response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/register/`, {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            // 'e.target' is the form, '.username' gets the username field and '.password' gets the password field from wherever it is called (RegisterPage.js here)
            body:JSON.stringify({'username':e.target.username.value, 'password':e.target.password.value, 'confirmPassword':e.target.confirmPassword.value, 'email':e.target.email.value, 'number': e.target.number.value})
        })
        // Get the access and refresh tokens
        let data = await response.json()
        setFormLoading(false)

        // If registration is successfull, then go ahead and login.
        if(response.status === 200){
            loginUser(e)
        }
        else{
            alert('ERROR: ', data)
        }

    }

    // Context data for AuthContext so that it can be used in other pages
    let contextData = {
        user:user,
        authTokens:authTokens,
        formLoading:formLoading,

        loginCustomUser:loginCustomUser,
        loginUser:loginUser,
        logoutUser:logoutUser,
        registerUser:registerUser,

    }


    // To update the access tokens after every few time interval
    useEffect(()=> {

        // --------------------------- updateToken method  ----------------------------------------
        // To update the access token
        let updateToken = async ()=> {

            // If no authToken exists i.e. user is not logged in then return
            if(!authTokens){
                setLoading(false)
                return
            }
            // Make a post request to the api with the refresh token to update the access token
            let response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/token/refresh/`, {
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                // Send the refresh token
                body:JSON.stringify({'refresh':authTokens?.refresh})
            })
            let data = await response.json()
            
            if (response.status === 200){   
                // Update the data as done similarly in the login user method
                setAuthTokens(data)
                setUser(jwt_decode(data.access))
                localStorage.setItem('authTokens', JSON.stringify(data))
            }else{
                logoutUser()
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
        <AuthContext.Provider value={contextData} >
            {/* Render children components only after AuthContext loading is complete */}
            {loading ? null : children}
        </AuthContext.Provider>
    )
}
