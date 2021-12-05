import React, {useContext} from 'react'
import { Redirect } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import Header from '../components/Header'

const LoginPage = () => {

    // Get the login user function from AuthContext 
    let {user, loginUser} = useContext(AuthContext)

    // To not allow login route to a user who is logged in. Redirect to '/'
    if(user){
        return( <Redirect to="/" /> )
    }

    return (
        <div>
            <Header/>
            <form onSubmit={loginUser}>
                <input type="text" name="username" placeholder="Enter Username" />
                <input type="password" name="password" placeholder="Enter Password" />
                <input type="submit"/>
            </form>
        </div>
    )
}

export default LoginPage
