const axios = require('axios')
require('dotenv/config')

module.exports = async (cep) => {
    const result = await axios.get(`${process.env.MAPS_CEP}${cep}/json`)
    return result.data
}