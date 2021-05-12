import React, { useState } from 'react'
import MyInput from '../../common/input'
import Button from '../../common/button'
import './styles.scss'

export default function signupContainer() {
    return (
        <div className="signup-container row-center">
            <span className="signup-background" />
            <form className="signup-content column-center">
                <ul className="title-container">
                    <h1 className="text-regular">Cadastre-se</h1>
                    <p className="text-tiny">É fácil e rápido</p>
                </ul>
                <img
                    src="https://static.xx.fbcdn.net/rsrc.php/v3/y2/r/__geKiQnSG-.png"
                    alt="close"
                    className="close"
                    onClick={() => {
                        document.getElementsByClassName("signup-container")[0].style.display = "none"
                    }}
                />
                <span className="line" />
                <div className="name-surname">
                    <MyInput
                        error={false}
                        errorLabel="Nome inválido"
                        placeholder="Nome"
                        className="text-regular input-sm"

                    />
                    <MyInput
                        error={false}
                        errorLabel="Sobrenome inválido"
                        placeholder="Sobrenome"
                        className="text-regular input-sm"

                    />
                </div>
                <MyInput
                    error={false}
                    errorLabel="E-mail inválido"
                    placeholder="E-mail"
                    className="text-regular input-md"

                />
                <MyInput
                    type="password"
                    error={false}
                    errorLabel="Senha inválido"
                    placeholder="Senha"
                    className="text-regular input-md"

                />
                <MyInput
                    type="password"
                    error={false}
                    errorLabel="As senhas devem ser iguais"
                    placeholder="Confirmar senha"
                    className="text-regular input-md"

                />
                <p className="text-tiny">
                    Ao clicar em Cadastre-se, você concorda com nossos <span>Termos, Política de Dados</span> e
                    <span> Política de Cookies</span>. Você poderá cancelar isso quando quiser nas configurações de perfil.
                </p>
                <Button
                    type="submit"
                    className="button-md"
                    onClick={() => {
                        alert("oie")
                    }}
                >
                    Cadastre-se
                </Button>
            </form>
        </div>
    )
}