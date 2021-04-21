const { Schema, model } = require('mongoose')

const publicSchema = new Schema({
    titulo: {
        type: String,
        required: true
    },
    conteudo: {
        required: true
    },
    tipo: String,
    cor: String,
    paladar: String,
    avaliacao: {
        required: true,
        positiva: Number,
        negativa: Number,
    },
    usuario: {
        foto: String,
        usuario: String
    },
    horta: {
        type: String,
        required: true
    },
    resposta: {
        usuario: String,
        conteudo: String
    }
})

module.export = model('public', publicSchema)