const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const http = require("http")
const cron = require('node-cron')
const routes = require('../routes')
const sensorController = require('../controllers/sensorController')

module.exports = (url) => {
    const app = express()

    mongoose.connect(
        url,
        { useNewUrlParser: true, useUnifiedTopology: true }
    )

    app.use(cors())
    app.use(express.json())
    app.use(routes)

    const server = http.createServer(app)
    const { io } = require("./socket")

    io.attach(server)

    cron.schedule('*/30 * * * *', function () {
        sensorController.updateImportedSensorFeed()
    })

    return server.listen(3333)
}