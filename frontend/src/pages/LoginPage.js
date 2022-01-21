import React, {useContext, useState} from 'react'
import { Redirect } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import Header from '../components/Header'
import LoginForm from '../components/LoginForm'


const LoginPage = () => {

    // Get the login user function from AuthContext 
    let {user, loginUser, loginCustomUser} = useContext(AuthContext)
    // To store the user's phone number
    let [phoneNo, setPhoneNo] = useState({})

    let [userForm ,setUserForm] = useState(false)
    let [mobileForm, setMobileForm] = useState(true)
    let [verificationForm, setVerificationForm] = useState(false)

    // If a restaurant owner is logged in, then tell them to logout and login with a USER ACCOUNT to access the user's login
    if(localStorage.getItem('restaurantAuthTokens') !== null){
        return(  
            <p> You need to logout from your RESTAURANT ACCOUNT to login with the USER ACCOUNT ! </p>
        )
    }

    // To not allow login route to a user who is logged in. Redirect to '/'
    if(user){
        return( <Redirect to="/restaurants" /> )
    }

    
    // To submit phone number to recieve a verification code
    let submitPhoneNumber = async (e) => {
        e.preventDefault()
        // To temporarily store the phone number, and pass it for submission along with the main registration form (username, password)
        setPhoneNo(e.target.number.value)

        // Make a post request to the api with the mobile number.
        let response = await fetch('http://127.0.0.1:8000/api/mobile-send-message/', {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({'number':e.target.number.value})
        })
        let data = await response.json()

        if(response.status === 200){
            alert(data)
            setMobileForm(false)
            setVerificationForm(true)
        }else{
            console.log(data)
            alert(data)
        }

    }



    return (
        <div>
            <Header/>
            <LoginForm
                loginUser = {loginUser}
                loginCustomUser = {loginCustomUser}
                phoneNo = {phoneNo}
                userForm = {userForm}
                mobileForm = {mobileForm}
                verificationForm = {verificationForm}
                setPhoneNo = {setPhoneNo}
                setUserForm = {setUserForm}
                setMobileForm = {setMobileForm}
                setVerificationForm = {setVerificationForm}
                submitPhoneNumber = {submitPhoneNumber}
            />
        </div>
    )
}

export default LoginPage
