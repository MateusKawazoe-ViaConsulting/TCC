import React from 'react'
import Wind from './wind'
import Sun from './sun'
import Moon from './moon'
import city from '../../lib/assets/city.svg'
import vegetables from '../../lib/assets/vegetables.svg'
import beetroot from '../../lib/assets/beetroot.svg'
import bigradish from '../../lib/assets/bigradish.svg'
import carrot from '../../lib/assets/carrot.svg'
import leek from '../../lib/assets/leek.svg'
import radish from '../../lib/assets/radish.svg'
import { Cloud1, Cloud2, Cloud3 } from './cloud'
import { Star1, Star2, Star3, Star4 } from './star'

export default function Background() {
    return (
        <div className="background-container row-center">
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
            <img className="city" src={city} alt="city" />
            <div className="earth row-center">
                <img className="vegetables" src={beetroot} alt="beetroot" />
                <img className="vegetables" src={radish} alt="radish" />
                <img className="vegetables" src={carrot} alt="carrot" />
                <img className="vegetables" src={bigradish} alt="bigradish" />
                <img className="vegetables" src={leek} alt="leek" />
            </div>
        </div>
    )
}