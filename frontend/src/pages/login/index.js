import React from 'react'
import Footer from '../../components/footer'
import Logo from '../../lib/assets/logo.svg'
import Loading from '../../components/loading'
import Background from '../../components/background'
import LoginContainer from '../../components/loginContainer'
import SignupContiner from '../../components/signupContainer'
import './styles.scss'

export default function Login({ history }) {
    if (localStorage.getItem('urbanVG-token')) {
        history.push('/home')
    }

    return (
        <div className="container row-center">
            <Background />
            <div className="title-container">
                <h1 className="text-large row-center">UrbanVG <img src={Logo} alt="logo" /></h1>
                <p className="text-regular">O UrbanVG ajuda você a se conectar e compartilhar suas hortas com pessoas da sua cidade!</p>
            </div>
            <LoginContainer history={history} />
            <SignupContiner history={history} />
            <Footer />
            <Loading />
        </div>
    )
}