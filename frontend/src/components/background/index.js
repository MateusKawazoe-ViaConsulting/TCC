import React from 'react'
import Wind from './wind'
import Sun from './sun'
import Moon from './moon'
import { Cloud1, Cloud2, Cloud3 } from './cloud'
import { Star1, Star2, Star3, Star4 } from './star'
import './styles.scss'

export default function Background() {
    return (
        <div className="background-container">
            <div className="moon-sun-container">
                <div className="day-transition">
                    <Sun />
                    <Moon />
                    <Sun />
                    <Moon />
                </div>
            </div>
            <Cloud1 />
            <Cloud2 />
            <Cloud3 />
            <Star1 />
            <Star2 />
            <Star3 />
            <Star4 />
            <div className="wind-container">
                <Wind />
            </div>
        </div>
    )
}