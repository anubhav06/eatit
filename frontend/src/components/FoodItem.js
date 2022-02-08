import React from 'react'
import './Header.css'
import './FoodItem.css'

const FoodItem = ({food, cartItems, addToCart, removeFromCart, disableBtn}) => {
    

    return (
        <div key={food.id} className='item-container' >
                            
            <div className='item-left'>
                <p className='item-name'> {food.name} </p>
                <p className='item-description'> {food.description} </p>
                <p className='item-price'> Rs. {food.price} </p>
            </div>

            <div className='item-right'>
                <img src={`${food.image}`} alt='Food' height="150px" className='item-image'/> 
            
                {cartItems.find(cart => cart.food.id === food.id) 
                // If food is already added in cart, then display buttons to increase/decrease the quantity 
                ?   <div key={food.id} className='item-addToCart'>
                        <button name='remove' onClick={ () => removeFromCart(food) } className='item-cartBtn' disabled={disableBtn}> - </button>
                        <p className='item-cartInfo'> {cartItems.find(cart => cart.food.id === food.id).qty} </p>
                        <button name='add' onClick={ () => addToCart(food) } className='item-cartBtn' disabled={disableBtn}> + </button>
                    </div> 
                // Else if item is not in cart, then display an add to cart button
                :   <div key={food.id}>
                        <button name='add' onClick={ () => addToCart(food)} className='item-addToCart' disabled={disableBtn}> ADD </button>
                    </div>
                }  
            
            </div>

        </div>  

    )
}

export default FoodItem
