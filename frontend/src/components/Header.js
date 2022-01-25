import React, {useContext, useState, useEffect} from 'react'
import AuthContext from '../context/AuthContext'
import './Header.css'
import logo from '../assets/eatin.png'
import { CSSTransition } from "react-transition-group";


// Refer: https://medium.com/@sidbentifraouine/responsive-animated-top-navigation-bar-with-react-transition-group-fd0ccbfb4bbb
// for how header is made.

const Header = () => {
    // Get the variables and functions from context data in AuthContext
    let {user, logoutUser} = useContext(AuthContext)

    // For header navbar
    const [isNavVisible, setNavVisibility] = useState(false);
    const [isSmallScreen, setIsSmallScreen] = useState(false);
  

    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 700px)");
        mediaQuery.addEventListener([], handleMediaQueryChange(mediaQuery));
        
    
        return () => {
          mediaQuery.removeEventListener([], handleMediaQueryChange(mediaQuery));
        };
    }, []);


    const handleMediaQueryChange = mediaQuery => {
        if (mediaQuery.matches) {
          setIsSmallScreen(true);
        } else {
          setIsSmallScreen(false);
        }
    };

    const toggleNav = () => {
        setNavVisibility(!isNavVisible);
    };

    return (
        <header className='Header'>

            <img src={logo} className='Logo' alt='logo' height='50'/>
            
            <CSSTransition
                in={!isSmallScreen || isNavVisible}
                timeout={350}
                classNames="NavAnimation"
                unmountOnExit
            >

                {user 
                ?   <nav className='Nav'>
                        {/* If user is logged in */}
                        <a href="/restaurants" className='link'>Home</a>
                        <a href='/my-account' className='link'> {user.username} </a>
                        <a href="" className='link' onClick={logoutUser}> Logout </a>
                    </nav>
                :   <nav className='Nav'>
                        {/* If user is logged out */}
                        <a href ="/login" className='link'> Login </a>
                        <a href="/register" className='link'> Register </a>
                        <a href="/partner-with-us" className='link'> Partner With Us </a>
                    </nav>
                }

            </CSSTransition>

            <button onClick={toggleNav} className="Burger">
                🍔
            </button>   
           
        </header>
    )
}

export default Header
