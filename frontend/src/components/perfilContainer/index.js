import React, { useEffect, useState } from 'react'
import { Formik, Form } from "formik";
import api from '../../service'
import crop from '../../lib/assets/header/crop.png'
import sensor from '../../lib/assets/header/sensor.png'
import publication from '../../lib/assets/profile/publication.png'
import MyInput from '../../common/input'
import * as Yup from "yup"
import MyButton from '../../common/button'
import picture from '../../lib/assets/profile/picture.png' 
import profileEn from '../../lib/language/en/components/profileContainer.json'

export default function PerfilContainer({ setItem, color, socket }) {
	const [nextLvl, setNextLvl] = useState(0)
	const [xpPercent, setXpPercent] = useState("1%")
	const [address, setAddress] = useState()
	const [variables, setVariables] = useState({
		senhaAtual: {
			value: "",
			error: undefined
		},
		senhaNova: {
			value: "",
			error: undefined
		},
		email: {
			value: "",
			error: undefined
		}
	})

	const profileValidator = Yup.object().shape({
		senhaAtual: Yup.string()
			.required('Senha atual é obrigatório'),
		senhaNova: Yup.string()
			.min(6, 'Nova senha inválida')
			.max(30, 'Nova senha inválida')
			.required('Nova senha é obrigatória'),
		email: Yup.string()
			.min(7, 'E-mail inválido')
			.max(30, 'E-mail inválido')
			.required('E-mail é obrigatório')
			.matches(/^[\w-.]+@([\w-])+\.+[\w-]{2,4}$/, 'E-mail inválido')
	})

	async function getNextLvl() {
		const result = await api.get('user/lvl/next', {
			headers: {
				lvl: localStorage.getItem('urbanVG-user_lvl')
			}
		})

		setXpPercent(
			localStorage.getItem('urbanVG-user_xp') > 0 ?
				parseInt((localStorage.getItem('urbanVG-user_xp') / result.data) * 100) + "%" :
				"1%"
		)
		setNextLvl(parseInt(result.data))
	}

	function loadAddress() {
		const splitedAddress = localStorage.getItem('urbanVG-user_address').split(',')
		setAddress(splitedAddress[splitedAddress.length - 2] + ", " + splitedAddress[splitedAddress.length - 1])
	}

	useEffect(() => {
		document.getElementById('profile-informations').style.background = `linear-gradient(90deg, ${color.primary}, ${color.secondary})`
		document.getElementById('username').style.backgroundColor = color.background
		document.getElementById('profile-line').style.backgroundColor = color.background
		document.getElementById('profile-picture').style.border = `2px solid ${color.background}`
		document.getElementById('xp-bar').style.backgroundColor = color.background
		document.getElementById('save-profile-button').style.backgroundColor = color.secondary
		document.getElementById('xp-bar').style.border = `2px solid ${color.background}`
		document.getElementById('xp-percent').style.backgroundColor = color.percent
	}, [color])

	useEffect(() => {
		getNextLvl()
		loadAddress()
	}, [])

	useEffect(() => {
		if (socket) {
			socket.on("userXpUpdate", req => {
				localStorage.setItem('urbanVG-user_xp', req.xp)
				localStorage.setItem('urbanVG-user_lvl', req.lvl)
				getNextLvl()
			})

			return () => socket.disconnect()
		}
	}, [socket])

	return (
		<div className='perfil-container row-center'>
			<div className="left-container" id="profile-informations">
				<span className="line" id="profile-line" />
				<ul className="profile-information-container column-center">
					<li className="username column-center">
						<span id="username">{localStorage.getItem('urbanVG-user')}</span>
						<span>Level {localStorage.getItem('urbanVG-user_lvl')}</span>
					</li>
					<li className="picture row-center">
						<img id="profile-picture" src={localStorage.getItem('urbanVG-user_foto') ? localStorage.getItem('urbanVG-user_foto') : picture} alt="Foto de perfil" />
					</li>
					<li className="lvl-content column-center">
						<div id="xp-bar" className="row-center">
							<span id="xp-percent" style={{ width: xpPercent }} />
						</div>
						<p>{localStorage.getItem('urbanVG-user_xp')} / {nextLvl}</p>
					</li>
				</ul>
				<ul className="profile-achievements-container column-center">
					<li className="text-medium name-container">
						{localStorage.getItem('urbanVG-user_name')}
						<div>
							<p className="text-small">{address}</p>
						</div>
					</li>
					<li className="achiviments-items row-center">
						<ul className="profile-icon-container row-center">
							<li className="column-center" onClick={() => setItem("home")}>
								<p>{profileEn.profile.publics}</p>
								<img src={publication} alt="publication" className="profile-icon" />
								<p className="text-medium">{localStorage.getItem('urbanVG-user_public')}</p>
							</li>
							<li className="column-center" onClick={() => setItem("crop")}>
								<p>{profileEn.profile.crops}</p>
								<img src={crop} alt="crop" className="profile-icon" />
								<p className="text-medium">{localStorage.getItem('urbanVG-user_crop')}</p>
							</li>
							<li className="column-center" onClick={() => setItem("sensor")}>
								<p>{profileEn.profile.sensors}</p>
								<img src={sensor} alt="sensor" className="profile-icon" />
								<p className="text-medium">{localStorage.getItem('urbanVG-user_sensor')}</p>
							</li>
						</ul>
					</li>
				</ul>
			</div>
			<ul className="right-container" id="user-informations">
				<li className="text-medium name-container row-center">
					{localStorage.getItem('urbanVG-user_name')}
				</li>
				<li className="profile-container">
					<Formik
						initialValues={{
							senhaAtual: '',
							senhaNova: '',
							email: localStorage.getItem('urbanVG-user_email')
						}}
						validationSchema={profileValidator}
					>
						{({ errors, touched, values, setValues, setFieldTouched, handleSubmit }) => (
							<div className="input-container column-center">
								<MyInput
									error={errors.email && touched.email}
									errorLabel={errors.email}
									placeholder={"E-mail"}
									className="text-regular input-profile"
									value={values.email}
									onChange={e => {
										setValues({
											...values,
											email: e.target.value
										})
									}}
									onBlur={() => {
										setFieldTouched('email', true, false)
									}}
								/>
								<MyInput
									id="signup-user"
									error={errors.senhaAtual && touched.senhaAtual}
									errorLabel={errors.senhaAtual}
									placeholder={profileEn.profile.currentPass}
									className="text-regular input-profile"
									value={values.senhaAtual}
									type="password"
									onChange={e => {
										setValues({
											...values,
											senhaAtual: e.target.value
										})
									}}
									onBlur={() => {
										setFieldTouched('senhaAtual', true, false)
									}}
								/>
								<MyInput
									id="signup-user"
									error={errors.senhaNova && touched.senhaNova}
									errorLabel={errors.senhaNova}
									placeholder={profileEn.profile.newPass}
									className="text-regular input-profile"
									value={values.senhaNova}
									type="password"
									onChange={e => {
										setValues({
											...values,
											senhaNova: e.target.value
										})
									}}
									onBlur={() => {
										setFieldTouched('senhaNova', true, false)
									}}
								/>
								<MyButton id="save-profile-button" onClick={handleSubmit}>{profileEn.profile.save}</MyButton>
							</div>
						)}
					</Formik>
				</li>
			</ul>
		</div>
	)
}