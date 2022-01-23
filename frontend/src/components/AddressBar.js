import React from 'react'
import './Header.css'
import './AddressBar.css'

const AddressBar = ({addAddressForm, addAddress, address, setDeliveryAddress, setPaymentWindow, setAddAddressForm}) => {
    

    return (
         <div >
            <div>
                {addAddressForm
                ?   <div className='cart-container'>
                        <p className='address-heading'> Save delivery address </p> 
                        <form onSubmit={addAddress} className='address-addForm'>
                            <input type="text" name='area' placeholder='Complete Address' required className='address-addFormFields'/> <br/>
                            <input type="text" name='label' placeholder='Label (Ex: Home/Work)' required className='address-addFormFields'/> <br/>
                            <input type="submit" value={'Add'} className='address-subpartBtn2'/>
                        </form>
                    </div>
                :   <div >
                        <div className='cart-container'>
                            <p className='address-heading'>Select Delivery Address</p>
                            <div className='address-row'>
                                {address.map(address => (
                                    <div key={address.id} className='address-subpart'>
                                        <p className='address-subpartHeading'>{address.label}</p>
                                        <p className='address-subpartDetails'>{address.area}</p>
                                        <button onClick={() => {setDeliveryAddress(address); setPaymentWindow(true); }} className='address-subpartBtn'>
                                            DELIVER HERE
                                        </button>
                                    </div>
                                ))}
                                <div className='address-subpart'>
                                    <p className='address-subpartHeading'>Add New Address</p>
                                    <button onClick={() => setAddAddressForm(true)} className='address-subpartBtn2'>ADD NEW</button>
                                </div>
                            </div>
                        </div>
                        <div className='payment-disabled'>
                            <p className='address-heading'> Payment </p>
                        </div>
                        
                    </div>
                }
            </div>
         </div>

    )
}

export default AddressBar
