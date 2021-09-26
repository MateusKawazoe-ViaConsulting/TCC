import React, { useState, useEffect } from 'react'
import { Formik, Form } from "formik";
import MyInput from '../../common/input'
import alerts from '../../functions/alertController'
import unfocusable from '../../functions/unfocusable'
import api from '../../service'
import * as Yup from "yup";

export default function SignupForm({ clicked, handleNext, setData, userData }) {
    const [start, setStart] = useState(false)
    const [variables, setVariables] = useState({
        name: {
            value: '',
            error: undefined
        },
        surname: {
            value: '',
            error: undefined
        },
        user: {
            value: '',
            error: undefined
        },
        email: {
            value: '',
            error: undefined
        },
        password: {
            value: '',
            error: undefined
        },
        confirmPassword: {
            value: '',
            error: undefined
        }
    })

    const SignInSchema = Yup.object().shape({
        name: Yup.string()
            .min(2, 'Nome inválido')
            .max(30, 'Nome inválido')
            .required('Nome é obrigatório')
            .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ]+$/, 'Nome inválido'),
        surname: Yup.string()
            .min(2, 'Sobrenome inválido')
            .max(30, 'Sobrenome inválido')
            .required('Sobrenome é obrigatório')
            .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ]+$/, 'Sobrenome inválido'),
        user: Yup.string()
            .min(2, 'Usuário inválido')
            .max(30, 'Usuário inválido')
            .required('Usuário é obrigatório')
            .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ0-9]+$/, 'Usuário inválido'),
        email: Yup.string()
            .min(7, 'E-mail inválido')
            .max(30, 'E-mail inválido')
            .required('E-mail é obrigatório')
            .matches(/^[\w-.]+@([\w-])+\.+[\w-]{2,4}$/, 'E-mail inválido'),
        password: Yup.string()
            .min(6, 'Senha deve ter pelo menos 6 letras')
            .max(30, 'Senha inválida')
            .required('Senha é obrigatória'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'As senhas devem ser iguais'),
    })

    useEffect(() => {
        if (
            start &&
            Object.values(variables).filter(element => element.error !== undefined).length === 0
        ) {
            if (Object.values(variables).filter(element => element.value !== '').length > 5) {
                document.getElementsByClassName("loading")[0].style.display = "flex"
                setTimeout(async () => {
                    try {
                        const result = await new Promise((resolve) => {
                            const data = api.post('/user/store', {
                                foto: "",
                                usuario: variables.user.value,
                                email: variables.email.value,
                                senha: variables.password.value,
                                nome: variables.name.value + " " + variables.surname.value,
                                endereco: ''
                            })
                            resolve(data)
                        }).catch(err => {
                            console.log(err)
                        })
                        setTimeout(() => {
                            document.getElementsByClassName("loading")[0].style.display = "none"
                            if (result.data === "Usuário já cadastrado!") {
                                setVariables({
                                    ...variables,
                                    user: {
                                        ...variables.user,
                                        error: result.data
                                    }
                                })
                            } else if (result.data === "E-mail já cadastrado!") {
                                setVariables({
                                    ...variables,
                                    email: {
                                        ...variables.email,
                                        error: result.data
                                    }
                                })
                            } else if (variables.password.value !== variables.confirmPassword.value) {
                                setVariables({
                                    ...variables,
                                    confirmPassword: {
                                        ...variables.confirmPassword,
                                        error: 'As senhas devem ser iguais'
                                    }
                                })
                            } else {
                                setData({
                                    ...userData,
                                    name: variables.name.value + " " + variables.surname.value,
                                    user: variables.user.value,
                                    email: variables.email.value,
                                    password: variables.password.value
                                })
                                handleNext()
                            }
                        })
                    } catch (err) {
                        document.getElementsByClassName("loading")[0].style.display = "none"
                        alerts.showAlert('Problema na conexão com o servidor!', 'Error', 'singup-alert')
                    }
                }, 1000)
            } else {
                alerts.showAlert('Existem campos em branco!', 'Error', 'singup-alert')
            }
        } else {
            unfocusable('unfocusable-signup-user')
            setStart(true)
        }
    }, [clicked])

    return (
        <Formik
            initialValues={{
                name: '',
                surname: '',
                user: '',
                email: '',
                password: '',
                confirmPassword: ''
            }}
            validationSchema={SignInSchema}
        >
            {({ errors, touched, values, setValues, setFieldTouched }) => (
                <div className="form-content column-center" id="left-user-form">
                    <Form className="column-center">
                        <div className="side-input">
                            <div className="input-container column-center">
                                <MyInput
                                    error={errors.name && touched.name}
                                    errorLabel={errors.name}
                                    placeholder="Name"
                                    className="text-regular input-sm"
                                    values={values.name}
                                    onChange={e => {
                                        setValues({
                                            ...values,
                                            name: e.target.value
                                        })
                                    }}
                                    onBlur={() => {
                                        setVariables({
                                            ...variables,
                                            name: {
                                                ...variables.name,
                                                error: errors.name,
                                                value: values.name
                                            }
                                        })
                                        setFieldTouched('name', true, false)
                                    }}
                                />
                            </div>
                            <div className="input-container column-center">
                                <MyInput
                                    error={errors.surname && touched.surname}
                                    errorLabel={errors.surname}
                                    placeholder="Surname"
                                    className="text-regular input-sm"
                                    values={values.surname}
                                    onChange={e => {
                                        setValues({
                                            ...values,
                                            surname: e.target.value
                                        })
                                    }}
                                    onBlur={() => {
                                        setVariables({
                                            ...variables,
                                            surname: {
                                                ...variables.surname,
                                                error: errors.surname,
                                                value: values.surname
                                            }
                                        })
                                        setFieldTouched('surname', true, false)
                                    }}
                                />
                            </div>
                        </div>
                        <div className="input-container column-center">
                            <MyInput
                                error={(errors.user && touched.user) || variables.user.error !== undefined}
                                errorLabel={errors.user ? errors.user : variables.user.error}
                                placeholder="User"
                                className="text-regular input-md"
                                values={values.user}
                                onChange={e => {
                                    setValues({
                                        ...values,
                                        user: e.target.value
                                    })
                                    setVariables({
                                        ...variables,
                                        user: {
                                            ...variables.user,
                                            error: undefined
                                        }
                                    })
                                }}
                                onBlur={() => {
                                    setVariables({
                                        ...variables,
                                        user: {
                                            ...variables.user,
                                            error: errors.user,
                                            value: values.user
                                        }
                                    })
                                    setFieldTouched('user', true, false)
                                }}
                            />
                        </div>
                        <div className="input-container column-center">
                            <MyInput
                                error={(errors.email && touched.email) || variables.email.error !== undefined}
                                errorLabel={errors.email ? errors.email : variables.email.error}
                                placeholder="E-mail"
                                className="text-regular input-md"
                                values={values.email}
                                onChange={e => {
                                    setValues({
                                        ...values,
                                        email: e.target.value
                                    })
                                    setVariables({
                                        ...variables,
                                        email: {
                                            ...variables.email,
                                            error: undefined
                                        }
                                    })
                                }}
                                onBlur={() => {
                                    setVariables({
                                        ...variables,
                                        email: {
                                            ...variables.email,
                                            error: errors.email,
                                            value: values.email
                                        }
                                    })
                                    setFieldTouched('email', true, false)
                                }}
                            />
                        </div>
                        <div className="input-container column-center">
                            <MyInput
                                error={errors.password && touched.password}
                                errorLabel={errors.password}
                                placeholder="Password"
                                className="text-regular input-md"
                                values={values.password}
                                type="password"
                                onChange={e => {
                                    setValues({
                                        ...values,
                                        password: e.target.value
                                    })
                                }}
                                onBlur={() => {
                                    setVariables({
                                        ...variables,
                                        password: {
                                            ...variables.password,
                                            error: errors.password,
                                            value: values.password
                                        }
                                    })
                                    setFieldTouched('password', true, false)
                                }}
                            />
                        </div>
                        <div className="input-container column-center">
                            <MyInput
                                id="unfocusable-signup-user"
                                error={(errors.confirmPassword && touched.confirmPassword) || variables.confirmPassword.error !== undefined}
                                errorLabel={errors.confirmPassword ? errors.confirmPassword : variables.confirmPassword.error}
                                placeholder="Confirm Password"
                                className="text-regular input-md"
                                values={values.confirmPassword}
                                type="password"
                                onChange={e => {
                                    setValues({
                                        ...values,
                                        confirmPassword: e.target.value
                                    })
                                }}
                                onBlur={() => {
                                    setVariables({
                                        ...variables,
                                        confirmPassword: {
                                            ...variables.confirmPassword,
                                            error: errors.confirmPassword,
                                            value: values.confirmPassword
                                        }
                                    })
                                    setFieldTouched('confirmPassword', true, false)
                                }}
                            />
                        </div>
                    </Form>
                </div>
            )}
        </Formik>
    )
}