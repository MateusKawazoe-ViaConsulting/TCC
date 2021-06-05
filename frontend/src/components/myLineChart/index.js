import React from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts'

export default function MyLineChart({ data, colors }) {
  return (
    <div className='line-chart-container'>
      <LineChart width={400} height={400} data={data}>
        <Line type="monotone" dataKey="uv" stroke={colors[0]} />
        <Line type="monotone" dataKey="pv" stroke={colors[1]} />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
      </LineChart>
    </div>
  )
}