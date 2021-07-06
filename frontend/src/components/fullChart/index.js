import React, { useState } from 'react'
import MyLineChart from '../myLineChart'

export default function FullChart({ setDisplay, fullData, display }) {
	return (
		<div
			className='full-chart-container row-center'
			style={{
				display: display
			}}
		>
			<span className="dark-background" onClick={() => setDisplay(false)} />
			<div className="full-chart-content">

			</div>
		</div>
	)
}