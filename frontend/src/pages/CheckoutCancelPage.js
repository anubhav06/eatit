import React, {useContext, useEffect, useState} from 'react'
import { Redirect, useHistory } from 'react-router-dom'


const CheckoutCancelPage = () => {

    let [returnURLData, setReturnURLData] = useState({})
    const history = useHistory()


    return (
        <div>
            <h1> ⚠️Payment NOT COMPLETE ⚠️ </h1>
        </div>
    )

}

export default CheckoutCancelPage
