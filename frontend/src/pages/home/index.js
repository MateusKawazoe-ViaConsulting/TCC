import React, { useState, useEffect } from 'react'
import Background from '../../components/background'
import Header from '../../components/header'
import Loading from '../../components/loading'
import Footer from '../../components/footer'
import SensorContainer from '../../components/sensorContainer'
import CropContainer from '../../components/cropContainer'
import MapContainer from '../../components/mapContainer'
import Alert from '@material-ui/lab/Alert'
import SensorForm from '../../components/sensorForm'
import CropForm from '../../components/cropForm'
import socketIOClient from "socket.io-client"
import alertController from '../../functions/alertController'
import ImportSensorForm from '../../components/importSensorForm'
import PerfilContainer from '../../components/perfilContainer'
import FullChart from '../../components/fullChart'

export default function Home({ history }) {
    const [selected, setSelected] = useState('sensor')
    const [newSensor, setNewSensor] = useState(null)
    const [form, setForm] = useState(false)
    const [importForm, setImportForm] = useState(false)
    const [fullChart, setFullChart] = useState(false)
    const [fullData, setFullData] = useState(null)
    const [socket, setSocket] = useState(null)
    const [cropForm, setCropForm] = useState(null)
    const [publicForm, setPublicForm] = useState(null)
    const [color, setColor] = useState({
        primary: '#5590ff',
        secondary: '#1dbfff',
        background: '#0051e6',
        percent: '#689dff'
    })

    if (!localStorage.getItem('urbanVG-token')) {
        history.push('/')
    }

    useEffect(() => {
        const result = socketIOClient("http://127.0.0.1:3333", {
            query: {
                user: localStorage.getItem("urbanVG-user")
            }
        })

        setSocket(result)

        switch (selected) {
            case 'sensor':
                setColor({
                    ...color,
                    primary: '#5590ff',
                    secondary: '#1dbfff',
                    background: '#0051e6',
                    percent: '#689dff'
                })
                break
            case 'crop':
                setColor({
                    ...color,
                    primary: '#1e9700',
                    secondary: '#26bd00',
                    background: 'rgb(25, 124, 0)',
                    percent: 'rgb(65, 187, 35)'
                })
                break
            case 'map':
                setColor({
                    ...color,
                    primary: 'grey',
                    secondary: 'rgb(192, 191, 191',
                    background: 'rgb(134, 134, 134)',
                    percent: 'rgb(201, 201, 201'
                })
                break
            case 'home':
                setColor({
                    ...color,
                    primary: 'rgb(161, 2, 2)',
                    secondary: 'red',
                    background: 'darkred',
                    percent: 'rgb(199, 0, 0)'
                })
                break
            default:
                break
        }
    }, [selected])

    return (
        <div className="container">
            {fullChart && fullData && (
                <FullChart
                    setDisplay={setFullChart}
                    fullData={fullData}
                />
            )}
            {form && (
                <SensorForm setForm={setForm} setNewSensor={setNewSensor} />
            )}
            {importForm && (
                <ImportSensorForm setImportForm={setImportForm} setNewSensor={setNewSensor} />
            )}
            {cropForm && (
                <CropForm setForm={setCropForm}/>
            )}
            <Header setItem={setSelected} item={selected} history={history} />
            <Background />
            <Loading />
            <PerfilContainer setItem={setSelected} color={color} socket={socket} />
            <div className="body-container row-center">
                {selected === 'sensor' && (
                    <SensorContainer
                        setForm={setForm}
                        setImportForm={setImportForm}
                        newSensor={newSensor}
                        setFullData={setFullData}
                        setFullChart={setFullChart}
                        setNewSensor={setNewSensor}
                        socket={socket}
                    />
                )}
                {selected === 'crop' && (
                    <CropContainer
                        setForm={setCropForm}
                    />
                )}
                {selected === 'map' && (
                    <MapContainer
                    />
                )}
            </div>
            <Alert onClose={() => {
                alertController.closeAlert('home-alert')
            }} variant="filled" id="home-alert">
                <p />
            </Alert>
            <Footer />
        </div>
    )
}
