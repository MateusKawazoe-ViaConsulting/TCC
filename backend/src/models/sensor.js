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
    ultimo_feed_id: Number,
    feed: {
        id: Number,
        valor: Number
    }
}, {
    timestamps: true
})

module.exports = model('sensor', sensorSchema)