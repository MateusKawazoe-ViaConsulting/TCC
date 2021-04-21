const { Schema, model } = require('mongoose')

const cropSchema = new Schema({
    nome: {
        type: String,
        required: true
    },
    dono: {
        type: String,
        required: true
    },
    participantes: [],
    localizacao: {
        endereco: {},
        latitude: Number,
        longitude: Number
    },
    publicacoes: [],
    sensores: [],
    nivel: {}
}, {
    timestamps: true
})

module.exports = model('crop', cropSchema)