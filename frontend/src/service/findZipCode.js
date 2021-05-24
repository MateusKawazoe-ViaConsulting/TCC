const axios = require('axios')

module.exports = async (cep) => {
    const result = await axios.get(`https://viacep.com.br/ws/${cep}/json`)
    return result.data
}