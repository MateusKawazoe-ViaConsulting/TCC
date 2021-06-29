const jwt = require('jsonwebtoken')
require('dotenv/config')

const generateToken = async (data) => {
    return jwt.sign(data, process.env.SALT_KEY, {
        expiresIn: '1d'
    })
}

const encodeToken = (data) => {
    return jwt.sign(data, process.env.SALT_KEY)
}

const decodeToken = (token) => {
    return jwt.decode(token, process.env.SALT_KEY)
}

const verifyToken = (token) => {
    return jwt.verify(token, process.env.SALT_KEY)
}

module.exports = {
    generateToken,
    encodeToken,
    decodeToken,
    verifyToken
}
