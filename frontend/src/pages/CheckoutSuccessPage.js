import React, {useContext, useEffect, useState} from 'react'
import { Redirect, useHistory } from 'react-router-dom'


const CheckoutSuccessPage = () => {

    let [returnURLData, setReturnURLData] = useState({})
    const history = useHistory()


    return (
        <div>
            <h1> Payment Complete ✅ </h1>
        </div>
    )

}

export default CheckoutSuccessPage
