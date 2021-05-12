const user = require('../models/user')
const auth_token = require('../service/auth')
const md5 = require("md5")
const findLatlng = require('../service/findLatlng')

module.exports = {
    async login(req, res) {
        const { usuario, senha } = req.headers
        const exists = await user.findOne({
            usuario
        })

        if (!exists)
            return res.json('Usuário não existe')

        if (exists.senha === md5(senha + global.SALT_KEY))
            return res.json(exists)
        else
            return res.json('Senha incorreta')
    },

    async store(req, res) {
        const {
            foto,
            usuario,
            senha,
            nome,
            endereco
        } = req.body

        try {
            const userExists = await user.findOne({
                usuario
            })

            const nameExists = await user.findOne({
                nome
            })

            if (userExists || nameExists) {
                return res.json("Usuário já cadastrado!")
            }

            let localizacao

            if (endereco) {
                let latlng = await findLatlng(endereco)
                localizacao = {
                    latitude: latlng.lat,
                    longitude: latlng.lng,
                    endereco: endereco
                }
            } else {
                // localizacao = {}
                // return res.json('Endereço é obrigatório!')
            }

            const token = await auth_token.generateToken({
                usuario,
                senha: md5(senha + global.SALT_KEY)
            })

            const users = await user.create({
                foto: foto,
                usuario: usuario,
                senha: md5(senha + global.SALT_KEY),
                nome: nome,
                localizacao: localizacao,
                integridade: 1,
                token: token,
                nivel: {
                    lvl: 0,
                    xp: 0
                }
            })

            return res.json(users)
        } catch (err) {
            // console.log(err)
            // return res.json("Erro interno do servidor!")
        }
    },

    async showAll(req, res) {
        return res.json(await user.find())
    },

    async showOne(req, res) {
        const usuario = req.headers.usuario
        const exists = await user.findOne({
            usuario
        })

        if (exists) {
            return res.json(exists)
        }

        return res.json('Usuário não existe!')
    },

    async usersNumber(req, res) {
        const result = await user.find()
        return res.json(result)
    },

    async delete(req, res) {
        const usuario = req.headers.usuario
        const exists = await user.findOne({
            usuario
        })

        if (exists) {
            await user.deleteOne({
                usuario
            })

            return res.json('Usuário deletado com sucesso!')
        }

        return res.json('Usuário não existe!')
    },

    async update(req, res) {
        const {
            foto,
            usuario,
            senha
        } = req.body

        var exists = await user.findOne({
            usuario
        })

        if (exists) {
            let aux = {
                foto: exists.foto,
                senha: exists.senha,
                token: exists.token
            }

            if (foto)
                aux.foto = foto
            if (senha) {
                aux.senha = md5(senha + global.SALT_KEY)
                aux.token = await auth_token.generateToken({
                    usuario,
                    senha: aux.senha
                })
            }


            await user.updateOne({
                usuario
            }, {
                $set: {
                    foto: aux.foto,
                    senha: aux.senha,
                    token: aux.token
                }
            }, {
                $upsert: false
            })

            return res.json(exists)
        }
        return res.json('Usuário não existe!')
    },

    // async xpUpdate(req, res) {

    // }
}