const { Schema, model } = require('mongoose')

const sensorSchema = new Schema({
    nome: {
        type: String,
        required: true
    },
    tipo: {
        type: String,
        required: true
    },
    horta: String,
    dono: {
        type: String,
        required: true
    },
    descricao: String,
    ultimo_feed_id: Number,
    feed: [{
        _id: false,
        id: Number,
        valor: Number,
        data: Date
    }]
}, {
    timestamps: true
})

module.exports = model('sensor', sensorSchema)