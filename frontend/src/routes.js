import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'

// import Login from './pages/login'
import Home from './pages/home'
import Login from './pages/login'

export default function Routes() {
    return (
        <BrowserRouter>
            <Route path="/" exact component={Login} />
            <Route path="/home" component={Home} />
        </BrowserRouter>
    )
}