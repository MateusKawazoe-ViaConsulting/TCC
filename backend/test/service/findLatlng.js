const findLatlng = require('../../src/service/findLatlng')

module.exports = () => {
    let result

    test('find latitude and longitude from an address', async () => {
        result = await findLatlng('Rua José de Aguiar Moraes, 325, Centro, Pompéia, São Paulo')
        expect(result).toMatchObject({ lat: -22.1065563, lng: -50.1758439 })
    })

    test('try to find an unexisting street', async () => {
        result = await findLatlng('Rua k0nda1')
        expect(result.message).toBe("Cannot read property 'geometry' of undefined")
    })
}