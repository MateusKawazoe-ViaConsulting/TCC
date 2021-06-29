import React, { useState, useEffect } from 'react'
import { MapSVG } from '../../lib/assets/header/icons'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import crop from '../../lib/assets/header/crop.png'
import home from '../../lib/assets/header/home.png'
import sensor from '../../lib/assets/header/sensor.png'

export default function Header({ setItem, item, history }) {
    const [bar, setBar] = useState("0%")
    const [color, setColor] = useState("#c20000")

    function selectItem(selected) {
        setItem(selected)

        switch (selected) {
            case "map":
                setBar("27%")
                setItem('map')
                setColor("#858585")
                break
            case "crop":
                setBar("54.5%")
                setItem('crop')
                setColor("#1e9400")
                break
            case "sensor":
                setBar("82%")
                setItem('sensor')
                setColor("#006eff ")
                break
            default:
                setBar("0%")
                setItem('home')
                setColor("#c20000")
                break;
        }
    }

    useEffect(() => {
        selectItem(item)
    }, [item])

    return (
        <ul className="header-container row-center">
            <li className="middle-container">
                <ul className="bar-navigation row-center">
                    <li className="row-center" onClick={() => selectItem("home")}>
                        <img src={home} alt="home" />
                    </li>
                    <li className="row-center" onClick={() => selectItem("map")} >
                        <MapSVG colors={true} />
                    </li>
                    <li className="row-center" onClick={() => selectItem("crop")} >
                        <img src={crop} alt="crop" />
                    </li>
                    <li className="row-center" onClick={() => selectItem("sensor")}>
                        <img src={sensor} alt="sensor" />
                    </li>
                </ul>
                <span className="slider" style={{ marginLeft: bar, backgroundColor: color }} />
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