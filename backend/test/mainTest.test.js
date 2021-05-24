const cropTest = require('./controllers/cropController')
const userTest = require('../test/controllers/userController')
const sensorTest = require('../test/controllers/sensorController')
const authTest = require('../test/service/auth')
const findLatlngTest = require('../test/service/findLatlng')
const findFullAddressTest = require('../test/service/findFullAddress')
const server = require('../src/config/server')
const mongoose = require('mongoose')
require('dotenv/config')

var app

beforeAll(async (done) => {
    app = await server(process.env.MONGO_TEST_URL)
    done()
})

describe('controllers test', () => {
    cropTest()
    userTest()
    sensorTest()
})

describe('service test', () => {
    authTest()
    findLatlngTest()
    findFullAddressTest()
})

afterAll(async () => {
    app.close()
    await mongoose.connection.close()
})