import React, { useState, useEffect } from 'react'
import Background from '../../components/background'
import Header from '../../components/header'
import Loading from '../../components/loading'
import Footer from '../../components/footer'
import SensorContainer from '../../components/sensorContainer'

export default function Home({ history }) {
    const [selected, setSelected] = useState('')

    if (!localStorage.getItem('urbanVG-token')) {
        history.push('/')
    }

    return (
        <div className="container">
            <Header setItem={setSelected} history={history} />
            <Background />
            <Loading />
            <div className="body-container row-center">
                {selected === 'sensor' && (
                    <SensorContainer />
                )}
            </div>
            <Footer />
        </div>
    )
}