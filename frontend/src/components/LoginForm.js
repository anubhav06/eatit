import React from 'react'
import './Header.css'
import './LoginForm.css'


const LoginForm = ({loginUser, loginCustomUser, phoneNo, userForm, mobileForm, verificationForm, loading, formLoading, setUserForm, setMobileForm, setVerificationForm, submitPhoneNumber}) => {
    

    return (
        <div className='row'>

            <div className='form-column-left'>

                <div className='form-background'>
                        
                    {/* username-password login form */}
                    {userForm === true ?
                        <div>   
                            <div className='form-header'> Login Form </div>
                            <form onSubmit={loginUser}>
                                <input type="text" name="username" placeholder="Enter Username" className='form-input'/>
                                <input type="password" name="password" placeholder="Enter Password" className='form-input' /> <br/>
                                <input type="submit" disabled={formLoading} className='form-submit-btn'/>
                                {formLoading ? <p> Logging you in. Please wait . . </p> : (null)}
                            </form>
                        </div>
                    : (null)}
                    
                    {/* login via mobile number form */}
                    {mobileForm === true ?
                        <div>
                            <div className='form-header'> Login Form </div>
                            <form onSubmit={submitPhoneNumber}>
                                <input type="number" name="number" placeholder='Enter mobile number' className='form-input' required /> <br/>
                                <input type="submit" disabled={loading} value={'Send OTP'} className='form-submit-btn'/>
                                {loading ? <p> Sending OTP. Please wait . . </p> : (null)}
                            </form>
                        </div>
                    : (null)}

                    {/* form to enter verification code sent through text sms */}
                    {verificationForm === true ?
                        <form onSubmit={loginCustomUser}>
                            <input type="number" name="number" value={phoneNo} disabled className='form-input'/>
                            <input type="number" name="code" placeholder='Enter verification Code' className='form-input'/> <br/> 
                            <input type="submit" disabled={formLoading} className='form-submit-btn'/>
                            {formLoading ? <p> Verifying OTP. Please wait . . </p> : (null)}
                        </form>
                    : (null)}
                    
                    
                    <br/>
                    {/* To switch methods of login - either with mobile or with password */}
                    <a href='#' onClick={() => {setUserForm(!userForm); setMobileForm(!mobileForm); setVerificationForm(false)}}> 
                        {userForm === true 
                        ?   <p> Click here to login with mobile instead </p>
                        :   <p> Click here to login with password instead </p>
                        }
                        
                    </a>
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

export default LoginForm
