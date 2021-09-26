import React, { useState, useEffect } from 'react'
import MyButton from '../../common/button'
import MyInput from '../../common/input'
import api from '../../service/index'

export default function CropContainer({ setForm }) {
	const [data, setData] = useState(null)
	const [allCrops, setAllCrops] = useState(null)
	const [nextLvl, setNextLvl] = useState(null)
	const [localization, setLocalization] = useState({
		street: '',
		number: '',
		state: '',
		district: '',
		city: ''
	})
	const [currentCrop, setCurrentCrop] = useState({
		name: '',
		owner: '',
		followers: [],
		sensors: [],
		publications: [],
		participants: [],
		nivel: {}
	})

	async function dataGen(index) {
		try {
			var result = await api.get('/crop/show/all', {
				headers: {
					usuario: localStorage.getItem('urbanVG-user')
				}
			})
			setData(result.data)
			setCrop(result.data[index], null)
			result = await api.get('/crop/show/all')
			setAllCrops(result.data)
		} catch (error) {

		}
	}

	async function getNextLvlXp(lvl) {
		const result = await api.get('/user/lvl/next', {
			headers: {
				lvl: lvl
			}
		})
		setNextLvl(result.data)
	}

	function selectedCrop(clicked) {
		if (clicked.currentTarget) {
			if (document.getElementsByClassName('active')[0])
				document.getElementsByClassName('active')[0].classList.remove('active')

			clicked.currentTarget.classList.add('active')
		}
	}

	function setCrop(cropData, clicked) {
		const result = cropData.localizacao.endereco.split(',')

		setLocalization({
			...localization,
			street: result[0],
			number: result[1],
			state: result[5],
			district: result[3],
			city: result[4]
		})

		setCurrentCrop({
			...currentCrop,
			name: cropData.nome,
			owner: cropData.dono,
			followers: cropData.seguidores,
			sensors: cropData.sensores,
			publications: cropData.publicacoes,
			participants: cropData.participantes,
			nivel: cropData.nivel
		})

		if (clicked)
			selectedCrop(clicked)
		else
			document.getElementById('owner-0').classList.add('active')
	}

	useEffect(() => {
		dataGen(0)
	}, [])

	return (
		<div className="column-center crop-container">
			<div className="left-container">
				<label>Publicações</label>
				<div className="splited-container row-center">
					<div className="publicacoes-list">

					</div>
				</div>
			</div>
			<div className='crop-content row-center' style={data ? {
				alignItems: 'baseline'
			} : {}}>
				{data ? (
					<>
						<form className="crop-information column-center">
							<h1>
								{currentCrop.name}
							</h1>
							<p className="owner">
								{currentCrop.owner}
							</p>
							<div className="localization-container">
								<label>
									Localização
								</label>
								<div className="splited-container">
									<MyInput
										className="text-regular street-number"
										value={localization.street}
										disabled
									/>
									<MyInput
										className="text-regular street-number"
										value={localization.number}
										disabled
									/>
								</div>
								<div className="splited-container">
									<MyInput
										className="text-regular city-country-district"
										value={localization.district}
										disabled
									/>
									<MyInput
										className="text-regular city-country-district"
										value={localization.city}
										disabled
									/>
									<MyInput
										className="text-regular city-country-district"
										value={localization.state}
										disabled
									/>
								</div>
							</div>
							<ul className="bottom-container row-center">
								<li className="participants">
									<label>
										Pariticipantes
									</label>
									<div className="list">
										{currentCrop.participants && currentCrop.participants.map(element => (
											<p className="row-center">{element}</p>
										))}
									</div>
								</li>
								<li className="followers">
									<label>
										Seguidores
									</label>
									<div className="list">
										{currentCrop.followers && currentCrop.followers.map(element => (
											<p className="row-center">{element}</p>
										))}
									</div>
								</li>
								<li className="publications">
									<label>
										Sensores
									</label>
									<div className="list">
										{currentCrop.sensors && currentCrop.sensors.map(element => (
											<p className="row-center">{element.nome}</p>
										))}
									</div>
								</li>
							</ul>
						</form>
						<div className="buttons-container">

						</div>
					</>
				) : (
					<p>
						{`Nenhuma horta cadastrada :(`}
					</p>
				)}
			</div>
			<div className="button-container">
				<MyButton
					style={{
						backgroundColor: "#42b72a"
					}}
					onClick={() => { }}
				>
					Cadastre uma horta
				</MyButton>
				{data && data[0] && (
					<MyButton
						style={{
							backgroundColor: "#42b72a"
						}}
						onClick={() => {
							setForm(true)
						 }}
					>
						Criar uma publicação
					</MyButton>
				)}
			</div>
			<div className="right-container column-center">
				<div className="owner-crops">
					<label>Suas Hortas</label>
					{data && data[0] ? (
						<>
							<input type="text" className="text-small search-bar" placeholder="Buscar horta..." />
							<div className="crop-list">
								{data.map((element, index) => {
									getNextLvlXp(element.nivel.lvl)

									return (
										<ul
											className="crop-card"
											id={"owner-" + index}
											onClick={(e) => {
												if (allCrops)
													setCrop(allCrops[index], e)
											}}
										>
											<li className="nome">Nome: {element.nome}</li>
											<li className="lvl">Nível: {element.nivel.lvl}</li>
											<li className="xp">xp: {element.nivel.xp} / {nextLvl}</li>
										</ul>
									)
								})}
							</div>
						</>
					) : (
						<p>{`Você não tem nenhuma horta cadastrada :(`}</p>
					)}
				</div>
				<div className="all-crops">
					<label>Todas as Hortas</label>
					{allCrops && allCrops[0] ? (
						<>
							<input type="text" className="text-small search-bar" placeholder="Buscar horta..." />
							<div className="crop-list">
								{allCrops.map((element, index) => {
									getNextLvlXp(element.nivel.lvl)

									return (
										<ul
											className="crop-card"
											id={"all-" + index}
											onClick={(e) => {
												if (allCrops)
													setCrop(allCrops[index], e)
											}}
										>
											<li className="nome">Nome: {element.nome}</li>
											<li className="dono">Dono: {element.dono}</li>
											<li className="lvl">Nível: {element.nivel.lvl}</li>
											<li className="xp">xp: {element.nivel.xp} / {nextLvl}</li>
										</ul>
									)
								})}
							</div>
						</>
					) : (
						<p>{`Você não tem nenhuma horta cadastrada :(`}</p>
					)}
				</div>
			</div>
		</div>
	)
}