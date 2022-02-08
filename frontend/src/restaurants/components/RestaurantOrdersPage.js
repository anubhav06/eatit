import React from 'react'
import '../../components/Header.css'
import '../../components/OrdersPage.css'

const RestaurantOrderPage = ({orders, updateOrder, showBtn}) => {
    

    return (
        <div>
            {orders.length === 0 ? <h2 style={{marginTop: '10px', marginLeft: '10px'}}> No orders so far </h2> : (null)}
            {orders.map(order => (
                <div key={order.id} className='orders-row'>
                    {order.active === showBtn 
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
                                {showBtn === true 
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
                    : (null) }
                </div>
            ))}
        </div>

    )
}

export default RestaurantOrderPage
