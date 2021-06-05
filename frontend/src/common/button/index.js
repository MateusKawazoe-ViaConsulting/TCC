import React from 'react'
import Button from '@material-ui/core/Button'


export default function MyButton({ className, onClick, ...props }) {
    return (
        <Button
            className={"my-button " + className}
            onClick={e => {
                e.preventDefault()
                if(onClick)
                    onClick()
            }}
            {...props}
        />
    )
}