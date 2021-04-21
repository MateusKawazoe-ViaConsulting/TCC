const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const routes = require('../routes')

module.exports = (url) => {
    const server = express()

    mongoose.connect(
        url,
        { useNewUrlParser: true, useUnifiedTopology: true }
    )

    server.use(cors())
    server.use(express.json())
    server.use(routes)

    const app = server.listen(3333)

    return app
}