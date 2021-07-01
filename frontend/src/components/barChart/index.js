import React, { useState } from 'react'

export default function BarChart({ color, value, percentage, name }) {
    return (
        <>
            <div className='bar-chart-container row-center'>
                <div className="bar">
                    <div className="face left-side">
                        <div className="growing-bar" style={{ backgroundColor: color, height: `${percentage}%` }}>
                            <span className={`row-center ${percentage === 100 ? "maxValue" : ""}`}>{value}</span>
                        </div>
                    </div>
                    <div className="face right-side">
                        <div className="growing-bar" style={{ backgroundColor: color, height: `${percentage}%` }}>
                            <span className={`row-center ${percentage === 100 ? "maxValue" : ""}`}>{value}</span>
                        </div>
                    </div>
                    <div className="face front-side">
                        <div className="growing-bar" style={{ backgroundColor: color, height: `${percentage}%` }}>
                            <span className={`row-center ${percentage === 100 ? "maxValue" : ""}`}>{value}</span>
                        </div>
                    </div>
                    <div className="face back-side">
                        <div className="growing-bar" style={{ backgroundColor: color, height: `${percentage}%` }}>
                            <span className={`row-center ${percentage === 100 ? "maxValue" : ""}`}>{value}</span>
                        </div>
                    </div>
                    <div className="face roof"></div>
                    <div className="face floor"></div>
                </div>
                <div className="shadow" />
            </div>
            <div className="sensor-values row-center"
                onClick={e => {

                }}
            >
                <span className="sensor-value-background" />
                <span className="percentage-value column-center">
                    <p>{percentage > 0 ? percentage : 0}</p>
                </span>
                <p>{name}</p>
            </div>
        </>
    )
}