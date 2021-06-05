import React, { useState } from 'react'
import { SketchPicker } from 'react-color'

export default function ColorPicker() {
    const [color, setColor] = useState('#fff')

    return (
        <div className='color-picker-container'>
            <SketchPicker
                color={color}
                onChangeComplete={e => {
                    setColor(e.hex)
                }}
            />
        </div>
    )
}