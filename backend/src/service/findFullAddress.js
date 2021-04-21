const axios = require('axios')
require('dotenv/config')

module.exports = async (latlng) => {
    let result

    await axios.get(process.env.MAPS_URL, {
        params: {
            latlng: latlng,
            key: process.env.MAPS_KEY
        }
    }).then((response) => {
        result = response.data.results[0].address_components
    }).catch((error) => {
        result = error
    })

    return result
}