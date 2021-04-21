// const crop = require('../models/crop')
// const user = require('../models/user')
// const public = require('../models/public')

// module.exports = {
//     async store(req, res) {
//         const {
//             usuario,
//             conteudo,
//             horta,
//             titulo,
//             tipo,
//             cor,
//             paladar,
//             nome
//         } = req.body

//         const publicExists = await public.findOne({ usuario, horta, titulo })

//         if (publicExists) {
//             return res.json("Não é permitido publicações duplicadas!")
//         }

//         await public.create({
//             usuario: usuario,
//             titulo: titulo,
//             conteudo: conteudo,
//             horta: horta,
//             paladar: paladar,
//             cor: cor,
//             tipo: tipo,
//             avaliacao: {
//                 positiva: 0,
//                 negativa: 0,
//                 usuario: []
//             }
//         })

//         await user.updateOne(
//             { usuario },
//             { $addToSet: { publicacoes: { titulo: titulo, horta: horta } } }
//         )

//         await crop.updateOne(
//             { dono: usuario, nome: nome },
//             { $addToSet: { publicacoes: { titulo: titulo, horta: horta } } }
//         )

//         return res.json(await user.findOne({ usuario: usuario }))
//     },

//     async showAll(req, res) {
//         return res.json(await public.find())
//     },

//     async showOne(req, res) {
//         const { usuario, horta, titulo } = req.body
//         const exists = await public.findOne({ usuario, horta, titulo })

//         if (exists) {
//             return res.json(exists)
//         }

//         return res.json('Publicação não existe!')
//     },

//     async publicsNumber(req, res) {
//         return res.json('Existem ' + (await public.find()).length + ' publicações cadastradas no momentos!')
//     },

//     async delete(req, res) {
//         const { usuario, horta, titulo } = req.body
//         const exists = await public.findOne({ usuario })

//         if (exists) {
//             await public.deleteOne({ usuario, horta, titulo })

//             return res.json('Horta deletado com sucesso!')
//         }

//         return res.json('Horta não existe!')
//     },

//     async insertUser(req, res) {
//         const { usuario, horta, titulo, usuario } = req.body

//         const exists = await public.findOne({ usuario, horta, titulo })
//         const participantExists = await public.findOne({ participantes: usuario })

//         if (participantExists) {
//             return res.json("Participante já faz parte desta horta!!")
//         }

//         if (exists) {
//             await public.updateOne(
//                 { _id: exists._id },
//                 { $addToSet: { participantes: usuario } }
//             )
//             return res.json('Participante inserido com sucesso!')
//         }
//         return res.json('Horta não existe!')
//     },

//     async removeUser(req, res) {
//         const { usuario, horta, titulo, usuario } = req.body

//         const participantExists = await public.findOne({ participantes: usuario })
//         const exists = await public.findOne({ usuario, horta, titulo })

//         if (participantExists) {
//             if (exists) {
//                 await public.updateOne(
//                     { usuario: usuario, horta, titulo: nome },
//                     { $pull: { participantes: usuario } }
//                 )
//                 return res.json("Participante removido com sucesso!")
//             }
//             return res.json("Horta não existe!")
//         }
//         return res.json("Participante não faz parte desta horta!")
//     },

//     async update(req, res) {
//         const { usuario, horta, titulo, novoNome } = req.body

//         const exists = await public.findOne({ usuario, horta, titulo })

//         if(nome == novoNome) {
//             return res.json("O novo nome deve ser diferente do atual!")
//         }

//         if (!exists) {
//             return res.json("Horta não existe!")
//         }

//         await public.updateOne(
//             { _id: exists._id },
//             { $set: { nome: novoNome, usuario: usuario } },
//             { upsert: false }
//         )

//         return res.json("Alterações realizadas com sucesso!")
//     }
// }