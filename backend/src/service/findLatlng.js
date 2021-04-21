const axios = require('axios')
require('dotenv/config')

module.exports = async (address) => {
    let result

    await axios.get(process.env.MAPS_URL, {
        params: {
            address: address,
            key: process.env.MAPS_KEY
        }
    }).then((response) => {
        result = response.data.results[0].geometry.location
    }).catch((error) => {
        result = error
    })

    return result
}