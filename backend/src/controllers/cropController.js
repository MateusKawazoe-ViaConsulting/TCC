const crop = require('../models/crop')
const user = require('../models/user')
const lvlManager = require('../common/nivel')
const findLatlng = require('../service/findLatlng')

module.exports = {
    async store(req, res) {
        const {
            nome,
            dono,
            participantes,
            endereco
        } = req.body

        const cropExists = await crop.findOne({ dono }).collation({ locale: 'pt', strength: 2 })
        const userExists = await user.findOne({ usuario: dono }).collation({ locale: 'pt', strength: 2 })

        if (!userExists)
            return res.json("Usuário não existe!")

        if (cropExists) {
            if (cropExists.nome == nome)
                return res.json("Nome da horta já foi utilizada!")

            if (cropExists.localizacao.endereco == endereco)
                return res.json("Já existe uma horta cadastrada nesse endereço!")

            if (userExists.horta.length === 3)
                return res.json("Você atingiu o número máximo de hortas!")
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
            return res.json('Endereço é obrigatório!')
        }

        const crops = await crop.create({
            nome: nome,
            dono: dono,
            participantes: participantes,
            localizacao: localizacao,
            nivel: {
                lvl: 1,
                xp: 0
            }
        })

        await user.updateOne(
            { usuario: dono },
            { $addToSet: { horta: crops.nome } }
        )

        return res.json(await user.findOne({ usuario: dono }).collation({ locale: 'pt', strength: 2 }))
    },

    async showAll(req, res) {
        if (req.headers.usuario) {
            const result = await crop.find({ dono: req.headers.usuario }).collation({ locale: 'pt', strength: 2 })

            if (result[0])
                return res.json(result)

            return res.json(0)
        }

        return res.json(await crop.find())
    },

    async showOne(req, res) {
        const { dono, nome } = req.headers
        const exists = await crop.findOne({ dono, nome }).collation({ locale: 'pt', strength: 2 })

        if (exists) {
            return res.json(exists)
        }

        return res.json('Horta não existe!')
    },

    async cropsNumber(req, res) {
        return res.json(await crop.find().then(crop => { return parseInt(crop.length) }))
    },

    async delete(req, res) {
        const { dono, nome } = req.body
        const exists = await crop.findOne({ dono, nome }).collation({ locale: 'pt', strength: 2 })

        if (exists) {
            await crop.deleteOne({ dono, nome })
            await user.updateOne(
                { usuario: dono },
                { $pull: { horta: nome } }
            )
            return res.json('Horta deletado com sucesso!')
        }

        return res.json('Horta não existe!')
    },

    async insertUser(req, res) {
        const { dono, nome, usuario } = req.body

        const exists = await crop.findOne({ dono, nome }).collation({ locale: 'pt', strength: 2 })

        if (!exists)
            return res.json('Horta não existe!')

        const participantExists = exists.participantes.find(element => element === usuario)

        if (participantExists) {
            return res.json('Participante já faz parte desta horta!')
        }

        await crop.updateOne(
            { _id: exists._id },
            { $addToSet: { participantes: usuario } }
        )
        return res.json('Participante inserido com sucesso!')
    },

    async removeUser(req, res) {
        const { dono, nome, usuario } = req.body

        const exists = await crop.findOne({ dono, nome }).collation({ locale: 'pt', strength: 2 })

        if (!exists)
            return res.json('Horta não existe!')

        const participantExists = exists.participantes.find(element => element === usuario)

        if (!participantExists) {
            return res.json("Participante não faz parte desta horta!")
        }

        await crop.updateOne(
            { dono: dono, nome: nome },
            { $pull: { participantes: usuario } }
        )
        return res.json("Participante removido com sucesso!")
    },

    async update(req, res) {
        const { dono, nome, novoNome } = req.body

        const exists = await crop.findOne({ dono, nome }).collation({ locale: 'pt', strength: 2 })

        if (nome == novoNome) {
            return res.json("O novo nome deve ser diferente do atual!")
        }

        if (!exists) {
            return res.json("Horta não existe!")
        }

        await crop.updateOne(
            { _id: exists._id },
            { $set: { nome: novoNome, dono: dono } },
            { upsert: false }
        )

        await user.updateOne(
            { usuario: dono },
            {
                $set: {
                    horta: {
                        nome: novoNome
                    }
                }
            }
        )

        return res.json("Nome da horta atualizado com sucesso!")
    },

    async updateXp(req, res) {
        const { usuario, horta, tipo } = req.headers

        const exists = await crop.findOne({ dono: usuario, nome: horta })

        if (exists) {
            lvlManager.xpUpdate(crop, {
                _id: exists._id, lvl: exists.nivel.lvl, xp: exists.nivel.xp,
                integridade: 1, tipo: parseFloat(tipo), usuario: usuario
            }, "userXpUpdate")
            return res.json("Experiência atualizada com sucesso!")
        } else {
            return res.json("Problema na atualização da experiência!")
        }
    }
}