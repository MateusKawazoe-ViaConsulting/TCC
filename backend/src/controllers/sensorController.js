const eventEmitter = require('events')
const crop = require('../models/crop')
const user = require('../models/user')
const sensor = require('../models/sensor')
const importData = require('../service/importData')
const updateSensors = require('../models/updateSensors')

const emitter = new eventEmitter.EventEmitter()

module.exports = {
    async store(req, res) {
        const { dono, horta, nome, tipo, cor, descricao } = req.body
        const auxHorta = horta ? horta : ""

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
            horta: auxHorta,
            dono: dono,
            descricao: descricao,
            cor: cor,
            ultimo_feed_id: 0,
            feed: []
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

    async updateImportedSensorFeed() {
        const result = await updateSensors.find()

        if (!result[0].sensores[0])
            return

        result[0].sensores.map(async element => {
            const data = await sensor.findById(element)

            if (!data.nome)
                return

            try {
                importData(data.thing_speak_id).then(async response => {
                    const diff = response.data.channel.last_entry_id - data.ultimo_feed_id

                    for (let i = 0; i < diff; i++) {
                        const feed = response.data.feeds[response.data.feeds.length - (i + 1)];

                        if (feed) {
                            log = await sensor.updateOne(
                                { _id: data._id },
                                {
                                    ultimo_feed_id: response.data.channel.last_entry_id,
                                    $addToSet: {
                                        feed: {
                                            id: feed.entry_id,
                                            valor: feed.field1,
                                            data: feed.created_at
                                        }
                                    }
                                }
                            )
                        }
                    }
                })
            } catch (error) {
                console.log(error)
            }
        })
    },

    thingSpeakImportSensor(req, res) {
        const { id, dono, horta, cor } = req.body
        const auxHorta = horta ? horta : ""

        try {
            importData(id).then(async data => {
                if (!data.data.channel.id)
                    return res.json('Sensor não existe!')

                const userExists = await user.findOne({ usuario: dono }).collation({ locale: 'pt', strength: 2 })

                if (userExists.sensores.length > 49) {
                    return res.json("Número máximo de sensores inseridos!")
                }

                const exists = await sensor.findOne({ nome: data.data.channel.name, dono: dono })

                if (exists)
                    return res.json('Sensor já cadastrado!')

                const feeds = await data.data.feeds.map((element, index) => {
                    return ({
                        data: element.created_at,
                        id: element.entry_id,
                        valor: element.field1
                    })
                })

                const result = await sensor.create({
                    nome: data.data.channel.name,
                    tipo: data.data.channel.field1,
                    horta: auxHorta,
                    dono: dono,
                    descricao: data.data.channel.description,
                    cor: cor,
                    thing_speak_id: id,
                    ultimo_feed_id: data.data.channel.last_entry_id,
                    feed: feeds,
                })

                await user.updateOne(
                    { usuario: dono },
                    { $addToSet: { sensores: data.data.channel.name } }
                )

                await crop.updateOne(
                    { dono: dono, nome: horta },
                    {
                        $addToSet: {
                            sensores: {
                                nome: data.data.channel.name,
                                dono: dono
                            }
                        }
                    }
                )

                if (!await updateSensors.findOne({ id: "Sensors" })) {
                    await updateSensors.create({
                        id: "Sensors",
                        sensors: []
                    })
                }

                await updateSensors.updateOne(
                    { id: "Sensors" },
                    { $addToSet: { sensores: result._id } }
                )

                return res.json(result)
            }).catch(() => {
                return res.json("Sensor informado não é público!")
            })
        } catch (error) {
            return res.json("Erro ao tentar processar a requisição!")
        }
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
        if (req.headers.user) {
            const result = await sensor.find({ dono: req.headers.user })

            if (result[0])
                return res.json(result)

            return res.json(0)
        }

        return res.json(await sensor.find())
    },

    async showOne(req, res) {
        const { dono, nome } = req.query

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
        const { dono, horta, nome, tipo, descricao, cor, novoNome } = req.body

        const sensorExists = await sensor.findOne({ nome, dono }).collation({ locale: 'pt', strength: 2 })

        if (!sensorExists)
            return res.json("Sensor não existe!")

        let auxTipo = sensorExists.tipo, auxDescricao = sensorExists.descricao, auxNome = sensorExists.nome, auxCor = sensorExists.cor

        if (tipo)
            auxTipo = tipo
        if (descricao)
            auxDescricao = descricao
        if (novoNome)
            auxNome = novoNome
        if (cor)
            auxCor = cor

        await sensor.updateOne(
            { _id: sensorExists._id },
            {
                $set: {
                    nome: auxNome,
                    tipo: auxTipo,
                    descricao: auxDescricao,
                    cor: auxCor
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
            },
            { $upsert: false }
        )

        emitter.emit("dataUpdate", {
            value: valor,
            user: dono
        })
        
        return res.json("Feed atualizado com sucesso!")
    },

    async delete(req, res) {
        const { dono, nome, horta } = req.body

        const sensorId = await sensor.findOne({ nome, dono })
        const sensorExists = await sensor.deleteOne({ nome, dono }).collation({ locale: 'pt', strength: 2 })
        const sensorArray = await updateSensors.find()

        if (sensorExists.deletedCount > 0) {
            if (sensorArray[0]) {
                sensorArray[0].sensores.forEach(async element => {
                    if (JSON.stringify(sensorId._id) === JSON.stringify(element)) {
                        await updateSensors.updateOne(
                            { id: "Sensors" },
                            {
                                $pull: {
                                    sensores: element
                                }
                            }
                        )
                    }
                })
            }

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

            await updateSensors.updateOne(
                { id: "Sensors" },
                { $pull: { sensors: sensorId._id } }
            )

            return res.json("Sensor excluído com sucesso!")
        }

        return res.json("Sensor não existe!")
    }
}