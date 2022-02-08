import React, {useState, useEffect, useContext} from 'react'
import { useHistory } from 'react-router-dom'
import Header from '../components/Header'
import AuthContext from '../context/AuthContext'
import './ViewFoodItems.css'
import FoodItem from '../components/FoodItem'
import CartItems from '../components/CartItems'
import RestaurantBanner from '../components/RestaurantBanner'
import cookingImg from '../assets/CookingSVG.png'
import loadingImg from '../assets/loading.gif'

const ViewFoodItems = ({match}) => {

    let {authTokens} = useContext(AuthContext)

    let [foodItems, setFoodItems] = useState([])
    let [restaurantInfo, setRestaurantInfo] = useState([])
    let [cartItems, setCartItems] = useState([])

    let restaurantId = match.params.id
    
    // To display a user's total cart amount
    let [totalAmount, setTotalAmount] = useState(0.00)
    // To disable add/remove from cart buttons till API gets back a response
    let [disableBtn, setDisableBtn] = useState(false)

    let [loading, setLoading] = useState(false)

    const history = useHistory()

    // useEffect runs the following methods on each load of page
    useEffect(()=> {
        
        // To fetch the food items of a restaurant
        let getFoodItems = async() =>{
            setLoading(true)
            let response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/restaurants/${restaurantId}`, {
                method:'GET',
                headers:{
                    'Content-Type':'application/json',
                }
            })
            let data = await response.json()
            setLoading(false)

            if(response.status === 200){
                setFoodItems(data)

            }else {
                alert('ERROR: While loading the food items', response)
            }
            
        }
        

        // To fetch the info of the requested restaurant (like name, address)
        let getRestaurantInfo = async() =>{
            let response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/restaurants/info/${restaurantId}`, {
                method:'GET',
                headers:{
                    'Content-Type':'application/json',
                }
            })
            let data = await response.json()

            if(response.status === 200){
                setRestaurantInfo(data)
            }else {
                alert('ERROR: While loading the restaurant\ns info ', response)
            }
        }


        // To get the cart items of the logged in user (all the food items added to the user's cart)
        let getCartItems = async() =>{
            let response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/get-cart-items/`, {
                method:'GET',
                headers:{
                    'Content-Type':'application/json',
                    // Provide the authToken when making API request to backend to access the protected route of that user
                    'Authorization':'Bearer ' + String(authTokens.access)
                }
            })
            let data = await response.json()

            if(response.status === 200){
                setCartItems(data)
                // If the user's cart is not empty, then get the cart's total amount from backend and store it
                if (data[0]?.totalAmount !== undefined){
                    var newTotalAmount = parseFloat(data[0]?.totalAmount)
                    setTotalAmount(newTotalAmount)
                }
            }else {
                alert('ERROR: While loading cart items', response)
            }
        }


        
        // Call these functions on each load of page
        getCartItems()
        getRestaurantInfo()
        getFoodItems()
    }, [authTokens, restaurantId])





    // To add an item to cart
    let addToCart = async(food) =>{
        // Disable add to cart btn till the API returns a response
        setDisableBtn(true)

        let response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/add-to-cart/${food.id}`, {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                // Provide the authToken when making API request to backend to access the protected route of that user
                'Authorization':'Bearer ' + String(authTokens.access)
            }
        })

                
        let data = await response.json()

        if(response.status === 200){
            
            const exist = cartItems.find((x) => x.food.id === food.id);

            // If the food item already exists in cart, then increase its quantity
            if(exist) {
                setCartItems(cartItems.map( (x) => (
                    x.food.id === food.id 
                    ? {...exist, qty : parseInt(exist.qty) + 1, amount : parseFloat(exist.amount) + parseFloat(exist.food.price)} 
                    : x
                )))
                
            }
            // If the food item is not already in cart (a new food is added to cart), then add the food details with quantity=1
            else{
                setCartItems([...cartItems, { id: data.id, qty:1, user: data.user, food: data.food, amount: parseFloat(data.food.price) }] )
            }

            //Update the user's cart's total amount by adding the added food item's price to the total amount
            var newTotalAmount = parseFloat(totalAmount) + parseFloat(food.price)
            setTotalAmount(parseFloat(newTotalAmount))

        } else {
            alert(data)
        }

        setDisableBtn(false)
    }


     // To remove an item from cart
     let removeFromCart = async(food) =>{
        // Disable remove from cart btn, till the API returns a response
        setDisableBtn(true)

        let response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/remove-from-cart/${food.id}`, {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                // Provide the authToken when making API request to backend to access the protected route of that user
                'Authorization':'Bearer ' + String(authTokens.access)
            }
        })
        

        if(response.status === 200){
            
            const exist = cartItems.find((x) => x.food.id === food.id);

            // If the food item's qty is 1, then delete the item from cart
            if(exist.qty === 1) {
                //console.log('QTY 0')
                setCartItems(cartItems.filter( cart => cart.food.id !== food.id ))
            }
            // If the food item already exists in cart, then decrease its quantity
            else{
                setCartItems(cartItems.map( (x) => (
                    x.food.id === food.id 
                    ? {...exist, qty : parseInt(exist.qty) - 1, amount : parseFloat(exist.amount) - parseFloat(exist.food.price)} 
                    : x
                )))
            }

            //Update the user's cart's total amount by subtracting the removed food item's price from total amount
            var newTotalAmount = parseFloat(totalAmount) - parseFloat(food.price)
            setTotalAmount(parseFloat(newTotalAmount))

        } else {
            alert('ERROR: Removing Item to cart ')
        }

        setDisableBtn(false)
    }





    return (
        <div>
            <Header/>
            
            <RestaurantBanner
                restaurantInfo={restaurantInfo}
            />
                
            <div className='row'>
                
                <div className='left'> 
                    <img src={cookingImg} className='cookingImg' alt='cookingImg' />
                    <p> Good food is foundation of genuine happiness </p>
                </div>

                <div className='middle'>
                    
                    {loading ? 
                    <div> 
                        <img src={loadingImg} style={{width: 50, marginTop:25, marginLeft: 25}} alt='loading' />
                        <p style={{fontSize:24, marginLeft:25}}> Getting restaurant's food. Please wait . . . </p>
                    </div> 
                    : 
                    <div>
                        {foodItems.length === 0 ? <div className='noItemNotice'> ☹️ No food items added by this restaurant. <br/> Try visiting some other restaurant's page! </div> : null}
                    </div> } 

                    {foodItems.map(food => ( 
                        <FoodItem
                            food={food}
                            cartItems={cartItems}
                            addToCart={addToCart}
                            removeFromCart={removeFromCart}
                            key={food.id}
                            disableBtn={disableBtn}
                        />
                    ))}
                    <hr/>

                    
                </div>

                

                {/* To show cart summary */}
                <div className='right'>
                    <CartItems
                        cartItems={cartItems}
                        addToCart={addToCart}
                        removeFromCart={removeFromCart}
                        totalAmount={totalAmount}
                        history={history}
                        disableBtn={disableBtn}
                    />
                </div>
            
            </div>


        </div>
    )
}

export default ViewFoodItems
