import React from 'react'
import './Header.css'

const CartBar = ({cartItems, removeFromCart, addToCart, totalAmount}) => {
    

    return (
        <div className='cart-container'>
            <h1 className='cart-heading'>CART</h1>
            {cartItems.map((cart) => (
                <div key={cart.id} className='cart-row'>
                    
                    <p className='cart-left'>  {cart.food.name} </p>

                    <div className='cart-center'>
                        <div className='cart-addToCart'>
                            <button name='remove' onClick={ () => removeFromCart(cart.food) } className='cart-cartBtn'> - </button>
                            {cart.qty}  
                            <button name='add' onClick={ () => addToCart(cart.food) } className='cart-cartBtn'> + </button>
                        </div>
                    </div>    
                    <p className='cart-right'>
                        Rs. {cart.amount}
                    </p>
                </div>
            ))}
            {cartItems.length !== 0 
            ?   <div className='cart-row'>
                    <p className='cart-left cart-totalAmount'>TO PAY:</p>
                    <p className='cart-center'/> 
                    <p className='cart-right cart-totalAmount'> Rs. {totalAmount}</p> 
                </div>
            :   <div>
                    Cart empty
                </div>
            }
        </div>

    )
}

export default CartBar
