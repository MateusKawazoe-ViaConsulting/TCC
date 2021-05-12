const express = require('express')
const userController = require('./controllers/userController')
const cropController = require('./controllers/cropController')
const routes = express.Router()

// Users routes --
routes.get('/user/login', userController.login)

routes.post('/user/store', userController.store)

routes.get('/user/users/number', userController.usersNumber)

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

routes.put('/crop/insert/sensor', cropController.insertSensor)

routes.put('/crop/remove/sensor', cropController.removeSensor)

routes.put('/crop/update/name', cropController.update)

// routes.put('/crop/update/sensor', cropController.updateSensor)

// -- Crop routes

module.exports = routes