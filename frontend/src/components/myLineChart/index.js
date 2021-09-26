import React from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts'

export default function MyLineChart({ data, color, keyName, className, setDisplay, clicable, width, height, tooltip }) {
  return (
    <div className='line-chart-container' onClick={() => {
      if (clicable)
        setDisplay(true)
    }}>
      {clicable && (
        <span className="expand-chart row-center">
          <h1>View detail</h1>
        </span>
      )}

      <LineChart width={width} height={height} data={data} className={className}>
        <Line type="monotone" dataKey={keyName} stroke={color} />
        <XAxis dataKey="name" />
        <YAxis />
        {tooltip && (
          <Tooltip />
        )}
      </LineChart>
    </div>
  )
}