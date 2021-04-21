const jwt = require('jsonwebtoken')
require('dotenv/config')

exports.generateToken = async (data) => {
    return jwt.sign(data, process.env.SALT_KEY, {
        expiresIn: '1d'
    })
}

exports.decodeToken = async (token) => {
    return await jwt.verify(token, process.env.SALT_KEY)
}