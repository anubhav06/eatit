import React from 'react'
import './Header.css'
import './LoginForm.css'


const RegisterForm = ({registerUser,phoneNo, mainForm, phoneForm, phoneVerificationForm, submitPhoneNumber, submitVerificationCode}) => {
    

    return (
        <div className='row'>

            <div className='form-column-left'>

                <div className='form-background'>
                        
                    {/* Form to submit the phone number */}
                    {phoneForm == true ?
                        <div>
                            <div className='form-header'> Registration Form </div>
                            <form onSubmit={submitPhoneNumber }>
                                <input type="number" name='number' placeholder="Enter mobile number" className='form-input'/> <br/>
                                <input type="submit" className='form-submit-btn'/>
                            </form>
                        </div>
                    : (null)}


                    {/*  Form to submit the phone verification number */}
                    {phoneVerificationForm == true ?
                        <div>
                            <div className='form-header'> Registration Form </div>
                            <form onSubmit={submitVerificationCode}>
                                <input type="number" name="number" value={phoneNo} disabled className='form-input'/>
                                <input type="number" name="code" placeholder='Enter verification Code' className='form-input' /> <br/> 
                                <input type="submit" className='form-submit-btn'/>
                            </form>
                        </div>
                    : (null)}
                    
                    
                    {/* The main registration form */}
                    {mainForm == true ?
                        <div>
                            <div className='form-header'> Registration Form </div>
                            <form onSubmit={registerUser}>
                                <input type="text" name="email" placeholder="Enter Email" className='form-input' />
                                <input type="text" name="username" placeholder="Enter Username" className='form-input'/>
                                <input type="password" name="password" placeholder="Enter Password" className='form-input'/>
                                <input type="password" name="confirmPassword" placeholder="Enter Password Again" className='form-input'/>
                                <input type="number" name="number" defaultValue={phoneNo} hidden /> <br/>

                                <input type="submit" className='form-submit-btn'/>    
                            </form>
                        </div>
                    : (null)}

                </div>
            </div>
            
            <div className='form-column-right'>
                TODO: ADD ABOUT EATIN HERE <br/><br/><br/><br/>
                blah blah blah . . . 
            </div>
        </div>

    )
}

export default RegisterForm
