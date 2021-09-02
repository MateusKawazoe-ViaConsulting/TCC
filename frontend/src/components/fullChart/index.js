import React, { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import MyLineChart from '../myLineChart'

export default function FullChart({ setDisplay, fullData }) {
	const [data, setData] = useState([])
	const [initialDate, setInitialDate] = useState(new Date())
	const [years, setYears] = useState([])
	const months = [
		"Janeiro",
		"Fevereiro",
		"Março",
		"Abril",
		"Maio",
		"Junho",
		"Julho",
		"Agosto",
		"Setembro",
		"Outubro",
		"Novembro",
		"Dezembro",
	];

	function loucurinha() {
		if (fullData && fullData.feed[0]) {
			fullData.feed.map((element, index) => {
				if (index < 200) {
					setData(prev => [
						...prev,
						{
							name: `${(new Date(element.data).getDate()) > 9 ? (new Date(element.data).getDate()) : "0" + (new Date(element.data).getDate())}/${(new Date(element.data).getMonth() + 1) > 9 ? (new Date(element.data).getMonth()) : "0" + (new Date(element.data).getMonth() + 1)}`,
							valor: element.valor
						}
					])
				} 
			})
		}
	}

	useEffect(() => {
		loucurinha()
		console.log(years)
	}, [])

	return (
		<div
			className='full-chart-container row-center'
		>
			<span className="dark-background" onClick={() => setDisplay(false)} />
			<div className="full-chart-content column-center">
				{fullData && data && (
					<MyLineChart data={data} color={fullData.cor} className="chart-config" keyName={"valor"} width={1000} height={500} tooltip />
				)}
				<div className="tools row-center">
					<DatePicker className="initial-date"
						renderCustomHeader={({
							date,
							changeYear,
							changeMonth,
							decreaseMonth,
							increaseMonth,
							prevMonthButtonDisabled,
							nextMonthButtonDisabled,
						}) => (
							<div
								style={{
									margin: 10,
									display: "flex",
									justifyContent: "center",
								}}
							>
								<button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
									{"<"}
								</button>
								<select
									value={date.getFullYear()}
									onChange={({ target: { value } }) => changeYear(value)}
								>
									{years.map((option, index) => (
										<option key={index} value={option}>
											{option}
										</option>
									))}
								</select>

								<select
									value={months[date.getMonth()]}
									onChange={({ target: { value } }) =>
										changeMonth(months.indexOf(value))
									}
								>
									{months.map((option, index) => (
										<option key={index} value={option}>
											{option}
										</option>
									))}
								</select>

								<button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
									{">"}
								</button>
							</div>
						)}
						selected={initialDate}
						onChange={(date) => setInitialDate(date)}
						isClearable
						placeholderText="Data inicial"
						minDate={fullData && fullData.feed[0] ? new Date(fullData.feed[0].data) : new Date()}
					/>
				</div>
			</div>
		</div>
	)
}