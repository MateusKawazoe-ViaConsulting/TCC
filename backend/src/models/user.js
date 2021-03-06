const { Schema, model } = require('mongoose')

const userSchema = new Schema({
    foto: String,
    usuario: {
        type: String,
        required: true
    },
    senha: {
        type: String,
        required: true
    },
    nome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    localizacao: {
        endereco: {},
        latitude: Number,
        longitude: Number
    },
    token: {
        type: String,
        required: true
    },
    horta: [],
    publicacoes: [],
    sensores: [],
    nivel: {},
    seguindo: {
        horta: [],
        usuario: []
    },
    integridade: Number
}, {
    timestamps: true
})

module.exports = model('user', userSchema)