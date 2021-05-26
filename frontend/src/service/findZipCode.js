const axios = require('axios')
const alerts = require('../functions/alertController')

module.exports = async (cep) => {
    try {
        const result = await axios.get(`https://viacep.com.br/ws/${cep}/json`)
        return result.data
    } catch (error) {
        document.getElementsByClassName("loading")[0].style.display = "none"
        alerts.showAlert('Problema com a conexão com o ViaCEP!', 'Error', 'singup-alert')
    }
}