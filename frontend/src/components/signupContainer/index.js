import React, { useState } from 'react'
import SignupForm from '../signupForm'
import LocalizationForm from '../localizationForm'
import Button from '../../common/button'

export default function SignupContainer({ history }) {
    const [formState, setFormState] = useState(false)
    const [data, setData] = useState({
        name: '',
        user: '',
        email: '',
        password: ''
    })
    const [clicked, setClicked] = useState(false)
    const [clicked2, setClicked2] = useState(false)

    function handleNext() {
        if (formState) {
            document.getElementsByClassName('form-container')[0].style.height = 'fit=content'
            document.getElementsByClassName('back-button')[0].style.opacity = 0
            document.getElementById('left-user-form').style.left = '0'
            document.getElementById('right-user-form').style.right = '-600px'
            document.getElementsByClassName('user-form-title')[0].style.marginLeft = '0'
            document.getElementsByClassName('user-form-title')[1].style.marginRight = '-1000px'
        } else {
            document.getElementsByClassName('back-button')[0].style.opacity = 1
            document.getElementById('left-user-form').style.left = '-600px'
            document.getElementById('right-user-form').style.right = '0'
            document.getElementsByClassName('user-form-title')[0].style.marginLeft = '-1000px'
            document.getElementsByClassName('user-form-title')[1].style.marginRight = '0'
        }
        setFormState(!formState)
    }

    return (
        <div className="signup-container row-center">
            <span className="signup-background" />
            <div className="signup-content column-center">
                <Button
                    className="back-button"
                    onClick={() => {
                        if (formState) {
                            setFormState(false)
                            handleNext()
                        }
                    }}
                />
                <ul className="title-container">
                    <h1 className="text-regular">Sign Up</h1>
                </ul>
                <img
                    src="https://static.xx.fbcdn.net/rsrc.php/v3/y2/r/__geKiQnSG-.png"
                    alt="close"
                    className="close"
                    onClick={() => {
                        if (formState) {
                            setFormState(false)
                            handleNext()
                        }

                        document.getElementsByClassName("signup-container")[0].style.display = "none"
                    }}
                />
                <div className="title-content row-center">
                    <h2 className="text-regular user-form-title">Personal data</h2>
                    <h2 className="text-regular user-form-title">Location data</h2>
                </div>
                <span className="line" />
                <div className="form-container row-center">
                    <SignupForm clicked={clicked} handleNext={handleNext} setData={setData} userData={data} />
                    <LocalizationForm clicked={clicked2} userData={data} history={history} />
                </div>
                <p className="text-tiny">
                    By clicking NEXT and REGISTER, you agree to our <span>Terms, Privacy Policy</span> and
                    <span> Cookies Policy</span>.
                </p>
                <Button
                    type="submit"
                    className="button-md"
                    onClick={() => {
                        if (!formState) {
                            setClicked(!clicked)
                        } else {
                            setClicked2(!clicked2)
                        }
                    }}
                >
                    {formState ? 'Register' : 'Next'}
                </Button>
            </div>
        </div >
    )
}