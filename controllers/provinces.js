var app = require('../app')
conn = app.connection
const { json } = require('body-parser');

global.counter = 0
global.before = []

const addProvince = (req, res) => {
    conn.query('SELECT * FROM `provinces` WHERE isDeleted = 0', function (error, results, fields) {
        if (error || results == '') res.json({ status: false, message: 'Fetching data failed' })
        else {
            global.counter = results.length
            const { name, recovered, death, positive } = req.body
            var url = '/api/v1/provinces/' + (global.counter + 1)
            conn.query(`INSERT INTO provinces(name, recovered, death, positive, url) VALUES ('${name}',${recovered},${death},${positive},'${url}')`, function (error, results, fields) {
                if (error || results == '') res.json({ status: false, message: 'Storing data failed' })
                else {
                    res.json({ status: true, stored: req.body })
                    global.counter++
                }
            })
        }
    })
}

const getProvinces = (req, res) => {
    conn.query('SELECT * FROM `provinces` WHERE isDeleted = 0', function (error, results, fields) {
        if (error || results == '') res.json({ status: false, message: 'Fetching data failed' })
        else {
            results = JSON.parse(JSON.stringify(results))
            global.before = []
            for (let i = 0; i < results.length; i++) {
                global.before.push(
                    {
                        name: results[i].name,
                        recovered: results[i].recovered,
                        death: results[i].death,
                        positive: results[i].positive
                    }
                )
            }
            res.json({ status: true, totalData: results.length, message: 'Fetching data success', data: global.before })
            global.counter = results.length
        }
    })
}

const getProvince = (req, res) => {
    var { id } = req.params
    conn.query(`SELECT * FROM provinces WHERE RIGHT(url, 1) = ? AND isDeleted = 0`, [id], function (error, results, fields) {
        if (error || results == '') res.json({ status: false, message: 'Id not found' })
        else {
            results = JSON.parse(JSON.stringify(results))
            global.before = [
                {
                    name: results[0].name,
                    recovered: results[0].recovered,
                    death: results[0].death,
                    positive: results[0].positive
                }
            ]
            res.json({ status: true, stored: global.before })
        }
    })
}

const updateProvince = (req, res) => {
    var { id, name, recovered, death, positive } = req.body
    conn.query(`SELECT * FROM provinces WHERE RIGHT(url, 1) = ? AND isDeleted = 0`, [id], (error, results, fields) => {
        if (error || results == '') res.json({ status: false, message: 'No Data' })
        else {
            results = JSON.parse(JSON.stringify(results))
            global.before = [
                {
                    name: results[0].name,
                    recovered: results[0].recovered,
                    death: results[0].death,
                    positive: results[0].positive
                }
            ]
            conn.query(`UPDATE provinces SET name = ?, recovered = ?, death = ?, positive = ? WHERE RIGHT(url, 1) = ? AND isDeleted = 0`, [name, recovered, death, positive, id], (error, results, fields) => {
                if (error) res.json({ status: false, message: 'Updating data failed' })
                else if (results == '') res.json({ status: false, message: 'Id not found' })
                else {
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
    })
}

const deleteProvince = (req, res) => {
    var { id } = req.body
    conn.query(`SELECT * FROM provinces WHERE RIGHT(url, 1) = ? AND isDeleted = 0`, [id], (error, results, fields) => {
        if (error || results == '') res.json({ status: false, message: 'No Data' })
        else {
            results = JSON.parse(JSON.stringify(results))
            global.before = [
                {
                    name: results[0].name,
                    recovered: results[0].recovered,
                    death: results[0].death,
                    positive: results[0].positive
                }
            ]
            conn.query(`UPDATE provinces SET isDeleted=1 WHERE RIGHT(url, 1) = ?`, [id], (error, results, fields) => {
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