const { json } = require('body-parser');
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'corona_tracker'
})

global.counter = 0
const addProvince = (req, res) => {
    const { name, recovered, death, positive } = req.body
    var url = '/api/v1/provinces/' + (global.counter + 1)
    connection.query(`INSERT INTO provinces(name, recovered, death, positive, url) VALUES ('${name}',${recovered},${death},${positive},'${url}')`, function (error, results, fields) {

        if (error || results == '') res.json({ status: false, message: 'Id not found' })
        else {
            res.json({ status: true, stored: req.body })
            global.counter++
        }
    })
}


const getProvinces = (req, res) => {
    connection.query('SELECT * FROM `provinces`', function (error, results, fields) {
        if (error) res.json({ status: false, message: 'Fetching data failed' })
        else {
            res.json({ status: true, totalData: results.length, message: "Fetching data success", data: results })
            global.counter = results.length
        }
    })
}

const getProvince = (req, res) => {
    var { id } = req.params
    connection.query(`SELECT * FROM provinces WHERE RIGHT(url, 1) = ${id}`, function (error, results, fields) {
        if (error || results == '') res.json({ status: false, message: 'Id not found' })
        else res.json({ status: true, stored: results })
    })
}

const updateProvince = (req, res) => {
    var { id, name, recovered, death, positive } = req.body
    connection.query(`SELECT * FROM provinces WHERE RIGHT(url, 1)=${id}`, (error, results, fields) => {
        global.before = results
        if (error || results == '') res.json({ status: false, message: 'Fetching data failed' })
        else {
            connection.query(`UPDATE provinces SET name='${name}',recovered='${recovered}',death='${death}',positive='${positive}' WHERE RIGHT(url, 1) = ${id}`)
            const after = [
                {
                    name: name,
                    recovered: recovered,
                    death: death,
                    positive: positive
                }
            ]

            res.json({ status: true, message: 'Updating data success', before: global.before, after: after })
        }
    })
}

const deleteProvince = (req, res) => {
    var { id } = req.body
    connection.query(`SELECT * FROM provinces WHERE RIGHT(url, 1)=${id}`, (error, results, fields) => {
        if (error) res.json({ status: false, message: 'Destroy data failed' })
        else if (results == '') res.json({ status: false, message: 'Id not found' })
        else {
            global.before = results
            connection.query(`DELETE FROM provinces WHERE RIGHT(url, 1) = ${id}`, (error, results, fields) => {
                if (error) res.json({ status: false, message: 'Destroy data failed' })
                else if (results == '') res.json({ status: false, message: 'Id not found' })
                else {
                    global.counter--
                    res.json({ status: true, message: 'Destroy data success', stored: global.before })
                }
            })
        }
    })

}

module.exports = {
    addProvince,
    getProvinces,
    getProvince,
    updateProvince,
    deleteProvince
}