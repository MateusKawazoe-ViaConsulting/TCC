import React, { useState, useEffect } from 'react'
import Background from '../../components/background'
import Header from '../../components/header'
import Loading from '../../components/loading'
import Footer from '../../components/footer'
import SensorContainer from '../../components/sensorContainer'
import Alert from '@material-ui/lab/Alert'
import SensorForm from '../../components/sensorForm'
import alertController from '../../functions/alertController'
import ImportSensorForm from '../../components/importSensorForm'
import PerfilContainer from '../../components/perfilContainer'

export default function Home({ history }) {
    const [selected, setSelected] = useState('')
    const [newSensor, setNewSensor] = useState(null)
    const [form, setForm] = useState(false)
    const [importForm, setImportForm] = useState(false)

    if (!localStorage.getItem('urbanVG-token')) {
        history.push('/')
    }

    return (
        <div className="container">
            {form && (
                <SensorForm setForm={setForm} setNewSensor={setNewSensor} />
            )}
            {importForm && (
                <ImportSensorForm setImportForm={setImportForm} setNewSensor={setNewSensor} />
            )}
            <Header setItem={setSelected} history={history} />
            <Background />
            <Loading />
            <PerfilContainer />
            <div className="body-container row-center">
                {selected === 'sensor' && (
                    <SensorContainer setForm={setForm} setImportForm={setImportForm} newSensor={newSensor} />
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