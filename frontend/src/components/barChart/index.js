import React, { useState } from 'react'

export default function BarChart({ color, value, percentage, name }) {
    return (
        <div className='bar-chart-container row-center'>
            <div className="bar">
                <div className="face left-side">
                    <div className="growing-bar" style={{ color: color, height: `${percentage}%` }}>
                        <span className={`row-center ${percentage === 100 ? "maxValue" : ""}`}>{value}</span>
                    </div>
                </div>
                <div className="face right-side">
                    <div className="growing-bar" style={{ color: color, height: `${percentage}%` }}>
                        <span className={`row-center ${percentage === 100 ? "maxValue" : ""}`}>{value}</span>
                    </div>
                </div>
                <div className="face front-side">
                    <div className="growing-bar" style={{ color: color, height: `${percentage}%` }}>
                        <span className={`row-center ${percentage === 100 ? "maxValue" : ""}`}>{value}</span>
                    </div>
                </div>
                <div className="face back-side">
                    <div className="growing-bar" style={{ color: color, height: `${percentage}%` }}>
                        <span className={`row-center ${percentage === 100 ? "maxValue" : ""}`}>{value}</span>
                    </div>
                </div>
                <div className="face roof"></div>
                <div className="face floor"></div>
            </div>
            <div className="shadow" />
            <div className="sensor-values">
                <p>{name}</p>
                <p>{percentage > 0 ? percentage : 0}</p>
            </div>
        </div>
    )
}