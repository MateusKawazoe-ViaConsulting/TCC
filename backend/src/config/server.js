const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cron = require('node-cron')
const routes = require('../routes')
const sensorController = require('../controllers/sensorController')

module.exports = (url) => {
    const server = express()

    mongoose.connect(
        url,
        { useNewUrlParser: true, useUnifiedTopology: true }
    )

    server.use(cors())
    server.use(express.json())
    server.use(routes)

    cron.schedule('*/5 * * * * *', function () {
        sensorController.updateImportedSensorFeed();
    })

    const app = server.listen(3333)

    return app
}