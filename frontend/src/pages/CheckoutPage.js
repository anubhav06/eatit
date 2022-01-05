import React, {useState, useEffect, useContext, setState} from 'react'
import { useHistory } from 'react-router-dom'
import Header from '../components/Header'
import AuthContext from '../context/AuthContext'
import './ViewFoodItems.css'

const CheckoutPage = ({match}) => {

    let {authTokens} = useContext(AuthContext)
    let [cartItems, setCartItems] = useState([])
    // To display a user's total cart amount
    let [totalAmount, setTotalAmount] = useState(0.00)
    // To conditonally render a div based on if address has to be added.
    let [addAddressForm, setAddAddressForm] = useState(false);
    // To store all the user's address retrieved from api calls
    let [address, setAddress] = useState([])

    // Address selected by user to deliver to.
    let [deliveryAddress, setDeliveryAddress] = useState({})

    let [showPaymentWindow, setPaymentWindow] = useState(false)

    const history = useHistory()

    // Runs the following functions on each load of page
    useEffect(()=> {
              

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
                console.log('SET CART ITEMS DATA: ', data)
                // If the user's cart is not empty, then get the cart's total amount from backend and store it
                if (data[0]?.totalAmount !== undefined){
                    var newTotalAmount = parseFloat(data[0]?.totalAmount)
                    setTotalAmount(newTotalAmount)
                }
            }else {
                alert('ERROR: While loading cart items', response)
            }
        }



        // To get all the added address of a user
        let getAddress = async() =>{
            let response = await fetch(`http://127.0.0.1:8000/api/get-address/`, {
                method:'GET',
                headers:{
                    'Content-Type':'application/json',
                    // Provide the authToken when making API request to backend to access the protected route of that user
                    'Authorization':'Bearer ' + String(authTokens.access)
                }
            })
            let data = await response.json()


            if(response.status === 200){
                setAddress(data)
                console.log('SET ADDRESS: ', data)
            }else {
                alert('ERROR: While loading user\ns address', data)
            }
        }

        
        // Call these functions on each load of page
        getCartItems()
        getAddress()
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
            
            const exist = cartItems.find((x) => x.food.id == food.id);

            // If the food item's qty is 1, then delete the item from cart
            if(exist.qty === 1) {
                console.log('QTY 0')
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
            console.log("NEW TOTAL AMOUNT: ", newTotalAmount)
            setTotalAmount(parseFloat(newTotalAmount))

        } else {
            alert('ERROR: Removing Item to cart ')
            console.log('ERROR: ', response)
            console.log('ERROR data: ', response.json())
        }
    }


    // To add an address
    let addAddress = async(e) =>{
        e.preventDefault()

        let response = await fetch(`http://127.0.0.1:8000/api/add-address/`, {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                // Provide the authToken when making API request to backend to access the protected route of that user
                'Authorization':'Bearer ' + String(authTokens.access)
            },
            body: JSON.stringify({'area': e.target.area.value, 'label': e.target.label.value})
        })
        
        let data = await response.json()

        setAddAddressForm(false)

        if(response.status === 200){
            // Reload the current page to get the updated addresses
            window.location.reload()
        }
        else{
            alert(data)
            console.log('ERROR: ', data)
        }
    
    }


    // To place an order
    let placeOrder = async() =>{
        let response = await fetch(`http://127.0.0.1:8000/api/place-order/`, {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                // Provide the authToken when making API request to backend to access the protected route of that user
                'Authorization':'Bearer ' + String(authTokens.access)
            },
            body: JSON.stringify({'address': deliveryAddress})
        })
        
        let data = await response.json()

        if(response.status === 200){
            alert('Order Placed ✅')
            history.push('/my-account')
            console.log('SUCCESS: ', data)

        } else {
            alert(data)
            console.log('ERROR: ', data)
        }
    }


    console.log('CART ITEMS: ', cartItems)



    return (
        <div>
            <Header/>

            <br/>
            <hr/>

                
            <div className='row'>
                
                <div className='left'> TODO </div>

                <div className='middle'>
                    
                    {showPaymentWindow === false
                    ?   <div>
                            {addAddressForm
                            ?   <div>
                                    Save delivery address 
                                    <form onSubmit={addAddress}>
                                        <input type="text" name='area' placeholder='complete address' required/> <br/>
                                        <input type="text" name='label' placeholder='Label (Ex: Home/Work)' required/> <br/>
                                        <input type="submit" value={'Add'}/>
                                    </form>
                                </div>
                            :   <div>
                                    <div>
                                    Delivery Address + Payment
                                        <h2>Select Delivery Address</h2>
                                        {address.map(address => (
                                            <div key={address.id}>
                                                <h3>{address.label}</h3>
                                                <p>{address.area}</p>
                                                <button onClick={() => {setDeliveryAddress(address); setPaymentWindow(true); }}>
                                                    Deliver Here
                                                </button><br/><br/>
                                            </div>
                                        ))}
                                        <div>
                                            <p>Add a new address</p>
                                            <button onClick={() => setAddAddressForm(true)}>Add new</button>
                                        </div>
                                    </div>
                                    <div>
                                        <h2> Payment </h2>
                                    </div>
                                    
                                </div>
                            }
                        </div>
                    :   <div>
                            <div>
                                <h2> Delivery Address ✅</h2>
                                <h5> {deliveryAddress.label} </h5>
                                <p> {deliveryAddress.area} </p>
                                <button onClick={() => { setPaymentWindow(false); setDeliveryAddress({}) }} > Change </button>
                            </div>
                            <div>
                                <h2> Payment Window </h2>
                                <p> TODO: Add payment integration later. </p>
                                <button onClick={placeOrder}> Confirm Order </button>
                            </div>
                            
                        </div>
                    }

                    
                    
                    
                </div>

                

                {/* To show cart summary */}
                <div className='right'>
                    <h2>CART</h2>
                    {cartItems.map((cart) => (
                        <div key={cart.id}>
                            
                            {cart.food.restaurant.name}

                            <button name='remove' onClick={ () => removeFromCart(cart.food) }> - </button>
                            {cart.qty}  
                            <button name='add' onClick={ () => addToCart(cart.food) }> + </button><br/>
                            
                            AMOUNT: {cart.amount}
                            <br/><br/>
                        </div>
                    ))}
                    {cartItems.length !== 0 
                    ?   <div>
                            <strong>TOTAL : {totalAmount}</strong> <br/>
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

export default CheckoutPage