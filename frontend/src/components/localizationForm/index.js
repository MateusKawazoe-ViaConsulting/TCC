import React, { useState, useEffect } from 'react'
import * as Yup from "yup";
import { Formik, Form } from "formik";
import MyInput from '../../common/input'
import cepMask from '../../validation/cepMask'
import findZipCode from '../../service/findZipCode'

export default function LocalizationForm({ clicked }) {
  const [start, setStart] = useState(false)
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
    state: {
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
      .test('len', 'CEP deve ter 8 números', val => val.length === 9)
      .required('CEP é obrigatório')
      .matches(/^\d{0,5}[0-9-]{0,4}$/, 'CEP inválido'),
    city: Yup.string()
      .min(1, 'Cidade inválida')
      .max(58, 'Cidade inválida')
      .required('Cidade é obrigatório')
      .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, 'Cidade inválida'),
    state: Yup.string()
      .min(1, 'Estado inválido')
      .max(58, 'Estado inválido')
      .required('Estado é obrigatório')
      .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, 'Estado inválido'),
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
    if (start) {

    } else {
      setStart(true)
    }
  }, [clicked])

  return (
    <Formik
      initialValues={{
        zipCode: '',
        city: '',
        state: '',
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
                values={values.zipCode}
                onChange={e => {
                  setValues({
                    ...values,
                    zipCode: e.target.value
                  })
                }}
                onBlur={() => {
                  setVariables({
                    ...variables,
                    zipCode: {
                      ...variables.zipCode,
                      error: errors.zipCode,
                      value: values.zipCode
                    }
                  })
                  setFieldTouched('zipCode', true, false)
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
                  values={values.city}
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
                  error={errors.state && touched.state}
                  errorLabel={errors.state}
                  placeholder="Estado"
                  className="text-regular input-sm"
                  values={values.state}
                  onChange={e => {
                    setValues({
                      ...values,
                      state: e.target.value
                    })
                  }}
                  onBlur={() => {
                    setVariables({
                      ...variables,
                      state: {
                        ...variables.state,
                        error: errors.state,
                        value: values.state
                      }
                    })
                    setFieldTouched('state', true, false)
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
                  values={values.street}
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
              <div className="input-container column-center">
                <MyInput
                  error={errors.number && touched.number}
                  errorLabel={errors.number}
                  placeholder="Nº"
                  className="text-regular input-sm"
                  values={values.number}
                  onChange={e => {
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
                error={errors.complement && touched.complement}
                errorLabel={errors.complement}
                placeholder="Complemento"
                className="text-regular input-sm"
                values={values.complement}
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