import React, { useState, useEffect } from 'react'
import { Formik, Form } from "formik";
import MyInput from '../../common/input'
import alerts from '../../functions/alertController'
import ColorPicker from '../colorPicker'
import api from '../../service'
import * as Yup from "yup";
import MySelect from '../../common/select';
import MyButton from '../../common/button'

export default function ImportSensorForm({ setImportForm, setNewSensor }) {
	const [crops, setCrops] = useState(null)
	const [cor, setCor] = useState(null)
	const [corError, setCorError] = useState(false)
	const [id, setId] = useState({
		value: "",
		error: undefined
	})

	const sensorValitaion = Yup.object().shape({
		id: Yup.string()
			.required('ID é obrigatório')
			.matches(/^[0-9]+$/, 'ID inválido')
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
		console.log(crops)
	}, [])

	return (
		<>
			<div className='sensor-form-container row-center'>
				<span className="dark-background" />
				<div className="sensor-form column-center">
					<form>
						<h1 className="sensor-title">Importar Sensor</h1>
						<div className="sensor-form-content row-center">
							<Formik
								initialValues={{
									id: '',
									horta: ''
								}}
								validationSchema={sensorValitaion}
								onSubmit={values => {
									if (cor) {
										document.getElementsByClassName("loading")[0].style.display = "flex"

										setTimeout(async () => {
											try {
												const result = await api.post('/sensor/importData', {
													dono: localStorage.getItem('urbanVG-user'),
													horta: values.horta,
													id: values.id,
													cor: cor
												})

												if (!result.data._id) {
													alerts.showAlert(result.data, 'Error', 'home-alert')
													document.getElementsByClassName("loading")[0].style.display = "none"
													return
												}

												alerts.showAlert("Sensor importado com sucesso!", 'Success', 'home-alert')
												setImportForm(false)
												setNewSensor(result.data)
												document.getElementsByClassName("loading")[0].style.display = "none"
											} catch (err) {
												document.getElementsByClassName("loading")[0].style.display = "none"
												alerts.showAlert('Problema na conexão com o servidor!', 'Error', 'home-alert')
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
											error={errors.id && touched.id}
											errorLabel={errors.id}
											placeholder="* ThingSpeak's ID"
											className="text-regular input-md"
											value={id.value}
											id="sensor-name"
											onChange={e => {
												setValues({
													...values,
													id: e.target.value
												})
												setId({
													...id,
													error: errors.id,
													value: e.target.value
												})
											}}
											onBlur={() => {
												setFieldTouched('nome', true, false)
											}}
										/>
										<ColorPicker setColor={setCor} error={corError} setError={setCorError} />
										<div className="sensor-buttons row-center">
											<MyButton onClick={() => { setImportForm(false) }}>Cancel</MyButton>
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