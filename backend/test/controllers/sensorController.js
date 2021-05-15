const axios = require('axios')

module.exports = () => {
    let result

    test('Store a vaild sensor', async () => {
        result = await axios.post('http://localhost:3333/sensor/store', {
            nome: 'Sensor de humidade da flor de abacaxi',
            tipo: "Humidade",
            dono: 'Mateuskwz',
            horta: '',
            valor: 100
        })
        expect(result.data.usuario).toBe('Mateuskwz')
    })
}