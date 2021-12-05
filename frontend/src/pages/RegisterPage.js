import React, {useContext} from 'react'
import { Redirect } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import Header from '../components/Header'


const RegisterPage = () => {

    let {user, registerUser} = useContext(AuthContext)

    // To not allow login route to a user who is logged in. Redirect to '/'
    if(user){
        return( <Redirect to="/" /> )
    }

    return (
        <div>
            <Header/>
            <form onSubmit={registerUser}>
                <input type="text" name="email" placeholder="Enter Email" />
                <input type="text" name="username" placeholder="Enter Username" />
                <input type="password" name="password" placeholder="Enter Password"/>
                <input type="password" name="confirmPassword" placeholder="Enter Password Again"/>
                <input type="submit"/>
            </form>
        </div>
    )
}

export default RegisterPage
