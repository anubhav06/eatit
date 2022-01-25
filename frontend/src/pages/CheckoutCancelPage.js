import React, {useContext, useEffect, useState} from 'react'
import { Redirect, useHistory } from 'react-router-dom'


const CheckoutCancelPage = () => {

    let [returnURLData, setReturnURLData] = useState({})
    const history = useHistory()


    return (
        <div>
            <h1> ⚠️Payment NOT COMPLETE ⚠️ </h1>
            <button onClick={() => window.location.href='/restaurants'} className='account-setup-btn2'>  Click here to go back to main site </button>
        </div>
    )

}

export default CheckoutCancelPage
