import React, {useState, useEffect, useContext, setState} from 'react'
import Header from '../components/Header'
import AuthContext from '../context/AuthContext'
import './ViewFoodItems.css'

const ViewFoodItems = ({match}) => {

    let {authTokens} = useContext(AuthContext)

    let [foodItems, setFoodItems] = useState([])
    let [restaurantInfo, setRestaurantInfo] = useState([])
    let [cartItems, setCartItems] = useState([])

    let restaurantId = match.params.id
    
    // To display a user's total cart amount
    let [totalAmount, setTotalAmount] = useState(0.00)

    // Runs the following functions on each load of page
    useEffect(()=> {
        
        // To fetch the food items of a restaurant
        let getFoodItems = async() =>{
            let response = await fetch(`http://127.0.0.1:8000/api/restaurants/${restaurantId}`, {
                method:'GET',
                headers:{
                    'Content-Type':'application/json',
                }
            })
            let data = await response.json()

            if(response.status === 200){
                console.log('FOOD DATA: ',data)
                setFoodItems(data)

            }else {
                alert('ERROR: While loading the food items', response)
            }
            
        }
        

        // To fetch the info of the requested restaurant (like name, address)
        let getRestaurantInfo = async() =>{
            let response = await fetch(`http://127.0.0.1:8000/api/restaurants/info/${restaurantId}`, {
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
            let response = await fetch(`http://127.0.0.1:8000/api/get-cart-items/`, {
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
    }, [])





    // To add an item to cart
    let addToCart = async(food) =>{
        let response = await fetch(`http://127.0.0.1:8000/api/add-to-cart/${food.id}`, {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                // Provide the authToken when making API request to backend to access the protected route of that user
                'Authorization':'Bearer ' + String(authTokens.access)
            }
        })
        
        let data = await response.json()

        if(response.status === 200){
            
            const exist = cartItems.find((x) => x.food === food.id);

            // If the food item already exists in cart, then increase its quantity
            if(exist) {
                setCartItems(cartItems.map( (x) => (
                    x.food === food.id 
                    ? {...exist, qty : parseInt(exist.qty) + 1, amount : parseFloat(exist.amount) + parseFloat(food.price)} 
                    : x
                )))
                
            }
            // If the food item is not already in cart (a new food is added to cart), then add the food details with quantity=1
            else{
                setCartItems([...cartItems, { id: data.id, qty:1, user: data.user, food: data.food, amount: parseFloat(food.price) }] )
            }

            //Update the user's cart's total amount by adding the added food item's price to the total amount
            var newTotalAmount = parseFloat(totalAmount) + parseFloat(food.price)
            setTotalAmount(parseFloat(newTotalAmount))

        } else {
            alert(data)
            console.log('ERROR: ', data)
        }
    }


     // To remove an item from cart
     let removeFromCart = async(food) =>{
        let response = await fetch(`http://127.0.0.1:8000/api/remove-from-cart/${food.id}`, {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                // Provide the authToken when making API request to backend to access the protected route of that user
                'Authorization':'Bearer ' + String(authTokens.access)
            }
        })
        

        if(response.status === 200){
            
            const exist = cartItems.find((x) => x.food == food.id);

            // If the food item's qty is 1, then delete the item from cart
            if(exist.qty == 1) {
                setCartItems(cartItems.filter( cart => cart.food !== food.id ))
            }
            // If the food item already exists in cart, then decrease its quantity
            else{
                setCartItems(cartItems.map( (x) => (
                    x.food === food.id 
                    ? {...exist, qty : parseInt(exist.qty) - 1, amount : parseFloat(exist.amount) - parseFloat(food.price)} 
                    : x
                )))
            }

            //Update the user's cart's total amount by subtracting the removed food item's price from total amount
            var newTotalAmount = parseFloat(totalAmount) - parseFloat(food.price)
            setTotalAmount(parseFloat(newTotalAmount))

        } else {
            alert('ERROR: Adding Item to cart ')
            console.log('ERROR: ', response)
        }
    }



    console.log('FOOD ITEMS: ', foodItems)
    console.log('CART ITEMS: ', cartItems)



    return (
        <div>
            <Header/>

            <br/>
            <hr/>
            {restaurantInfo.map(info => (
                <div key={info.id}>
                    <h2> {info.name} </h2>
                    <h3> {info.address} </h3>
                </div>
            ))}
            <hr/>
            <br/><br/>
                
            <div className='row'>
                
                <div className='left'> TODO </div>

                <div className='middle'>
                    
                    {foodItems.map(food => ( 
                        <div key={food.id} >
                            
                            Name: {food.name} <br/>
                            Description: {food.description} <br/>
                            Price: {food.price} <br/>
                            <img src={`http://localhost:8000${food.image}`} alt='Food' height="150px"/> <br/>
                        
                            {cartItems.find(cart => cart.food == food.id) 
                            // If food is already added in cart, then display buttons to increase/decrease the quantity 
                            ?   <div key={food.id}>
                                    <button name='remove' onClick={ () => removeFromCart(food) }> - </button>
                                    {cartItems.find(cart => cart.food == food.id).qty}
                                    <button name='add' onClick={ () => addToCart(food) }> + </button> <br/><br/><br/>
                                </div> 
                            // Else if item is not in cart, then display an add to cart button
                            :   <div key={food.id}>
                                    <button name='add' onClick={ () => addToCart(food)}> Add To Cart </button> <br/><br/><br/>
                                </div>
                            }  

                        </div>  
                    ))}
                    
                </div>

                

                {/* To show cart summary */}
                <div className='right'>
                    <h2>CART</h2>
                    {cartItems.map((cart) => (
                        <div key={cart.id}>
                            
                            {foodItems.find(food => food.id == cart.food)?.name}

                            <button name='remove' onClick={ () => removeFromCart(foodItems.find(food => food.id == cart.food)) }> - </button>
                            {cart.qty}  
                            <button name='add' onClick={ () => addToCart(foodItems.find(food => food.id == cart.food)) }> + </button><br/>
                            
                            AMOUNT: {foodItems.find(food => food.id == cart.food)?.price * cart.qty} 
                            <br/><br/>
                        </div>
                    ))}
                    {cartItems.length !== 0 
                    ?   <div>
                            <strong>TOTAL : {totalAmount}</strong>
                        </div>
                    :   <div>
                            Cart empty
                        </div>
                    }
                    
                </div>
            
            </div>


        </div>
    )
}

export default ViewFoodItems
