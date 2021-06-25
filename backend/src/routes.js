const express = require('express')
const userController = require('./controllers/userController')
const cropController = require('./controllers/cropController')
const sensorController = require('./controllers/sensorController')
const routes = express.Router()

// Users routes --
routes.get('/user/lvl/next', userController.nextLvl)

routes.post('/user/login', userController.login)

routes.post('/user/store', userController.store)

routes.get('/user/number', userController.usersNumber)

routes.get('/user/show/all', userController.showAll)

routes.get('/user/show/one', userController.showOne)

routes.delete('/user/delete', userController.delete)

routes.put('/user/update', userController.update)

// -- Users routes

// Crop routes --

routes.post('/crop/store', cropController.store)

routes.get('/crop/number', cropController.cropsNumber)

routes.get('/crop/show/all', cropController.showAll)

routes.get('/crop/show/one', cropController.showOne)

routes.delete('/crop/delete', cropController.delete)

routes.put('/crop/insert/user', cropController.insertUser)

routes.put('/crop/remove/user', cropController.removeUser)

routes.put('/crop/update/name', cropController.update)

// routes.put('/crop/update/sensor', cropController.updateSensor)

// -- Crop routes

// Sensor routes --

routes.post('/sensor/store', sensorController.store)

routes.post('/sensor/importData', sensorController.thingSpeakImportSensor)

routes.get('/sensor/number', sensorController.sensorsNumber)

routes.get('/sensor/show/all', sensorController.showAll)

routes.get('/sensor/show/one', sensorController.showOne)

routes.put('/sensor/insert/crop', sensorController.insertIntoACrop)

routes.put('/sensor/remove/crop', sensorController.removeFromACrop)

routes.put('/sensor/update/sensor', sensorController.updateSensor)

routes.put('/sensor/update/feed', sensorController.updateFeed)

routes.delete('/sensor/delete', sensorController.delete)

// -- Sensor routes

module.exports = routes