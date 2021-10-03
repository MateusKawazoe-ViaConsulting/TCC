import React from 'react'
import MySelect from '../select/index'

export default function MultiSelect({ users, setParticipants, participants, setUsers }) {
	return (
		<div className='multi-select-container'>
			<p className="text-md">Participants</p>
			<MySelect
				className="crop-input"
				options={users}
				onChange={e => {
					if (e) {
						setParticipants(prevState => [...prevState, e.value])
						setUsers(users.filter(element => element.value !== e.value))
					}
				}}
				value="Users..."
			/>
			{participants[0] && (
				<ul className="participants-list">
					{participants.map((element, index) =>
						<li className="participant row-center" key={`participant ${index}`}>
							<p className="text-tiny">{element}</p>
							<span className="remove-participant"
								onClick={(e) => {
									if (e && e.target && e.target.parentNode) {
										setUsers(prevState => [...prevState, {
											value: e.target.parentNode.childNodes[0].textContent,
											label: e.target.parentNode.childNodes[0].textContent
										}])
										setParticipants(participants.filter(item => item !== e.target.parentNode.childNodes[0].textContent))
									}
								}}
							>x</span>
						</li>
					)}
				</ul>
			)
			}
		</div >
	)
}