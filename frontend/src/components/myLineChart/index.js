import React from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts'

export default function MyLineChart({ data, color, keyName, className, setDisplay }) {
  return (
    <div className='line-chart-container' onClick={() => setDisplay(true)}>
      <span className="expand-chart row-center">
        <h1>Ver detalhes</h1>
      </span>
      <LineChart width={350} height={320} data={data} className={className}>
        <Line type="monotone" dataKey={keyName} stroke={color} />
        <XAxis dataKey="name" />
        <YAxis />
      </LineChart>
    </div>
  )
}