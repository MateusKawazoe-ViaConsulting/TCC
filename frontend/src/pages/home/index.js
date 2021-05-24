import React from 'react'
import Background from '../../components/background'
import Header from '../../components/header'
import Loading from '../../components/loading'

export default function Home({ history }) {
    if (!localStorage.getItem('urbanVG-token')) {
        history.push('/')
    }

    return (
        <div className="container">
            <Header history={history} />
            <Background />
            <Loading />
        </div>
    )
}