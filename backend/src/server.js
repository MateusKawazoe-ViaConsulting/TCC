const server = require('./config/server')
require('dotenv/config')

server(process.env.MONGO_URL)