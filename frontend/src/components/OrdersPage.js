import React from 'react'
import './Header.css'
import './OrdersPage.css'
import orderImage from '../assets/Delivery.png'
import loadingImg from '../assets/loading.gif'

const OrdersPage = ({orders}) => {
    

    return (
        <div className='orders-container'>
            <div className='order-container-left'>
                <img src={orderImage} className='order-img' alt='quote'/>
                The joy of getting best
            </div>
            <div className='order-container-right'>             

                {Object.keys(orders).length === 0 
                ?   <div>
                        <img src={loadingImg} style={{width: 50, marginTop:25, marginLeft: 25}} alt='loading'/>
                        <p style={{fontSize:24, marginLeft: 25}}> Getting your orders. Please wait . . .  </p>
                    </div>
                : (null)} 

                {orders.map(order => (
                    <div key={order.id} className='orders-row'>
                        <div className='orders-row-left'>
                            <div className='order-status'>
                                {order.active === true 
                                ?   <div>
                                        🍽️ Your order has been placed
                                    </div>
                                :   <div>
                                        ✅Order delivered successfully
                                    </div>
                                }
                                <div> 
                                    <p> Ordered on '
                                        {order.date.split("-")[2]}-{order.date.split("-")[1]}-{order.date.split("-")[0]}', ' 
                                        {order.time.split(":")[0]}:{order.time.split(":")[1]}'
                                    </p>
                                </div>
                            </div>
                            <div className='order-address'>
                                <div>
                                    <p className='order-address-heading'> {order.restaurant.name} </p>
                                    <p className='order-address-subheading'> {order.restaurant.address} </p>
                                </div>
                                <p className='order-address-arrow'> ⇣ </p>
                                <div>  
                                    <p className='order-address-heading'> {order.address.label} </p>
                                    <p className='order-address-subheading'> {order.address.area} </p>
                                </div>
                            </div>
                        </div>
                        <div className='orders-row-right'>
                            <p className='order-details-heading'> ORDER DETAILS </p>
                            <div className='order-details'>
                                {order.cart.length} items
                                {order.cart.map( cart => (
                                    <div key={cart.id}>
                                        <p className='order-details-left'>
                                            {cart.food.name} x {cart.qty}
                                        </p>
                                        <p className='order-details-right'> 
                                            Rs. {cart.amount}
                                        </p>
                                    </div>
                                ))}
                                <hr/>
                                <p className='order-details-left'>
                                    BILL TOTAL: 
                                </p>
                                <p className='order-details-right'>
                                    Rs. {order.cart[0]?.totalAmount}
                                </p>
                            </div>
                        </div>
                    </div>
                ))} 
            </div>
        </div>

    )
}

export default OrdersPage
