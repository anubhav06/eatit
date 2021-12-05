import React, {useContext} from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

const Header = () => {
    // Get the variables and functions from context data in AuthContext
    let {user, logoutUser} = useContext(AuthContext)


    return (
        <div>
            <Link to="/" >Home</Link>

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
                <Link to="/partner-with-us" >Partner With Us</Link>
            )}

            {/* If user exists then display the username */}
            {user &&   <p>Hello {user.username}</p>}
           
        </div>
    )
}

export default Header
