const axios = require('axios')
require('dotenv/config')

module.exports = (id) => {
	return Promise.resolve(axios.get(`https://thingspeak.com/channels/${id}/feed`))
}