import React, { useState, useEffect } from 'react'
import * as Yup from "yup";
import { Formik, Form } from "formik";
import MyInput from '../../common/input'
import alerts from '../../functions/alertController'
import cepMask from '../../validation/cepMask'
import findZipCode from '../../service/findZipCode'
import unfocusable from '../../functions/unfocusable'
import api from '../../service'

export default function LocalizationForm({ clicked, userData, history }) {
  const [start, setStart] = useState(false)
  const [cep, setCep] = useState({
    rua: undefined,
    cidade: undefined,
    uf: undefined
  })
  const [variables, setVariables] = useState({
    street: {
      value: '',
      error: undefined
    },
    number: {
      value: '',
      error: undefined
    },
    // country: {
    //   value: '',
    //   error: undefined
    // },
    city: {
      value: '',
      error: undefined
    },
    uf: {
      value: '',
      error: undefined
    },
    zipCode: {
      value: '',
      error: undefined
    },
    complement: {
      value: ''
    }
  })

  const localizatrionSchema = Yup.object().shape({
    zipCode: Yup.string()
      .min(8, 'CEP deve ter 8 números')
      .max(9, 'CEP deve ter 8 números')
      .required('CEP é obrigatório')
      .matches(/^\d{0,5}[0-9-]{0,4}$/, 'CEP inválido'),
    city: Yup.string()
      .min(1, 'Cidade inválida')
      .max(58, 'Cidade inválida')
      .required('Cidade é obrigatório')
      .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, 'Cidade inválida'),
    uf: Yup.string()
      .min(2, 'UF inválido')
      .max(2, 'UF inválido')
      .required('UF é obrigatório')
      .matches(/^[a-zA-Z]+$/, 'UF inválido'),
    street: Yup.string()
      .min(1, 'Rua inválida')
      .max(60, 'Rua inválida')
      .required('Rua é obrigatório')
      .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s]+$/, 'Estado inválido'),
    number: Yup.number()
      .required('Nº é obrigatório'),
    // country: Yup.string()
    //   .min(1, 'País inválido')
    //   .max(60, 'País inválido')
    //   .required('País é obrigatório')
    //   .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s-]+$/, 'Estado inválido'),
    complement: Yup.string()
      .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s-,]+$/, 'Estado inválido'),
  })

  useEffect(() => {
    if (
      start &&
      Object.values(variables).filter(element => element.error !== undefined).length === 0
    ) {
      if (Object.values(variables).filter(element => element.value !== '').length > 3) {
        document.getElementsByClassName("loading")[0].style.display = "flex"
        setTimeout(async () => {
          var result
          try {
            result = await api.post('/user/store', {
              foto: "",
              usuario: userData.user,
              email: userData.email,
              senha: userData.password,
              nome: userData.name,
              endereco: `${variables.street.value},${variables.number.value},${variables.city.value},${variables.uf.value}`
            })
            document.getElementsByClassName("loading")[0].style.display = "none"

            if (!result.data.usuario) {
              alerts.showAlert(result.data, 'Error', 'singup-alert')
            } else {
              localStorage.setItem('urbanVG-token', result.data.token)
              localStorage.setItem('urbanVG-user', userData.user)
              localStorage.setItem('urbanVG-user_lvl', 1)
              localStorage.setItem('urbanVG-user_xp', 0)
              localStorage.setItem('urbanVG-user_crop', 0)
              localStorage.setItem('urbanVG-user_sensor', 0)
              localStorage.setItem('urbanVG-user_public', 0)
              localStorage.setItem('urbanVG-user_foto', null)
              localStorage.setItem('urbanVG-user_name', userData.name)
              localStorage.setItem('urbanVG-user_name', result.data.localizacao.endereco)
              history.push('/home')
            }
          } catch (err) {
            document.getElementsByClassName("loading")[0].style.display = "none"
            alerts.showAlert('Problema na conexão com o servidor!', 'Error', 'singup-alert')
          }
        })
      } else {
        alerts.showAlert('Existem campos em branco!', 'Error', 'singup-alert')
      }
    } else {
      unfocusable('unfocusable-signup-localization')
      setStart(true)
    }
  }, [clicked])

  return (
    <Formik
      initialValues={{
        zipCode: '',
        city: '',
        uf: '',
        street: '',
        number: '',
        complement: ''
      }}
      validationSchema={localizatrionSchema}
    >
      {({ errors, touched, values, setValues, setFieldTouched }) => (
        <div className="form-content column-center" id="right-user-form">
          <Form className="column-center">
            <div className="input-container column-center">
              <MyInput
                error={errors.zipCode && touched.zipCode}
                errorLabel={errors.zipCode}
                placeholder="CEP"
                className="text-regular input-sm"
                value={values.zipCode}
                style={{
                  marginBottom: '10px'
                }}
                onChange={e => {
                  if (/^\d{0,5}[0-9-]{0,4}$/.test(e.target.value)) {
                    setValues({
                      ...values,
                      zipCode: cepMask(e.target.value)
                    })
                  } else {
                    setValues({
                      ...values
                    })
                  }
                }}
                onBlur={async () => {
                  setFieldTouched('zipCode', true, false)
                  document.getElementsByClassName("loading")[0].style.display = "flex"
                  const result = await findZipCode(values.zipCode)
                  document.getElementsByClassName("loading")[0].style.display = "none"

                  if (result === undefined || result.erro) {
                    setVariables({
                      ...variables,
                      zipCode: {
                        ...variables.zipCode,
                        error: 'CEP não existe!'
                      }
                    })
                    return
                  }

                  setCep({
                    ...cep,
                    cidade: result.localidade,
                    uf: result.uf,
                    rua: result.logradouro
                  })

                  setVariables({
                    ...variables,
                    zipCode: {
                      ...variables.zipCode,
                      error: errors.zipCode,
                      value: values.zipCode
                    },
                    uf: {
                      ...variables.uf,
                      value: result.uf
                    },
                    city: {
                      ...variables.city,
                      value: result.localidade
                    },
                    street: {
                      ...variables.street,
                      value: result.logradouro
                    }
                  })

                  setValues({
                    ...values,
                    cep: result.cep,
                    uf: result.uf,
                    city: result.localidade,
                    street: result.logradouro
                  })

                  document.getElementById('signup-city-label').classList.add('MuiFormLabel-filled')
                  document.getElementById('signup-city-label').style.backgroundColor = '#fff'
                  document.getElementById('signup-uf-label').classList.add('MuiFormLabel-filled')
                  document.getElementById('signup-uf-label').style.backgroundColor = '#fff'
                  document.getElementById('signup-city-label').classList.add('MuiInputLabel-shrink')
                  document.getElementById('signup-uf-label').classList.add('MuiInputLabel-shrink')

                  if (result.logradouro) {
                    document.getElementById('signup-street-label').classList.add('MuiFormLabel-filled')
                    document.getElementById('signup-street-label').classList.add('MuiInputLabel-shrink')
                    document.getElementById('signup-street-label').style.backgroundColor = '#fff'
                    document.getElementById('signup-number').focus()
                  } else {
                    document.getElementById('signup-street').focus()
                  }
                }}
              />
            </div>
            <div className="side-input">
              <div className="input-container column-center">
                <MyInput
                  error={errors.city && touched.city}
                  errorLabel={errors.city}
                  placeholder="Cidade"
                  className="text-regular input-sm"
                  value={values.city || cep.cidade}
                  disabled={cep.cidade !== undefined}
                  id="signup-city"
                  onChange={e => {
                    setValues({
                      ...values,
                      city: e.target.value
                    })
                  }}
                  onBlur={() => {
                    setVariables({
                      ...variables,
                      city: {
                        ...variables.city,
                        error: errors.city,
                        value: values.city
                      }
                    })
                    setFieldTouched('city', true, false)
                  }}
                />
              </div>
              <div className="input-container column-center">
                <MyInput
                  error={errors.uf && touched.uf}
                  errorLabel={errors.uf}
                  placeholder="UF"
                  className="text-regular input-sm"
                  value={values.uf || cep.uf}
                  disabled={cep.uf !== undefined}
                  id="signup-uf"
                  onChange={e => {
                    setValues({
                      ...values,
                      uf: e.target.value
                    })
                  }}
                  onBlur={() => {
                    setVariables({
                      ...variables,
                      uf: {
                        ...variables.uf,
                        error: errors.uf,
                        value: values.uf
                      }
                    })
                    setFieldTouched('uf', true, false)
                  }}
                />
              </div>
            </div>
            <div className="side-input">
              <div className="input-container column-center">
                <MyInput
                  error={errors.street && touched.street}
                  errorLabel={errors.street}
                  placeholder="Rua"
                  className="text-regular input-sm"
                  value={values.street || cep.rua}
                  id="signup-street"
                  onChange={e => {
                    setValues({
                      ...values,
                      street: e.target.value
                    })
                  }}
                  onBlur={() => {
                    setVariables({
                      ...variables,
                      street: {
                        ...variables.street,
                        error: errors.street,
                        value: values.street
                      }
                    })
                    setFieldTouched('street', true, false)
                  }}
                />
              </div>
              <div className="input-container column-center number">
                <MyInput
                  error={errors.number && touched.number}
                  errorLabel={errors.number}
                  placeholder="Nº"
                  className="text-regular input-sm"
                  value={values.number}
                  id="signup-number"
                  onChange={e => {
                    if (/^\d{0,6}$/g.test(e.target.value))
                      setValues({
                        ...values,
                        number: e.target.value
                      })
                  }}
                  onBlur={() => {
                    setVariables({
                      ...variables,
                      number: {
                        ...variables.number,
                        error: errors.number,
                        value: values.number
                      }
                    })
                    setFieldTouched('number', true, false)
                  }}
                />
              </div>
            </div>
            <div className="input-container column-center">
              <MyInput
                id="unfocusable-signup-localization"
                error={errors.complement && touched.complement}
                errorLabel={errors.complement}
                placeholder="Complemento"
                className="text-regular input-sm"
                value={values.complement}
                onChange={e => {
                  setValues({
                    ...values,
                    complement: e.target.value
                  })
                }}
                onBlur={() => {
                  setVariables({
                    ...variables,
                    complement: {
                      ...variables.complement,
                      error: errors.complement,
                      value: values.complement
                    }
                  })
                  setFieldTouched('complement', true, false)
                }}
              />
            </div>
          </Form>
        </div>
      )}
    </Formik>
  )
}