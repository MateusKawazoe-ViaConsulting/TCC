import React from 'react'
import TextField from '@material-ui/core/TextField';

export default function MyInput({ placeholder, error, errorLabel, ...props }) {
    return (
        <TextField
            type="text"
            error={error}
            label={placeholder}
            helperText={error ? "* " + errorLabel : ""}
            variant="outlined"
            {...props}
        />
    )
}