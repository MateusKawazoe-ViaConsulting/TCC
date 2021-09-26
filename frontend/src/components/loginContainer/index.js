import React, { useState, useEffect } from 'react'
import MyInput from '../../common/input'
import Button from '../../common/button'
import unfocusable from '../../functions/unfocusable'
import alerts from '../../functions/alertController'
import api from '../../service'
import loginPt from '../../lib/language/pt-br/page/login.json'
import loginEn from '../../lib/language/en/page/login.json'

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

    useEffect(() => {
        unfocusable('unfocusable-login', 'user-login')
    }, [])

    return (
        <form className="login-container column-center">
            <MyInput
                id="user-login"
                error={userError.visible}
                errorLabel={userError.message}
                placeholder="User"
                className="text-regular input-md"
                onChange={e => {
                    setUser(e.target.value)
                    if (user.length > 2)
                        setUserError({ visible: false })
                }}
            />
            <MyInput
                id="unfocusable-login"
                type="password"
                error={passwordError.visible}
                errorLabel={passwordError.message}
                placeholder="Password"
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
                style={{
                    backgroundColor: "#42b72a"
                }}
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
                            const result = await api.post('/user/login', {
                                usuario: user,
                                senha: password
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
                                    alerts.closeAlert('singup-alert')
                                    localStorage.setItem('urbanVG-token', result.data.token)
                                    localStorage.setItem('urbanVG-user_lvl', result.data.nivel.lvl)
                                    localStorage.setItem('urbanVG-user_xp', result.data.nivel.xp)
                                    localStorage.setItem('urbanVG-user_crop', result.data.crop ? result.data.crop.length : 0)
                                    localStorage.setItem('urbanVG-user_sensor', result.data.sensores ? result.data.sensores.length : 0)
                                    localStorage.setItem('urbanVG-user_public', result.data.publicacoes ? result.data.publicacoes.length : 0)
                                    localStorage.setItem('urbanVG-user_foto', result.data.foto ? result.data.foto : '')
                                    localStorage.setItem('urbanVG-user_email', result.data.email)
                                    localStorage.setItem('urbanVG-user_name', result.data.nome)
                                    localStorage.setItem('urbanVG-user_address', result.data.localizacao.endereco)
                                    localStorage.setItem('urbanVG-user', user)
                                    history.push('/home')
                                }
                            }, 1000)
                        }
                    } catch (err) {
                        document.getElementsByClassName("loading")[0].style.display = "none"
                        alerts.showAlert('Problema na conexão com o servidor!', 'Error', 'singup-alert')
                    }
                }}
            >
               {loginEn.login.signIn}
            </Button>
            <span className="text-small">{loginEn.login.forgotPass}</span>
            <span className="line" />
            <Button
                className="button-md"
                onClick={() => {
                    document.getElementsByClassName("signup-container")[0].style.display = "flex"
                }}
            >
                {loginEn.login.signUp}
            </Button>
        </form>
    )
}