import React, {useContext} from 'react'
import AuthContext from '../context/AuthContext'

const RegisterPage = () => {

    let {registerUser} = useContext(AuthContext)
    return (
        <div>
            <form onSubmit={registerUser}>
                <input type="text" name="email" placeholder="Enter EMail" />
                <input type="text" name="username" placeholder="Enter Username" />
                <input type="password" name="password" placeholder="Enter Password"/>
                <input type="password" name="confirmPassword" placeholder="Enter Password Again"/>
                <input type="submit"/>
            </form>
        </div>
    )
}

export default RegisterPage
