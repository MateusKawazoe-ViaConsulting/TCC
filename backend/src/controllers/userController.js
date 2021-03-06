const user = require('../models/user')
const tokenServices = require('../service/auth')
const md5 = require("md5")
const findLatlng = require('../service/findLatlng')
const lvlManager = require('../common/nivel')

module.exports = {
    async nextLvl(req, res) {
        return res.json(lvlManager.calcularXpProximoNivel(req.headers.lvl));
    },

    async login(req, res) {
        const { usuario, senha } = req.body
        const exists = await user.findOne({
            usuario
        }).collation({ locale: 'pt', strength: 2 })

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
            email,
            senha,
            nome,
            endereco
        } = req.body

        try {
            const userExists = await user.findOne({
                usuario
            }).collation({ locale: 'pt', strength: 2 })

            const emailExists = await user.findOne({
                email
            }).collation({ locale: 'pt', strength: 2 })

            if (userExists) {
                return res.json("Usuário já cadastrado!")
            } else if (emailExists) {
                return res.json("E-mail já cadastrado!")
            }

            let localizacao = {}

            if (endereco) {
                let latlng = await findLatlng(endereco)
                localizacao = {
                    latitude: latlng.lat,
                    longitude: latlng.lng,
                    endereco: endereco
                }
            } else {
                return res.json('Endereço é obrigatório!')
            }

            const token = await tokenServices.generateToken({
                usuario
            })

            const users = await user.create({
                foto: foto,
                usuario: usuario,
                senha: md5(senha + global.SALT_KEY),
                nome: nome,
                email: email,
                localizacao: localizacao,
                integridade: 1,
                token: token,
                nivel: {
                    lvl: 1,
                    xp: 0
                }
            })

            return res.json(users)
        } catch (err) {
            return res.json("Erro interno do servidor!")
        }
    },

    async showAll(req, res) {
        return res.json(await user.find())
    },

    async showOne(req, res) {
        const usuario = req.headers.usuario
        const exists = await user.findOne({
            usuario
        }).collation({ locale: 'pt', strength: 2 })

        if (exists) {
            return res.json(exists)
        }

        return res.json('Usuário não existe!')
    },

    async usersNumber(req, res) {
        const result = await user.find()
        return res.json(result.length)
    },

    async delete(req, res) {
        const usuario = req.headers.usuario
        const exists = await user.findOne({
            usuario
        }).collation({ locale: 'pt', strength: 2 })

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
            senha,
            endereco,
            email
        } = req.body

        var exists = await user.findOne({
            usuario
        }).collation({ locale: 'pt', strength: 2 })

        if (exists) {
            let aux = {
                foto: exists.foto,
                senha: exists.senha,
                token: exists.token,
                localizacao: exists.localizacao,
                email: exists.email
            }

            if (foto)
                aux.foto = foto
            else if (senha) {
                aux.senha = md5(senha + global.SALT_KEY)
                aux.token = await tokenServices.generateToken({
                    usuario
                })
            } else if (endereco) {
                let latlng = await findLatlng(endereco)
                aux.localizacao = {
                    latitude: latlng.lat,
                    longitude: latlng.lng,
                    endereco: endereco
                }
            } else if (email) {
                aux.email = email
            }

            await user.updateOne({
                usuario
            }, {
                $set: {
                    foto: aux.foto,
                    senha: aux.senha,
                    token: aux.token,
                    localizacao: aux.localizacao,
                    email: aux.email
                }
            }, {
                $upsert: false
            })

            return res.json(exists)
        }

        return res.json('Usuário não existe!')
    },

    async follow(req, res) {
        const { type, nome, usuario } = req.body

        const exists = await user.findOne({ usuario })

        if (!exists)
            return res.json(`Erro ao tentar seguir ${type}!`)

        if (type === "horta")
            await user.updateOne(
                { usuario },
                {
                    $addToSet: {
                        'seguindo.horta': nome
                    }
                }
            )
        else
            await user.updateOne(
                { usuario: usuario },
                {
                    $addToSet: {
                        'seguindo.usuario': nome
                    }
                }
            )

        return res.json(`Seguindo ${nome}!`)
    },

    async unfollow(req, res) {
        const { type, nome, usuario } = req.body

        const exists = await user.findOne({ usuario })

        if (!exists)
            return res.json(`Erro ao tentar deixar de seguir ${type}!`)

        if (type === "horta")
            await user.updateOne(
                { usuario },
                {
                    $pull: {
                        'seguindo.horta': nome
                    }
                }
            )
        else
            await user.updateOne(
                { usuario },
                {
                    $pull: {
                        'seguindo.usuario': nome
                    }
                }
            )

        return res.json(`Deixou de seguir ${nome}!`)
    },

    async updateXp(req, res) {
        const { usuario, tipo } = req.headers

        const exists = await user.findOne({ usuario: usuario })

        if (exists) {
            lvlManager.xpUpdate(user, {
                _id: exists._id, lvl: exists.nivel.lvl, xp: exists.nivel.xp,
                integridade: exists.integridade, tipo: parseFloat(tipo), usuario: usuario
            }, "userXpUpdate")
            return res.json("Experiência atualizada com sucesso!")
        } else {
            return res.json("Problema na atualização da experiência!")
        }
    }
}