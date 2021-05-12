import React from 'react'
import Background from '../../components/background'
import Loading from '../../components/loading'
import './styles.scss'

export default function Home({ history }) {
    if (!localStorage.getItem('urbanVG-token')) {
        history.push('/')
    }

    return (
        <div className="container">
            <Background />
            {/* <Loading /> */}
        </div>
    )
}