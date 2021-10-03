import React, { useState, useEffect } from 'react'
import MyInput from '../../common/input'
import { Formik, Form } from "formik";
import * as Yup from "yup";
import alerts from '../../functions/alertController'
import unfocusable from '../../functions/unfocusable'
import cepMask from '../../validation/cepMask'
import findZipCode from '../../service/findZipCode'
import MultiSelect from '../../common/multiSelect'
import MyButton from '../../common/button'
import api from '../../service'

export default function CropForm({ setForm, setNewCrop, newCrop }) {
	const [cep, setCep] = useState({
		rua: undefined,
		cidade: undefined,
		uf: undefined
	})
	const [users, setUsers] = useState(null)
	const [participants, setParticipants] = useState([localStorage.getItem('urbanVG-user')])
	const [variables, setVariables] = useState({
		name: {
			value: '',
			error: undefined
		},
		participants: {
			value: [],
			error: undefined
		},
		street: {
			value: '',
			error: undefined
		},
		number: {
			value: '',
			error: undefined
		},
		city: {
			value: '',
			error: undefined
		},
		uf: {
			value: '',
			error: undefined
		},
		zipCode: {
			value: '',
			error: undefined
		},
		complement: {
			value: ''
		}
	})

	const cropSchema = Yup.object().shape({
		name: Yup.string()
			.min(2, 'Nome inválido')
			.max(30, 'Nome inválido')
			.required('Nome é obrigatório')
			.matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, 'Nome inválido'),
		zipCode: Yup.string()
			.min(8, 'CEP deve ter 8 números')
			.max(9, 'CEP deve ter 8 números')
			.required('CEP é obrigatório')
			.matches(/^\d{0,5}[0-9-]{0,4}$/, 'CEP inválido'),
		city: Yup.string()
			.min(1, 'Cidade inválida')
			.max(58, 'Cidade inválida')
			.required('Cidade é obrigatório')
			.matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, 'Cidade inválida'),
		uf: Yup.string()
			.min(2, 'UF inválido')
			.max(2, 'UF inválido')
			.required('UF é obrigatório')
			.matches(/^[a-zA-Z]+$/, 'UF inválido'),
		street: Yup.string()
			.min(1, 'Rua inválida')
			.max(60, 'Rua inválida')
			.required('Rua é obrigatório')
			.matches(/^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s]+$/, 'Estado inválido'),
		number: Yup.number()
			.required('Nº é obrigatório'),
		complement: Yup.string()
			.matches(/^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s-,]+$/, 'Estado inválido')
	})

	async function loadUsers() {
		const data = await api.get('/user/show/all')

		if (data.data[0]) {
			const result = []
			data.data.forEach(element => {
				if (localStorage.getItem('urbanVG-user') !== element.usuario)
					result.push({ value: element.usuario, label: element.usuario })
			})
			setUsers(result)
		}
	}

	useEffect(() => {
		unfocusable('unfocusable-signup-localization')
		loadUsers()
	}, [])

	return (
		<div className='sensor-form-container row-center'>
			<span className="dark-background" />
			<Formik
				initialValues={{
					zipCode: '',
					city: '',
					uf: '',
					street: '',
					number: '',
					complement: ''
				}}
				validationSchema={cropSchema}
				onSubmit={async (values) => {
					document.getElementsByClassName("loading")[0].style.display = "flex"
					try {
						console.log(participants)
						const result = await api.post('/crop/store', {
							nome: values.name,
							dono: localStorage.getItem('urbanVG-user'),
							participantes: participants,
							endereco: `${values.street}, ${values.number}, ${values.zipCode}, ${values.city}, ${values.uf}`
						})
						if (!result.data.localizacao) {
							console.log(result.data)
							alerts.showAlert(result.data, 'Error', 'home-alert')
						} else {
							setNewCrop(!newCrop)
							setForm(false)
							alerts.showAlert("Crop registered successfully!", 'Success', 'home-alert')
						}
					} catch (error) {
						alerts.showAlert('Server connection problem!', 'Error', 'home-alert')
					}
					document.getElementsByClassName("loading")[0].style.display = "none"
				}}
			>
				{({ errors, touched, values, setValues, setFieldTouched, handleSubmit }) => (
					<div className="crop-form-container form-content" id="right-user-form">
						<Form className="crop-information">
							<h1>Cadastrar Horta</h1>
							<div className="input-container column-center">
								<div className="input-container column-center">
									<MyInput
										error={errors.name && touched.name}
										errorLabel={errors.name}
										placeholder="Name"
										className="text-regular crop-input"
										value={values.name}
										onChange={e => {
											setValues({
												...values,
												name: e.target.value
											})
										}}
										onBlur={() => {
											setVariables({
												...variables,
												name: {
													...variables.name,
													error: errors.name,
													value: values.name
												}
											})
											setFieldTouched('name', true, false)
										}}
									/>
								</div>
								<div className="input-container column-center">
									<MultiSelect
										users={users}
										setParticipants={setParticipants}
										participants={participants}
										setUsers={setUsers}
									/>
								</div>
								{participants[0] && (
									<div className="participants-list">

									</div>
								)}
								<MyInput
									error={errors.zipCode && touched.zipCode}
									errorLabel={errors.zipCode}
									placeholder="Zip Code"
									className="text-regular crop-input"
									value={values.zipCode}
									style={{
										marginBottom: '10px'
									}}
									onChange={e => {
										if (/^\d{0,5}[0-9-]{0,4}$/.test(e.target.value)) {
											setValues({
												...values,
												zipCode: cepMask(e.target.value)
											})
										} else {
											setValues({
												...values
											})
										}
									}}
									onBlur={async () => {
										setFieldTouched('zipCode', true, false)
										document.getElementsByClassName("loading")[0].style.display = "flex"
										const result = await findZipCode(values.zipCode)
										document.getElementsByClassName("loading")[0].style.display = "none"

										if (result === undefined || result.erro) {
											setVariables({
												...variables,
												zipCode: {
													...variables.zipCode,
													error: 'CEP não existe!'
												}
											})
											return
										}

										setCep({
											...cep,
											cidade: result.localidade,
											uf: result.uf,
											rua: result.logradouro
										})

										setVariables({
											...variables,
											zipCode: {
												...variables.zipCode,
												error: errors.zipCode,
												value: values.zipCode
											},
											uf: {
												...variables.uf,
												value: result.uf
											},
											city: {
												...variables.city,
												value: result.localidade
											},
											street: {
												...variables.street,
												value: result.logradouro
											}
										})

										setValues({
											...values,
											cep: result.cep,
											uf: result.uf,
											city: result.localidade,
											street: result.logradouro
										})

										document.getElementById('signup-city-label').classList.add('MuiFormLabel-filled')
										document.getElementById('signup-city-label').style.backgroundColor = '#fff'
										document.getElementById('signup-uf-label').classList.add('MuiFormLabel-filled')
										document.getElementById('signup-uf-label').style.backgroundColor = '#fff'
										document.getElementById('signup-city-label').classList.add('MuiInputLabel-shrink')
										document.getElementById('signup-uf-label').classList.add('MuiInputLabel-shrink')

										if (result.logradouro) {
											document.getElementById('signup-street-label').classList.add('MuiFormLabel-filled')
											document.getElementById('signup-street-label').classList.add('MuiInputLabel-shrink')
											document.getElementById('signup-street-label').style.backgroundColor = '#fff'
											document.getElementById('signup-number').focus()
										} else {
											document.getElementById('signup-street').focus()
										}
									}}
								/>
							</div>
							<div className="side-input">
								<div className="input-container column-center">
									<MyInput
										error={errors.city && touched.city}
										errorLabel={errors.city}
										placeholder="City"
										className="text-regular input-sm"
										value={values.city || cep.cidade}
										disabled={cep.cidade !== undefined}
										id="signup-city"
										onChange={e => {
											setValues({
												...values,
												city: e.target.value
											})
										}}
										onBlur={() => {
											setVariables({
												...variables,
												city: {
													...variables.city,
													error: errors.city,
													value: values.city
												}
											})
											setFieldTouched('city', true, false)
										}}
									/>
								</div>
								<div className="input-container column-center">
									<MyInput
										error={errors.uf && touched.uf}
										errorLabel={errors.uf}
										placeholder="State"
										className="text-regular input-sm"
										value={values.uf || cep.uf}
										disabled={cep.uf !== undefined}
										id="signup-uf"
										onChange={e => {
											setValues({
												...values,
												uf: e.target.value
											})
										}}
										onBlur={() => {
											setVariables({
												...variables,
												uf: {
													...variables.uf,
													error: errors.uf,
													value: values.uf
												}
											})
											setFieldTouched('uf', true, false)
										}}
									/>
								</div>
							</div>
							<div className="side-input">
								<div className="input-container column-center">
									<MyInput
										error={errors.street && touched.street}
										errorLabel={errors.street}
										placeholder="Street"
										className="text-regular input-sm"
										value={values.street || cep.rua}
										id="signup-street"
										onChange={e => {
											setValues({
												...values,
												street: e.target.value
											})
										}}
										onBlur={() => {
											setVariables({
												...variables,
												street: {
													...variables.street,
													error: errors.street,
													value: values.street
												}
											})
											setFieldTouched('street', true, false)
										}}
									/>
								</div>
								<div className="input-container column-center number">
									<MyInput
										error={errors.number && touched.number}
										errorLabel={errors.number}
										placeholder="Nº"
										className="text-regular input-sm"
										value={values.number}
										id="signup-number"
										onChange={e => {
											if (/^\d{0,6}$/g.test(e.target.value))
												setValues({
													...values,
													number: e.target.value
												})
										}}
										onBlur={() => {
											setVariables({
												...variables,
												number: {
													...variables.number,
													error: errors.number,
													value: values.number
												}
											})
											setFieldTouched('number', true, false)
										}}
									/>
								</div>
							</div>
							<div className="input-container column-center">
								<MyInput
									id="unfocusable-signup-localization"
									error={errors.complement && touched.complement}
									errorLabel={errors.complement}
									placeholder="Complement"
									className="text-regular crop-input"
									value={values.complement}
									onChange={e => {
										setValues({
											...values,
											complement: e.target.value
										})
									}}
									onBlur={() => {
										setVariables({
											...variables,
											complement: {
												...variables.complement,
												error: errors.complement,
												value: values.complement
											}
										})
										setFieldTouched('complement', true, false)
									}}
								/>
							</div>
							<div className="sensor-buttons row-center">
								<MyButton onClick={() => { setForm(false) }}>Cancel</MyButton>
								<MyButton onClick={() => handleSubmit(values)}>Confirm</MyButton>
							</div>
						</Form>
					</div>
				)}
			</Formik>
		</div>
	)
}