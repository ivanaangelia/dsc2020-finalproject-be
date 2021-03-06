const { urlencoded } = require('express')
const express = require('express')
const app = express()
const port = 3000
app.use(express.urlencoded({ extended: true }))

const mysql = require('mysql');
module.exports = Object.defineProperty(exports, "connection", {
    value: mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'corona_tracker'
    })
})

app.use((req, res, next) => {
    res.send('404 not found')
})

const provincesRoute = require('./routes/provinces')
app.use('/api/v1/provinces', provincesRoute)

app.listen(port, console.log('Initializing server...'))
    .on('error', (error) => {
        console.log('Error occured')
        process.exit(1)
    })
    .on('listening', () => console.log('Server running, please check localhost:3000'))