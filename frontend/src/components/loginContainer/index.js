import React, { useState } from 'react'
import MyInput from '../../common/input'
import Button from '../../common/button'
import api from '../../service'
import './styles.scss'

export default function LoginContainer({ history }) {
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [userError, setUserError] = useState({
        visible: false,
        message: "Usuário inválido"
    });
    const [passwordError, setPasswordError] = useState({
        visible: false,
        message: "Senha inválida"
    });

    return (
        <form className="login-container column-center">
            <MyInput
                error={userError.visible}
                errorLabel={userError.message}
                placeholder="Usuário"
                className="text-regular input-md"
                onChange={e => {
                    if (user.length < 30)
                        setUser(e.target.value)
                    if (user.length > 3 && /^[\w-.]+@([\w-])+\.+[\w-]{2,4}$/.test(user))
                        setUserError({ visible: false })
                }}
            />
            <MyInput
                type="password"
                error={passwordError.visible}
                errorLabel={passwordError.message}
                placeholder="Senha"
                className="text-regular input-md"
                onChange={e => {
                    if (password.length < 30)
                        setPassword(e.target.value)
                    if (password.length > 3)
                        setPasswordError({ visible: false })
                }}
            />
            <Button
                type="submit"
                className="button-lg"
                onClick={async () => {
                    if (!user || user.length < 4 || !/^[\w-.]+@([\w-])+\.+[\w-]{2,4}$/.test(user)) {
                        setUserError({
                            visible: true,
                            message: "Usuário inválido"
                        })
                    } else {
                        setUserError({ visible: false })
                    }

                    if (!password || password.length < 4) {
                        setPasswordError({
                            visible: true,
                            message: "Senha inválida"
                        })
                    } else {
                        setPasswordError({ visible: false })
                    }

                    try {
                        document.getElementsByClassName("loading")[0].style.display = "flex"
                        const result = await api.get('http://localhost:3333/user/login', {
                            headers: {
                                usuario: user,
                                senha: password
                            }
                        })
                        setTimeout(() => {
                            document.getElementsByClassName("loading")[0].style.display = "none"
                            if (result.data === 'Usuário não existe') {
                                setUserError({
                                    visible: true,
                                    message: result.data
                                })
                            } else if (result.data === 'Senha incorreta') {
                                setPasswordError({
                                    visible: true,
                                    message: result.data
                                })
                            } else {
                                localStorage.setItem('urbanVG-token', result.data.token)
                                history.push('/home')
                            }
                        }, 2000)
                    } catch (err) {

                    }
                }}
            >
                Entrar
            </Button>
            <span className="text-small">Esqueceu sua senha?</span>
            <span className="line" />
            <Button
                className="button-md"
                onClick={() => {
                    document.getElementsByClassName("signup-container")[0].style.display = "flex"
                }}
            >
                Criar nova conta
            </Button>
        </form>
    )
}