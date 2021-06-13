import React from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts'

export default function MyLineChart({ data, color, keyName }) {
  return (
    <div className='line-chart-container'>
      <LineChart width={350} height={320} data={data}>
        <Line type="monotone" dataKey={keyName} stroke={color} />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
      </LineChart>
    </div>
  )
}