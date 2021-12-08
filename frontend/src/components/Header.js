import React, {useContext} from 'react'
import { Link } from 'react-router-dom'
import { Redirect } from 'react-router'
import AuthContext from '../context/AuthContext'

const Header = () => {
    // Get the variables and functions from context data in AuthContext
    let {user, logoutUser} = useContext(AuthContext)

    return (
        <div>
            <Link to="/restaurants" >Home</Link>

            <span> | </span>
            {/* If user is logged in then show logout button else show login button */}
            {user ? (
                <Link to="">
                    <span onClick={logoutUser}>Logout</span>
                </Link>
            ): (
                <Link to="/login" >Login</Link>
            )}

            <span> | </span>
            {user ? (null) : 
            (
                <Link to="/register" >Register</Link>
            )}
              
            <span> | </span>
            {user ? (null) : 
            (
                <span> | </span>,
                <Link to="/partner-with-us" >Partner With Us</Link>
            )}

            <span> | </span>
            {/* If user exists then display the username */}
            {user ? (
                <Link to='/TODO'> {user.username} </Link>
            ) : 
            (null)}
           
        </div>
    )
}

export default Header
