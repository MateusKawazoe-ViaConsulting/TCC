import React, { useState, useEffect } from 'react'
import { Formik, Form } from "formik";
import MyInput from '../../common/input'
import api from '../../service'
import * as Yup from "yup";

export default function SignupForm({ clicked, handleNext }) {
    const [start, setStart] = useState(false)
    const [variables, setVariables] = useState({
        name: {
            value: 'Paulo',
            error: undefined
        },
        surname: {
            value: 'Henrique',
            error: undefined
        },
        user: {
            value: 'Tixiliski',
            error: undefined
        },
        email: {
            value: 'matkawao@got.com',
            error: undefined
        },
        password: {
            value: 'asdasd',
            error: undefined
        },
        confirmPassword: {
            value: 'asdasd',
            error: undefined
        }
    })

    const SignInSchema = Yup.object().shape({
        name: Yup.string()
            .min(2, 'Nome inválido')
            .max(30, 'Nome inválido')
            .required('Nome é obrigatório')
            .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ]+$/, 'Nome inválido'),
        surName: Yup.string()
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
            Object.values(variables).filter(element => element.value !== '').length === 6 &&
            Object.values(variables).filter(element => element.error !== undefined).length === 0
        ) {
            setTimeout(() => {
                document.getElementsByClassName("loading")[0].style.display = "none"
            }, 10000)

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
                            document.getElementsByClassName("loading")[0].style.display = "none"
                        } else if (result.data === "E-mail já cadastrado!") {
                            setVariables({
                                ...variables,
                                email: {
                                    ...variables.email,
                                    error: result.data
                                }
                            })
                            document.getElementsByClassName("loading")[0].style.display = "none"
                        } else {
                            handleNext()
                        }
                    })
                } catch (err) {
                    console.log(err)

                }
            }, 1000)
        } else {
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
                                    placeholder="Nome"
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
                                    error={errors.surName && touched.surName}
                                    errorLabel={errors.surName}
                                    placeholder="Sobrenome"
                                    className="text-regular input-sm"
                                    values={values.surName}
                                    onChange={e => {
                                        setValues({
                                            ...values,
                                            surName: e.target.value
                                        })
                                    }}
                                    onBlur={() => {
                                        setVariables({
                                            ...variables,
                                            surName: {
                                                ...variables.surName,
                                                error: errors.surName,
                                                value: values.surName
                                            }
                                        })
                                        setFieldTouched('surName', true, false)
                                    }}
                                />
                            </div>
                        </div>
                        <div className="input-container column-center">
                            <MyInput
                                error={errors.user && touched.user}
                                errorLabel={errors.user}
                                placeholder="Usuário"
                                className="text-regular input-md"
                                values={values.user}
                                onChange={e => {
                                    setValues({
                                        ...values,
                                        user: e.target.value
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
                                error={errors.email && touched.email}
                                errorLabel={errors.email}
                                placeholder="E-mail"
                                className="text-regular input-md"
                                values={values.email}
                                onChange={e => {
                                    setValues({
                                        ...values,
                                        email: e.target.value
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
                                placeholder="Senha"
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
                                error={errors.confirmPassword && touched.confirmPassword}
                                errorLabel={errors.confirmPassword}
                                placeholder="Confirmar senha"
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