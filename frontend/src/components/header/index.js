import React, { useState } from 'react'
import logo from '../../lib/assets/logo.svg'
import HomeIcon from '@material-ui/icons/Home'
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined'
import MapOutlinedIcon from '@material-ui/icons/MapOutlined'
import MapIcon from '@material-ui/icons/Map'
import LocalFloristIcon from '@material-ui/icons/LocalFlorist'
import LocalFloristOutlinedIcon from '@material-ui/icons/LocalFloristOutlined'
import { MapSVG } from '../../lib/assets/header/icons'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import SettingsRemoteOutlinedIcon from '@material-ui/icons/SettingsRemoteOutlined';
import crop from '../../lib/assets/header/crop.png'
import home from '../../lib/assets/header/home.png'
import sensor from '../../lib/assets/header/sensor.png'

export default function Header({ setItem, history }) {
    const [selected, setSelected] = useState({
        home: true,
        map: false,
        crop: false,
        sensor: false
    })
    const [bar, setBar] = useState("0%")

    return (
        <ul className="header-container row-center">
            <li className="left-container">
                Bem vindo <span>{localStorage.getItem('urbanVG-user')}</span>
            </li>
            <li className="middle-container">
                <ul className="bar-navigation row-center">
                    <li className="row-center" onClick={() => {
                        setBar("0%")
                        setSelected({
                            home: true
                        })
                        setItem('home')
                    }}>
                        <img src={home} alt="home"/>
                    </li>
                    <li className="row-center" onClick={() => {
                        setBar("27%")
                        setSelected({
                            map: true
                        })
                        setItem('map')
                    }} >
                        <MapSVG colors={true} />
                    </li>
                    <li className="row-center" onClick={() => {
                        setBar("54.5%")
                        setSelected({
                            crop: true
                        })
                        setItem('crop')
                    }} >
                        <img src={crop} alt="crop" />
                    </li>
                    <li className="row-center" onClick={() => {
                        setBar("82%")
                        setSelected({
                            sensor: true
                        })
                        setItem('sensor')
                    }}>
                        <img src={sensor} alt="sensor" />
                    </li>
                </ul>
                <span className="slider" style={{ marginLeft: bar }} />
            </li>
            <li className="right-container row-center">
                <button
                    className="exit-container row-center"
                    onClick={() => {
                        localStorage.setItem('urbanVG-token', '')
                        localStorage.setItem('urbanVG-user', '')
                        history.push('/')
                    }}
                >
                    <ExitToAppIcon className="exit" />
                    <h1 className="text-medium">Sair</h1>
                </button>
            </li>
        </ul>
    )
}