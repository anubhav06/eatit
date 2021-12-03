import React, {useContext} from 'react'
import AuthContext from '../context/AuthContext'

const LoginPage = () => {

    // Get the login user function from AuthContext 
    let {loginUser} = useContext(AuthContext)
    return (
        <div>
            <form onSubmit={loginUser}>
                <input type="text" name="username" placeholder="Enter Username" />
                <input type="password" name="password" placeholder="Enter Password" />
                <input type="submit"/>
            </form>
        </div>
    )
}

export default LoginPage
