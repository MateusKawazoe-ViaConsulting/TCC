import React from 'react'
import Button from '@material-ui/core/Button'
import './styles.scss'

export default function MyInput({ className, onClick, ...props }) {
    return (
        <Button
            className={"login-button " + className}
            onClick={e => {
                e.preventDefault()
                if(onClick)
                    onClick()
            }}
            {...props}
        />
    )
}