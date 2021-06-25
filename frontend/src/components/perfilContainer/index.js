import React, { useEffect, useState } from 'react'
import api from '../../service'

export default function PerfilContainer() {
	const [nextLvl, setNextLvl] = useState(0)
	const [xpPercent, setXpPercent] = useState("1%")

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

	useEffect(() => {
		getNextLvl();
		document.getElementById('profile-informations').addEventListener('mouseover', (e) => {
			document.getElementById('user-informations').style.width = "0%"
		})

		document.getElementById('profile-informations').addEventListener('mouseleave', () => {
			document.getElementById('user-informations').style.width = "60%"
		})
	}, [])

	return (
		<div className='perfil-container row-center'>
			<div className="left-container" id="profile-informations">
				<span className="line" />
				<ul className="profile-information-container column-center">
					<li className="username column-center">
						<span>{localStorage.getItem('urbanVG-user')}</span>
						<span>Level {localStorage.getItem('urbanVG-user_lvl')}</span>
					</li>
					<li className="picture row-center">
						<img src={localStorage.getItem('urbanVG-user_foto')} alt="Foto de perfil" />
					</li>
					<li className="lvl-content column-center">
						<div>
							<span style={{ width: xpPercent }} />
						</div>
						<p>{localStorage.getItem('urbanVG-user_xp')} / {nextLvl}</p>
					</li>
				</ul>
			</div>
			<ul className="right-container" id="user-informations">
			</ul>
		</div>
	)
}