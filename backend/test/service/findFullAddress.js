const findFullAddress = require('../../src/service/findFullAddress')

module.exports = () => {
    let result

    test('find an address by latitude and longitude', async () => {
        result = await findFullAddress('-22.1065563,-50.1758439')
        expect(result[1].long_name).toBe('Rua José de Aguiar Moraes')
    })

    test('use wrong params', async () => {
        result = await findFullAddress(-22.1065563,-50.1758439)
        expect(result.message).toBe('Request failed with status code 400')
    })
}