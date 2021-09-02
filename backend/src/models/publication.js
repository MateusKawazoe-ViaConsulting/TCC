const { Schema, model } = require('mongoose')

const publicationSchema = new Schema({
    titulo: {
        type: String,
        required: true
    },
    conteudo: {
        required: true
    },
    tipo: String,
    cor: String,
    avaliacao: {
        required: true,
        positiva: Number,
        negativa: Number,
    },
    usuario: {
        type: String,
        required: true
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

module.export = model('publication', publicationSchema)