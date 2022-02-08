import React from 'react'


const CheckoutCancelPage = () => {


    return (
        <div>
            <h1> ⚠️Payment NOT COMPLETE ⚠️ </h1>
            <button onClick={() => window.location.href='/restaurants'} className='account-setup-btn2'>  Click here to go back to main site </button>
        </div>
    )

}

export default CheckoutCancelPage
