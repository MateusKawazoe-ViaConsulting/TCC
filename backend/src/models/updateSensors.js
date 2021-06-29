const { Schema, model } = require('mongoose')

const updateSensors = new Schema({
	id: String,
	sensores: []
}, {
	timestamps: true
})

module.exports = model('updateSensors', updateSensors)