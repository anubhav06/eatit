import React, {useState, useEffect, useContext} from 'react'
import Header from '../components/Header'
import AuthContext from '../context/AuthContext'
import './CheckoutPage.css'
import AddressBar from '../components/AddressBar'
import PaymentsBar from '../components/PaymentsBar'
import CartBar from '../components/CartBar'

const CheckoutPage = () => {

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
    // To conditionally render the payment's window
    let [showPaymentWindow, setPaymentWindow] = useState(false)

    // To disable to checkout btn once clicked on it
    let [disabled, setDisabled] = useState(false)


    useEffect(()=> {
              

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



        // To get all the added address of a user
        let getAddress = async() =>{
            let response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/get-address/`, {
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
            }else {
                alert('ERROR: While loading user\ns address', data)
            }
        }

        
        // Call these functions on each load of page
        getCartItems()
        getAddress()
    }, [authTokens])





    // To add an item to cart
    let addToCart = async(food) =>{
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

            // Update the user's cart's total amount by adding the added food item's price to the total amount
            var newTotalAmount = parseFloat(totalAmount) + parseFloat(food.price)
            setTotalAmount(parseFloat(newTotalAmount))

        } else {
            alert(data)
        }
    }


     // To remove an item from cart
     let removeFromCart = async(food) =>{
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
    }


    // To add an address
    let addAddress = async(e) =>{
        e.preventDefault()

        let response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/add-address/`, {
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
        }
    
    }



    // To place an order
    let checkout = async() =>{
        setDisabled(true)
        let response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/checkout/`, {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                // Provide the authToken when making API request to backend to access the protected route of that user
                'Authorization':'Bearer ' + String(authTokens.access)
            },
            body: JSON.stringify({'address': deliveryAddress})
        })
        
        let data = await response.json()

        if(response.status === 303){
            window.location.href = data
        } else {
            alert(data)
        }
    }



    return (
        <div className='checkout-background'>
            <Header/>
                
            <div className='checkout-row'>
                
                <div className='checkout-left'>
                    {showPaymentWindow === false
                    ?   <AddressBar
                            addAddressForm={addAddressForm}
                            addAddress={addAddress}
                            address={address}
                            setDeliveryAddress={setDeliveryAddress}
                            setPaymentWindow={setPaymentWindow}
                            setAddAddressForm={setAddAddressForm}
                        />
                    :   <PaymentsBar
                            deliveryAddress={deliveryAddress}
                            checkout={checkout}
                            disabled={disabled}
                            setPaymentWindow={setPaymentWindow}
                            setDeliveryAddress={setDeliveryAddress}
                        />
                    }
                </div>

                
                {/* To show cart summary */}
                <div className='checkout-right'>
                    <CartBar
                        cartItems={cartItems}
                        removeFromCart={removeFromCart}
                        addToCart={addToCart}
                        totalAmount={totalAmount}
                    />
                </div>
            
            </div>


        </div>
    )
}

export default CheckoutPage
