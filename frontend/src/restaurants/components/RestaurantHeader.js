import React, {useContext, useState, useEffect} from 'react'
import RestaurantAuthContext from '../context/RestaurantAuthContext'
import '../../components/Header.css'
import logo from '../../assets/eatin.png'
import { CSSTransition } from "react-transition-group";

const RestaurantHeader = () => {

    // Get the variables and functions from context data in AuthContext
    let {restaurant, logoutRestaurant} = useContext(RestaurantAuthContext)

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

                {restaurant 
                ?   <nav className='Nav'>
                        {/* If user is logged in */}
                        <a href="/partner-with-us/orders" className='link'>Home</a>
                        <a href="/partner-with-us/manage-food-items" className='link'> Manage Food Items </a>
                        <a href="/partner-with-us/add-food-item" className='link'> Add Food Item </a>
                        <a href="/partner-with-us/account-setup" className='link'> Account Setup </a>
                        <a href="#" className='link' onClick={logoutRestaurant}> Logout </a>
                    </nav>
                :   <nav className='Nav'>
                        {/* If user is logged out */}
                        <a href ="/partner-with-us/login" className='link'> Login </a>
                        <a href="/partner-with-us/register" className='link'> Register </a>
                        <a href="/restaurants" className='link'> Main Site </a>
                    </nav>
                }

            </CSSTransition>

            <button onClick={toggleNav} className="Burger">
                🍔
            </button>   
           
        </header>
    )
}

export default RestaurantHeader
