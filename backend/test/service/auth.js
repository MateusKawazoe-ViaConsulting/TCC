const auth = require('../../src/service/auth')

module.exports = () => {
    let token, result

    test('encode and decode test', async () => {
        token = await auth.generateToken({user: 'Mateuszinho'})
        result = await auth.decodeToken(token)
        expect(result.user).toBe('Mateuszinho')
    })
}