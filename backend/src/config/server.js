const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const http = require("http")
const cron = require('node-cron')
const socketIo = require("socket.io")
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
    const io = socketIo(server, {
        cors: {
            origin: '*',
        }
    })

    const socketArray = []

    io.on("connection", (socket) => {
        console.log("Migulzinho")
        socketArray.push({
            socket: socket,
            user: socket.handshake.query.user
        })

        socket.on("disconnect", () => {
            console.log("Client disconnected")
            const result = socketArray.map((element, index) => {
                if (element.user === socket.handshake.query.user)
                    return index
            })
            socketArray.splice(result[0], 1)
        })
    })

    io.on("updateFeed", (data) => {
        console.log("Chamou")
        const result = socketArray.map((element, index) => {
            if (element.user === data.user)
                return index
        })

        if (result[0] !== null && result[0] > -1) {
            emitToClient(socketArray[result[0]].socket, data.value)
        }
    })

    const emitToClient = (socket, response) => {
        socket.emit("FromAPI", response);
    }

    cron.schedule('*/30 * * * *', function () {
        sensorController.updateImportedSensorFeed()
    })

    return server.listen(3333)
}