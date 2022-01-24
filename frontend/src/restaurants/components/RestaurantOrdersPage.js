import React from 'react'
import '../../components/Header.css'
import '../../components/OrdersPage.css'
import orderImage from '../../assets/Delivery.png'

const RestaurantOrderPage = ({orders, updateOrder, showBtn}) => {
    

    return (
        <div>
            {orders.map(order => (
                <div key={order.id} className='orders-row'>
                    {order.active === true 
                    ?   <div className='orders-row'>
                            <div className='orders-row-left'>
                                <div className='order-status'>
                                    Ordered on '
                                    {order.date.split("-")[2]}-{order.date.split("-")[1]}-{order.date.split("-")[0]}' ,
                                    '{order.time.split(":")[0]}:{order.time.split(":")[1]}'
                                </div>
                                <div className='order-address'>
                                    <p className='order-address-heading'> Delivery Address: </p>
                                    <p className='order-address-subheading'> {order.address.area} </p>
                                </div>
                                {showBtn == true 
                                ?   <button onClick={() => updateOrder(order.id)} className='restaurant-orderDeliverBtn'> Mark as delivered </button>
                                : (null)}
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
                                                {cart.amount}
                                            </p>
                                        </div>
                                    ))}
                                    <hr/>
                                    <p className='order-details-left'>
                                        BILL TOTAL: 
                                    </p>
                                    <p className='order-details-right'>
                                        {order.cart[0]?.totalAmount}
                                    </p>
                                </div>
                            </div>
                    </div>
                    : (null) }
                </div>
            ))}
        </div>

    )
}

export default RestaurantOrderPage
