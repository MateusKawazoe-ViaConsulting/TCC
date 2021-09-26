import React, { useState, useEffect } from 'react'
import { Formik, Form } from "formik";
import MyInput from '../../common/input'
import alerts from '../../functions/alertController'
import ColorPicker from '../colorPicker'
import api from '../../service'
import * as Yup from "yup"
import MySelect from '../../common/select'
import MyButton from '../../common/button'

export default function SensorForm({ setForm, setNewSensor }) {
    const [crops, setCrops] = useState(null)
    const [cor, setCor] = useState(null)
    const [corError, setCorError] = useState(false)
    const [variables, setVariables] = useState({
        nome: {
            value: "",
            error: undefined
        },
        tipo: {
            value: "",
            error: undefined
        },
        descricao: {
            value: "",
            error: undefined
        }
    })

    const sensorValitaion = Yup.object().shape({
        nome: Yup.string()
            .min(2, 'Nome deve ter pelo menos 2 caracteres')
            .max(30, 'Nome deve ter no máximo 30 caracteres')
            .required('Nome é obrigatório')
            .matches(/^[A-Za-z\s]+$/, 'Nome inválido'),
        tipo: Yup.string()
            .min(2, 'Tipo deve ter pelo menos 2 caracteres')
            .max(30, 'Tipo deve ter no máximo 30 caracteres')
            .required('Tipo é obrigatório')
            .matches(/^[A-Za-z\s]+$/, 'Tipo inválido'),
        descricao: Yup.string()
            .min(2, 'Descrição deve ter pelo menos 2 caracteres')
            .max(90, 'Descrição deve ter no máximo 90 caracteres')
            .matches(/^[A-Za-z0-9\s.,-]+$/, 'Descrição inválida')
    })

	async function loadCrops() {
		const data = await api.get('/crop/show/all', { headers: { usuario: localStorage.getItem('urbanVG-user') } })
		if (data.data) {
			const result = data.data.map(element => {
				return { value: element.nome, label: element.nome }
			})
			setCrops(result)
		}
	}

    useEffect(() => {
        loadCrops()
    }, [])

    return (
        <>
            <div className='sensor-form-container row-center'>
                <span className="dark-background" />
                <div className="sensor-form column-center">
                    <form>
                        <h1 className="sensor-title">Cadastrar Sensor</h1>
                        <div className="sensor-form-content row-center">
                            <Formik
                                initialValues={{
                                    nome: '',
                                    tipo: '',
                                    descricao: '',
                                    horta: ''
                                }}
                                validationSchema={sensorValitaion}
                                onSubmit={values => {
                                    if (cor) {
                                        document.getElementsByClassName("loading")[0].style.display = "flex"

                                        setTimeout(async () => {
                                            try {
                                                const result = await api.post('/sensor/store', {
                                                    nome: values.nome,
                                                    tipo: values.tipo,
                                                    descricao: values.descricao,
                                                    dono: localStorage.getItem('urbanVG-user'),
                                                    horta: values.horta,
                                                    cor: cor
                                                })

                                                if (!result.data._id) {
                                                    alerts.showAlert(result.data, 'Error', 'home-alert')
                                                    document.getElementsByClassName("loading")[0].style.display = "none"
                                                    return
                                                }

                                                alerts.showAlert("Sensor registered successfully!", 'Success', 'home-alert')
                                                setForm(false)
                                                setNewSensor(result.data)
                                                document.getElementsByClassName("loading")[0].style.display = "none"
                                            } catch (err) {
                                                document.getElementsByClassName("loading")[0].style.display = "none"
                                                alerts.showAlert('Server connection problem!', 'Error', 'home-alert')
                                            }
                                        }, 1000)
                                    }
                                }}
                            >
                                {({ errors, touched, values, setValues, setFieldTouched, handleSubmit }) => (
                                    <div className="sensor-form-values column-center">
                                        <MyInput
                                            placeholder="Owner"
                                            className="text-regular input-md"
                                            value={localStorage.getItem('urbanVG-user')}
                                            disabled
                                        />
                                        <MySelect
                                            options={crops}
                                            onChange={e => {
                                                setValues({
                                                    ...values,
                                                    horta: e ? e.value : ""
                                                })
                                            }}
                                            placeholder="Crops..."
                                        />
                                        <MyInput
                                            error={errors.nome && touched.nome}
                                            errorLabel={errors.nome}
                                            placeholder="* Name"
                                            className="text-regular input-md"
                                            value={variables.nome.value}
                                            id="sensor-name"
                                            onChange={e => {
                                                setValues({
                                                    ...values,
                                                    nome: e.target.value
                                                })
                                                setVariables({
                                                    ...variables,
                                                    nome: {
                                                        ...variables.nome,
                                                        error: errors.nome,
                                                        value: e.target.value
                                                    }
                                                })
                                            }}
                                            onBlur={() => {
                                                setFieldTouched('nome', true, false)
                                            }}
                                        />
                                        <MyInput
                                            error={errors.tipo && touched.tipo}
                                            errorLabel={errors.tipo}
                                            placeholder="* Type"
                                            className="text-regular input-md"
                                            value={variables.tipo.value}
                                            id="sensor-type"
                                            onChange={e => {
                                                setValues({
                                                    ...values,
                                                    tipo: e.target.value
                                                })
                                                setVariables({
                                                    ...variables,
                                                    tipo: {
                                                        ...variables.tipo,
                                                        error: errors.tipo,
                                                        value: e.target.value
                                                    }
                                                })
                                            }}
                                            onBlur={() => {
                                                setFieldTouched('tipo', true, false)
                                            }}
                                        />
                                        <MyInput
                                            error={errors.descricao && touched.descricao}
                                            errorLabel={errors.descricao}
                                            placeholder="Description"
                                            className="text-regular input-md"
                                            value={variables.descricao.value}
                                            id="sensor-type"
                                            multiline
                                            rowsMax={4}
                                            onChange={e => {
                                                setValues({
                                                    ...values,
                                                    descricao: e.target.value
                                                })
                                                setVariables({
                                                    ...variables,
                                                    descricao: {
                                                        ...variables.descricao,
                                                        error: errors.descricao,
                                                        value: e.target.value
                                                    }
                                                })
                                            }}
                                            onBlur={() => {
                                                setFieldTouched('descricao', true, false)
                                            }}
                                        />
                                        <ColorPicker setColor={setCor} error={corError} setError={setCorError} />
                                        <div className="sensor-buttons row-center">
                                            <MyButton onClick={() => { setForm(false) }}>Cancel</MyButton>
                                            <MyButton onClick={() => {
                                                if (!cor)
                                                    setCorError(true)
                                                else
                                                    setCorError(false)

                                                handleSubmit()
                                            }}>Confirm</MyButton>
                                        </div>
                                    </div>
                                )}
                            </Formik>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}