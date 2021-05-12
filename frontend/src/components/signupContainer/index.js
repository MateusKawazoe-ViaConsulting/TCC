import React, { useState } from 'react'
import MyInput from '../../common/input'
import Button from '../../common/button'
import api from '../../service'
import './styles.scss'

export default function SignupContainer({ history }) {
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [nameError, setNameError] = useState({
        visible: false,
        message: "Nome inválido"
    });
    const [surnameError, setSurnameError] = useState({
        visible: false,
        message: "Sobrenome inválida"
    });
    const [userError, setUserError] = useState({
        visible: false,
        message: "Usuário inválido"
    });
    const [passwordError, setPasswordError] = useState({
        visible: false,
        message: "Senha inválida"
    });
    const [confirmPasswordError, setConfirmPasswordError] = useState({
        visible: false,
        message: "As senhas devem ser iguais"
    });

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
                        error={nameError.visible}
                        errorLabel={nameError.message}
                        placeholder="Nome"
                        className="text-regular input-sm"
                        value={name}
                        onChange={e => {
                            setName(e.target.value)

                            if (name.length > 2)
                                setNameError({ visible: false })
                        }}
                    />
                    <MyInput
                        error={surnameError.visible}
                        errorLabel={surnameError.message}
                        placeholder="Sobrenome"
                        className="text-regular input-sm"
                        value={surname}
                        onChange={e => {
                            setSurname(e.target.value)

                            if (surname.length > 2)
                                setSurnameError({ visible: false })
                        }}
                    />
                </div>
                <MyInput
                    error={userError.visible}
                    errorLabel={userError.message}
                    placeholder="E-mail"
                    className="text-regular input-md"
                    value={user}
                    onChange={e => {
                        setUser(e.target.value)

                        if (user.length > 7 && /^[\w-.]+@([\w-])+\.+[\w-]{2,4}$/.test(user))
                            setUserError({ visible: false })
                    }}
                />
                <MyInput
                    type="password"
                    error={passwordError.visible}
                    errorLabel={passwordError.message}
                    placeholder="Senha"
                    className="text-regular input-md"
                    value={password}
                    onChange={e => {
                        setPassword(e.target.value)

                        if (password.length > 3)
                            setPasswordError({ visible: false })
                    }}
                />
                <MyInput
                    type="password"
                    error={confirmPasswordError.visible}
                    errorLabel={confirmPasswordError.message}
                    placeholder="Confirmar senha"
                    className="text-regular input-md"
                    value={confirmPassword}
                    onChange={e => {
                        setConfirmPassword(e.target.value)
                        
                        if (password === confirmPassword)
                            setConfirmPasswordError({ visible: false })
                    }}
                    onBlur={() => {
                        if (password === confirmPassword)
                            setConfirmPasswordError({ visible: false })
                    }}
                />
                <p className="text-tiny">
                    Ao clicar em Cadastre-se, você concorda com nossos <span>Termos, Política de Dados</span> e
                    <span> Política de Cookies</span>. Você poderá cancelar isso quando quiser nas configurações de perfil.
                </p>
                <Button
                    type="submit"
                    className="button-md"
                    onClick={async () => {
                        if (!user || user.length < 8 || !/^[\w-.]+@([\w-])+\.+[\w-]{2,4}$/.test(user)) {
                            setUserError({
                                visible: true,
                                message: "E-mail inválido"
                            })
                        }

                        if (!name || name.length < 4) {
                            setNameError({
                                visible: true,
                                message: "Nome inválido"
                            })
                        }

                        if (!surname || surname.length < 4) {
                            setSurnameError({
                                visible: true,
                                message: "Sobrenome inválido"
                            })
                        }

                        if (!password || password.length < 4) {
                            setPasswordError({
                                visible: true,
                                message: "Senha inválida"
                            })
                        }

                        if (!confirmPassword || confirmPassword !== password) {
                            setConfirmPasswordError({
                                visible: true,
                                message: "As senhas devem ser iguais"
                            })
                        }

                        if (user !== "" && password !== "" && name !== "" && surname !== "" && password === confirmPassword) {
                            document.getElementsByClassName("loading")[0].style.display = "flex"

                            try {
                                const result = await new Promise((resolve) => {
                                    const data = api.post('/user/store', {
                                        foto: "",
                                        usuario: user,
                                        senha: password,
                                        nome: name + " " + surname
                                    })
                                    resolve(data)
                                })
                                setTimeout(() => {
                                    document.getElementsByClassName("loading")[0].style.display = "none"
                                    if (result.data === "Usuário já cadastrado!") {
                                        setUserError({
                                            visible: true,
                                            message: "E-mail já cadastrado"
                                        })
                                    } else {
                                        localStorage.setItem('urbanVG-token', result.data.token)
                                        history.push('/home')
                                    }
                                }, 1500)
                            } catch (err) {
                                console.log(err)
                            }
                        }
                    }}
                >
                    Cadastre-se
                </Button>
            </form>
        </div>
    )
}