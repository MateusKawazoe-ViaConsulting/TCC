import React, { useState } from 'react'
import MyInput from '../../common/input'
import Button from '../../common/button'
import api from '../../service'


export default function LoginContainer({ history }) {
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [userError, setUserError] = useState({
        visible: false,
        message: "Usuário é obrigatório"
    });
    const [passwordError, setPasswordError] = useState({
        visible: false,
        message: "Senha é obrigatória"
    });

    return (
        <form className="login-container column-center">
            <MyInput
                error={userError.visible}
                errorLabel={userError.message}
                placeholder="Usuário"
                className="text-regular input-md"
                onChange={e => {
                    setUser(e.target.value)
                    if (user.length > 2)
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
                    setPassword(e.target.value)
                    if (password.length > 3)
                        setPasswordError({ visible: false })
                }}
            />
            <Button
                type="submit"
                className="button-lg"
                onClick={async () => {
                    if (user.length < 3) {
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
                        if (user.length > 2 && password.length > 2) {
                            document.getElementsByClassName("loading")[0].style.display = "flex"
                            const result = await api.get('/user/login', {
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
                                        message: "Usuário não existe"
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
                            }, 1000)
                        }
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