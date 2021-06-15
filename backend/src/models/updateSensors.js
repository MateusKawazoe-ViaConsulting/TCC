const { Schema, model } = require('mongoose')

const updateSensors = new Schema({
	id: String,
	sensors: []
}, {
	timestamps: true
})

module.exports = model('updateSensors', updateSensors)