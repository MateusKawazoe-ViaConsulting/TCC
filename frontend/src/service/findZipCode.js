const axios = require('axios')
const alerts = require('../functions/alertController')

module.exports = async (cep) => {
    if (!cep || cep.length < 8) {
        alerts.showAlert('CEP inválido', 'Error', 'singup-alert')
        return
    }
    try {
        const result = await axios.get(`https://viacep.com.br/ws/${cep}/json`)
        return result.data
    } catch (error) {
        document.getElementsByClassName("loading")[0].style.display = "none"
        alerts.showAlert('Problema com a conexão com o ViaCEP!', 'Error', 'singup-alert')
    }
}