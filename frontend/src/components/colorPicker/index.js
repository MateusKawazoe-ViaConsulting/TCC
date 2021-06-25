import React from 'react'

export default function ColorPicker({ setColor, error, setError }) {
	const data = [
		{ cor: "#006925", lvl: 0 },
		{ cor: "red", lvl: 0 },
		{ cor: "#00FFFF", lvl: 0 },
		{ cor: "purple", lvl: 5 },
		{ cor: "darkblue", lvl: 15 },
		{ cor: "#FF46A5", lvl: 20 },
		{ cor: "#00FF6D", lvl: 25 },
		{ cor: "#FF7000", lvl: 30 },
		{ cor: "black", lvl: 35 }
	]

	function select(e) {
		if(document.getElementById('color-selected'))
			document.getElementById('color-selected').id = ""
		
		e.currentTarget.id = "color-selected"
	}

	return (
		<div className="color-picker-container column-center">
			<p className="text-regular" style={{ color: error ? "red" : "#888"}}>Cor</p>
			<ul className='color-picker-content row-center'>
				{data.map((element, index) => {
					return (
						<li
							key={"cores: " + index}
							className={"cores"}
							id=""
							style={{ backgroundColor: element.cor }}
							onClick={e => {
								select(e)
								setColor(e.target.style.backgroundColor)
								setError(false)
							}}
						/>
					)
				})}
			</ul>
			{error && (
				<label>* Cor é obrigatória</label>
			)}
		</div>
	)
}