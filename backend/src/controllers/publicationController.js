const crop = require('../models/crop')
const user = require('../models/user')
const publication = require('../models/publication')

module.exports = {
	async store(req, res) {
		const {
			usuario,
			conteudo,
			horta,
			titulo,
			tipo,
			cor,
			nome
		} = req.body

		const publicationExists = await publication.findOne({ usuario, horta, titulo })

		if (publicationExists) {
			return res.json("Não é permitido publicationações duplicadas!")
		}

		await publication.create({
			usuario: usuario,
			titulo: titulo,
			conteudo: conteudo,
			horta: horta,
			cor: cor,
			tipo: tipo,
			avaliacao: {
				positiva: 0,
				negativa: 0,
				usuario: []
			}
		})

		await user.updateOne(
			{ usuario },
			{ $addToSet: { publicacoes: { titulo: titulo, horta: horta } } }
		)

		await crop.updateOne(
			{ dono: usuario, nome: nome },
			{ $addToSet: { publicacoes: { titulo: titulo, horta: horta } } }
		)

		return res.json(await user.findOne({ usuario: usuario }))
	},

	async showAll(req, res) {
		const { nome, tipo } = req.body;

		switch (tipo) {
			case "horta":
				return res.json(await publication.find({ horta: nome }))
			case "pessoa":
				return res.json(await publication.find({ usuario: nome }))
			default:
				return res.json(await publication.find())
		}
	},

	async showOne(req, res) {
		const { usuario, horta, titulo } = req.body
		const exists = await publication.findOne({ usuario, horta, titulo })

		if (exists) {
			return res.json(exists)
		}

		return res.json('Publicationação não existe!')
	},

	async publicationsNumber(req, res) {
		return res.json('Existem ' + (await publication.find()).length + ' publicationações cadastradas no momentos!')
	},

	async delete(req, res) {
		const { usuario, horta, titulo } = req.body
		const exists = await publication.findOne({ usuario })

		if (exists) {
			await publication.deleteOne({ usuario, horta, titulo })

			await user.updateOne(
				{ usuario },
				{ $pull: { publicacoes: { titulo: titulo, horta: horta } } }
			)

			await crop.updateOne(
				{ dono: usuario, nome: nome },
				{ $pull: { publicacoes: { titulo: titulo, horta: horta } } }
			)

			return res.json('Horta deletado com sucesso!')
		}

		return res.json('Horta não existe!')
	},

	async addFeedback(req, res) {
		const { usuario, horta, titulo } = req.body

		const exists = await publication.findOne({ usuario, horta, titulo })
		const participantExists = await publication.findOne({ participantes: usuario })

		if (participantExists) {
			return res.json("Participante já faz parte desta horta!!")
		}

		if (exists) {
			await publication.updateOne(
				{ _id: exists._id },
				{ $addToSet: { participantes: usuario } }
			)
			return res.json('Participante inserido com sucesso!')
		}
		return res.json('Horta não existe!')
	},

	async removeFeedback(req, res) {
		const { usuario, horta, titulo } = req.body

		const participantExists = await publication.findOne({ participantes: usuario })
		const exists = await publication.findOne({ usuario, horta, titulo })

		if (participantExists) {
			if (exists) {
				await publication.updateOne(
					{ usuario: usuario, horta, titulo: nome },
					{ $pull: { participantes: usuario } }
				)
				return res.json("Participante removido com sucesso!")
			}
			return res.json("Horta não existe!")
		}
		return res.json("Participante não faz parte desta horta!")
	},

	async update(req, res) {
		const { usuario, horta, titulo, novoNome } = req.body

		const exists = await publication.findOne({ usuario, horta, titulo })

		if (nome == novoNome) {
			return res.json("O novo nome deve ser diferente do atual!")
		}

		if (!exists) {
			return res.json("Horta não existe!")
		}

		await publication.updateOne(
			{ _id: exists._id },
			{ $set: { nome: novoNome, usuario: usuario } },
			{ upsert: false }
		)

		return res.json("Alterações realizadas com sucesso!")
	}
}