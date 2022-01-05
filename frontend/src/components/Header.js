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

            {user
            ?   <div>
                    <div>
                        <Link to=""> <span onClick={logoutUser}>Logout</span> </Link>
                    </div>
                    <div>
                        <Link to='/my-account'> {user.username} </Link>
                    </div>
                    
                </div>
            :   <div>
                    <div>
                        <Link to="/login" >Login</Link>
                    </div>
                    <div>
                        <Link to="/register" >Register</Link>
                    </div>
                    <div>
                        <Link to="/partner-with-us" >Partner With Us</Link>
                    </div>
                </div>
            }

           
           
        </div>
    )
}

export default Header
