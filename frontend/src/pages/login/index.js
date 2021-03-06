import React from 'react'
import Alert from '@material-ui/lab/Alert'
import Footer from '../../components/footer'
import Logo from '../../lib/assets/logo.svg'
import Loading from '../../components/loading'
import Background from '../../components/background'
import LoginContainer from '../../components/loginContainer'
import SignupContiner from '../../components/signupContainer'
import alertController from '../../functions/alertController'
import loginPt from '../../lib/language/pt-br/page/login.json'
import loginEn from '../../lib/language/en/page/login.json'

export default function Login({ history }) {
    if (localStorage.getItem('urbanVG-token')) {
        history.push('/home')
    }

    return (
        <div className="container row-center">
            <Background />
            <div className="title-container">
                <h1 className="text-large row-center">UrbanVG <img src={Logo} alt="logo" /></h1>
                <p className="text-regular">{loginEn.login.welcome}</p>
            </div>
            <LoginContainer history={history} />
            <SignupContiner history={history} />
            <Alert onClose={() => {
                alertController.closeAlert('singup-alert')
            }} variant="filled" id="singup-alert">
                <p />
            </Alert>
            <Footer />
            <Loading />
        </div>
    )
}