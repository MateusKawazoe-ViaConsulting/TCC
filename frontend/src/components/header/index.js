import React, { useState } from 'react'
import logo from '../../lib/assets/logo.svg'
import HomeIcon from '@material-ui/icons/Home'
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined'
import MapOutlinedIcon from '@material-ui/icons/MapOutlined'
import MapIcon from '@material-ui/icons/Map'
import LocalFloristIcon from '@material-ui/icons/LocalFlorist'
import LocalFloristOutlinedIcon from '@material-ui/icons/LocalFloristOutlined'
import PersonOutlineIcon from '@material-ui/icons/PersonOutline'
import PersonIcon from '@material-ui/icons/Person'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'


export default function Header({ history }) {
    const [selected, setSelected] = useState({
        home: true,
        map: false,
        crop: false,
        profile: false
    })
    const [bar, setBar] = useState("0%")

    return (
        <ul className="header-container row-center">
            <li className="left-container">
                {/* <img src={logo} alt="logo" /> */}
            </li>
            <li className="middle-container">
                <ul className="bar-navigation row-center">
                    {selected.home ? (
                        <HomeIcon className="home selected" />
                    ) :
                        <HomeOutlinedIcon className="home" onClick={() => {
                            setBar("0%")
                            setSelected({
                                home: true
                            })
                        }} />
                    }

                    {selected.map ? (
                        <MapIcon className="map selected" />
                    ) :
                        <MapOutlinedIcon className="map" onClick={() => {
                            setBar("27%")
                            setSelected({
                                map: true
                            })
                        }} />
                    }

                    {selected.crop ? (
                        <LocalFloristIcon className="crop selected" />
                    ) :
                        <LocalFloristOutlinedIcon className="crop" onClick={() => {
                            setBar("55%")
                            setSelected({
                                crop: true
                            })
                        }} />
                    }
                    {selected.profile ? (
                        <PersonIcon className="profile selected" />
                    ) :
                        <PersonOutlineIcon className="profile" onClick={() => {
                            setBar("82%")
                            setSelected({
                                profile: true
                            })
                        }} />
                    }
                </ul>
                <span className="slider" style={{ marginLeft: bar }} />
            </li>
            <li className="right-container row-center">
                <button
                    className="exit-container row-center"
                    onClick={() => {
                        localStorage.setItem('urbanVG-token', '')
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