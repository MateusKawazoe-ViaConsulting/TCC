const crop = require('../models/crop')
const user = require('../models/user')
const sensor = require('../models/sensor')

module.exports = {
    async store(req, res) {
        const { dono, horta, nome, tipo, valor, descricao } = req.body

        let exists = await sensor.findOne({
            nome, dono
        }).collation({ locale: 'pt', strength: 2 })

        if (exists) {
            return res.json("Sensor já cadastrado!")
        }

        exists = await user.findOne({ usuario: dono }).collation({ locale: 'pt', strength: 2 })

        if (exists.sensores.length > 49) {
            return res.json("Número máximo de sensores inseridos!")
        }

        const result = await sensor.create({
            nome: nome,
            tipo: tipo,
            horta: horta,
            dono: dono,
            descricao: descricao,
            ultimo_feed_id: 1,
            feed: {
                id: 1,
                valor: valor,
                data: new Date()
            },

        })

        await user.updateOne(
            { usuario: dono },
            { $addToSet: { sensores: nome } }
        )

        await crop.updateOne(
            { dono: dono, nome: horta },
            {
                $addToSet: {
                    sensores: {
                        nome: nome,
                        dono: dono
                    }
                }
            }
        )

        return res.json(result)
    },

    async insertIntoACrop(req, res) {
        const { dono, horta, nome } = req.body

        const sensorExists = await sensor.findOne({ nome, dono }).collation({ locale: 'pt', strength: 2 })

        if (!sensorExists)
            return res.json("Sensor não existe!")

        const cropExists = await crop.findOne({ dono, nome: horta }).collation({ locale: 'pt', strength: 2 })

        if (!cropExists)
            return res.json("Horta não existe!")
        else if (cropExists.sensores.find(element => element.nome === nome))
            return res.json("Sensor já visculado a está horta!")

        await sensor.updateOne(
            { _id: sensorExists._id },
            { $set: { horta: horta } }
        )

        await crop.updateOne(
            { _id: cropExists._id },
            {
                $addToSet: {
                    sensores: {
                        dono: dono,
                        nome: nome
                    }
                }
            }
        )

        return res.json("Sensor vinculado com sucesso!")
    },

    async removeFromACrop(req, res) {
        const { dono, horta, nome } = req.body

        const sensorExists = await sensor.findOne({ nome, dono }).collation({ locale: 'pt', strength: 2 })

        if (!sensorExists)
            return res.json("Sensor não existe!")

        const cropExists = await crop.findOne({ dono, nome: horta }).collation({ locale: 'pt', strength: 2 })

        if (!cropExists)
            return res.json("Horta não existe!")
        else if (cropExists.sensores.find(element => element.nome !== nome))
            return res.json("Sensor não visculado a está horta!")

        await sensor.updateOne(
            { _id: sensorExists._id },
            { $set: { horta: "" } }
        )

        await crop.updateOne(
            { _id: cropExists._id },
            {
                $pull: {
                    sensores: {
                        dono: dono,
                        nome: nome
                    }
                }
            }
        )

        return res.json("Sensor removido com sucesso!")
    },

    async showAll(req, res) {
        return res.json(await sensor.find())
    },

    async showOne(req, res) {
        const { dono, nome } = req.headers
        const exists = await sensor.findOne({
            dono,
            nome
        }).collation({ locale: 'pt', strength: 2 })

        if (exists) {
            return res.json(exists)
        }

        return res.json('Sensor não existe!')
    },

    async sensorsNumber(req, res) {
        const result = await sensor.find()
        return res.json(result.length)
    },

    async updateSensor(req, res) {
        const { dono, horta, nome, tipo, descricao, novoNome } = req.body

        const sensorExists = await sensor.findOne({ nome, dono }).collation({ locale: 'pt', strength: 2 })

        if (!sensorExists)
            return res.json("Sensor não existe!")

        let auxTipo = sensorExists.tipo, auxDescricao = sensorExists.descricao, auxNome = sensorExists.nome

        if (tipo)
            auxTipo = tipo
        if (descricao)
            auxDescricao = descricao
        if (novoNome)
            auxNome = novoNome

        await sensor.updateOne(
            { _id: sensorExists._id },
            {
                $set: {
                    nome: auxNome,
                    tipo: auxTipo,
                    descricao: auxDescricao
                }
            }
        )

        await user.updateOne(
            { usuario: dono },
            { $pull: { sensores: nome } }
        )

        await user.updateOne(
            { usuario: dono },
            { $addToSet: { sensores: novoNome } }
        )

        await crop.updateOne(
            {
                dono: dono, nome: horta, sensores:
                {
                    nome: nome,
                    dono: dono
                }

            },
            {
                $set: {
                    sensores: {
                        nome: novoNome,
                        dono: dono
                    }
                }
            }
        )

        return res.json("Sensor atualizado com sucesso!")
    },

    async updateFeed(req, res) {
        const { dono, nome, valor } = req.body

        const sensorExists = await sensor.findOne({ nome, dono }).collation({ locale: 'pt', strength: 2 })

        if (!sensorExists)
            return res.json("Sensor não existe!")

        await sensor.updateOne(
            { _id: sensorExists._id },
            {
                $set: {
                    ultimo_feed_id: sensorExists.ultimo_feed_id + 1
                },
                $push: {
                    feed: {
                        id: sensorExists.ultimo_feed_id + 1,
                        valor: valor,
                        data: new Date()
                    }
                }
            }
        )
        return res.json("Feed atualizado com sucesso!")
    },

    async delete(req, res) {
        const { dono, nome, horta } = req.headers

        const sensorExists = await sensor.deleteOne({ nome, dono }).collation({ locale: 'pt', strength: 2 })

        if (sensorExists.deletedCount > 0) {
            await user.updateOne(
                { usuario: dono },
                {
                    $pull: {
                        sensores: nome
                    }
                }
            )

            await crop.updateOne(
                { dono: dono, nome: horta },
                {
                    $pull: {
                        sensores: {
                            nome: nome,
                            dono: dono
                        }
                    }
                }
            )

            return res.json("Sensor excluído com sucesso!")
        }

        return res.json("Sensor não existe!")
    }
}