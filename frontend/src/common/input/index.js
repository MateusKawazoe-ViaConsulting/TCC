import React from 'react'
import TextField from '@material-ui/core/TextField';

export default function MyInput({ placeholder, error, errorLabel, type = 'text', ...props }) {
    return (
        <TextField
            type={type}
            error={error}
            label={placeholder}
            helperText={error ? "* " + errorLabel : ""}
            variant="outlined"
            {...props}
        />
    )
}