import React from 'react'
import './Header.css'
import './LoginForm.css'


const RegisterForm = ({registerUser,phoneNo, mainForm, phoneForm,loading, formLoading, phoneVerificationForm, submitPhoneNumber, submitVerificationCode}) => {
    

    return (
        <div className='row'>

            <div className='form-column-left'>

                <div className='form-background'>
                        
                    {/* Form to submit the phone number */}
                    {phoneForm === true ?
                        <div>
                            <div className='form-header'> Registration Form </div>
                            <form onSubmit={submitPhoneNumber }>
                                <input type="number" name='number' placeholder="Enter mobile number" className='form-input'/> <br/>
                                <input type="submit" disabled={loading} className='form-submit-btn'/>
                                {loading ? <p> Sending OTP. Please wait . . </p> : (null)}
                            </form>
                        </div>
                    : (null)}


                    {/*  Form to submit the phone verification number */}
                    {phoneVerificationForm === true ?
                        <div>
                            <div className='form-header'> Registration Form </div>
                            <form onSubmit={submitVerificationCode}>
                                <input type="number" name="number" value={phoneNo} disabled className='form-input'/>
                                <input type="number" name="code" placeholder='Enter verification Code' className='form-input' /> <br/> 
                                <input type="submit" disabled={loading} className='form-submit-btn'/>
                                {loading ? <p> Verifying the OTP. Please wait . . </p> : (null)}
                            </form>
                        </div>
                    : (null)}
                    
                    
                    {/* The main registration form */}
                    {mainForm === true ?
                        <div>
                            <div className='form-header'> Registration Form </div>
                            <form onSubmit={registerUser}>
                                <input type="text" name="email" placeholder="Enter Email" className='form-input' />
                                <input type="text" name="username" placeholder="Enter Username" className='form-input'/>
                                <input type="password" name="password" placeholder="Enter Password" className='form-input'/>
                                <input type="password" name="confirmPassword" placeholder="Enter Password Again" className='form-input'/>
                                <input type="number" name="number" defaultValue={phoneNo} hidden /> <br/>

                                <input type="submit" disabled={formLoading} className='form-submit-btn'/>    
                                {formLoading ? <p> Registering your account. Please wait . . </p> : (null)}
                            </form>
                        </div>
                    : (null)}

                </div>
            </div>
            
            <div className='form-column-right'>
                <p className='formRight-heading'> EATIN </p>
                <p className='formRight-subHeading'> <span id='spin'/> </p>
                <p className='formRight-subHeading2'> Order food from your favourite restaurants. </p>
            </div>
        </div>

    )
}

export default RegisterForm
