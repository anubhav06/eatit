import React from 'react'
import './Header.css'
import './CartItems.css'

const CartItems = ({cartItems, removeFromCart, addToCart, totalAmount, history, disableBtn}) => {
    

    return (
         <div className='cart-container'>
             <h1 className='cart-heading'>CART</h1>
             <p className='cart-subheading'> {cartItems.length} items </p>
             <div>
                {cartItems.map((cart) => (
                    <div key={cart.id} className='cart-row'>
                        
                        <p className='cart-left'>  {cart.food.name} </p>

                        <div className='cart-center'>
                            <div className='cart-addToCart'>
                                <button name='remove' onClick={ () => removeFromCart(cart.food) } className='cart-cartBtn' disabled={disableBtn}> - </button>
                                {cart.qty}  
                                <button name='add' onClick={ () => addToCart(cart.food) } className='cart-cartBtn' disabled={disableBtn}> + </button>
                            </div>
                        </div>    
                        <p className='cart-right'>
                            Rs. {cart.amount}
                        </p>
                    </div>
                ))}
            </div>
            <div>
                {cartItems.length !== 0 
                ?   <div className='cart-row'>
                        <p className='cart-left cart-totalAmount'>Total:</p>
                        <p className='cart-center'/> 
                        <p className='cart-right cart-totalAmount'> Rs. {totalAmount}</p> 
                        <button onClick={() => history.push('/checkout')} className='cart-checkout'> Checkout → </button>
                    </div>
                :   <div>
                        Cart empty
                    </div>
                }
            </div>
         </div>

    )
}

export default CartItems
