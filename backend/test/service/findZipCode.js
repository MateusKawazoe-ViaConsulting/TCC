const findZipCode = require('../../src/service/findZipCode')

module.exports = () => {
    let result

    test('encode and decode test', async () => {
        result = await findZipCode(86061120)
        expect(result.localidade).toBe('Londrina')
    })
}