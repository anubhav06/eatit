import React from 'react'
import './Header.css'
import './AddressBar.css'
import './PaymentsBar.css'

const PaymentsBar = ({deliveryAddress, checkout, disabled, setPaymentWindow, setDeliveryAddress}) => {
    

    return (
        <div>
            <div className='cart-container'>
                <p className='address-heading'> Delivery Address ✅</p>
                <div className='address-row'>
                    <p className='address-subpartHeading'> {deliveryAddress.label} </p>
                    <p className='address-subpartDetails'> {deliveryAddress.area} </p>
                    <button onClick={() => { setPaymentWindow(false); setDeliveryAddress({}) }} className='address-subpartBtn2' > Change </button>
                </div>
            </div>
            <div className='cart-container'>
                <p className='address-heading'> Payment Window </p>
                <div className='address-row'>
                    <p className='address-subpartDetails'> NOTE: You will be redirected to our payment partner's site </p>
                    <button onClick={checkout} disabled={disabled} className='address-subpartBtn'> Checkout → </button>
                    {/* If checkout button is clicked, then show a redirecting text */}
                    {disabled === true 
                    ?   <div style={{marginTop: '-10px'}}> Please wait. Redirecting . . . </div>
                    : (null)}
                    <div className='testPayment-warning'>
                        This is a test payment. Only test card can be used and no real payment is processed. <br/>
                        Use the following credentials to complete the payment in test mode: <br/><br/>
                        CARD NUMBER: 4242 4242 4242 4242 <br/>
                        VALID THRU: (Any future date) <br/>
                        OTHER DETAILS: (Any random value)
                    </div>
                </div>
            </div>
            
        </div>

    )
}

export default PaymentsBar
