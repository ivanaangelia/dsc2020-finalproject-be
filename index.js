const mysql = require('mysql');
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'corona_tracker'
})

global.counter = 0

app.listen(port, (err) => {
  if(err) console.log(err)
})

app.get('/', (req, res) => {
  connection.query('SELECT * FROM `provinces`', function (error, results, fields) {
    if(error) console.log(error)
    else {
      res.json({status: true, totalData: results.length, message: "Fetching data success", data:results})
      global.counter = results.length
    }
  })
})

app.get('/:id', (req, res) => {
  var {id} = req.params
  
  connection.query(`SELECT * FROM provinces WHERE RIGHT(url, 1) = ${id}`, function (error, results, fields) {
  
  if (error || results == '') res.json({status: false, message: 'Id not found'})
  else res.json({status: true, stored: results})
  })
})

app.post('/', (req, res) => {
  const {name, recovered, death, positive} = req.body
  var url = '/api/v1/provinces/' + (global.counter + 1)
  connection.query(`INSERT INTO provinces(name, recovered, death, positive, url) VALUES ('${name}',${recovered},${death},${positive},'${url}')`, function (error, results, fields) {
  
  if (error || results == '') res.json({status: false, message: 'Id not found'})
  else {
    res.json({status: true, stored: req.body})
    global.counter++
  }
  })
})

app.put('/', (req, res) => {
  var {id, name, recovered, death, positive} = req.body
  console.log(id)
  connection.query(`SELECT * FROM provinces`, (error, results, fields) => {
      if(error || results == '') console.log('Fetching data failed') 
      else {
          id--
          //console.log(results[id].name) //doesnt work
          //console.log(results[3].name) //works
          
          global.before = [
          {
              //name: results[id].name,
              //recovered: results[id].recovered,
              //death: results[id].death,
              //positive: results[id].positive
          }
          ]
          id++
          connection.query(`UPDATE provinces SET name='${name}',recovered='${recovered}',death='${death}',positive='${positive}' WHERE RIGHT(url, 1) = ${id}`)
          const after = [
              {
              name: name,
              recovered: recovered,
              death: death,
              positive: positive
              }
          ]

          res.json({status: true, message: 'Updating data success', before: global.before, after: after})
      }
  }) 
})

app.delete('/', (req, res) => {
  var {id} = req.body
  connection.query(`DELETE FROM provinces WHERE RIGHT(url, 1) = ${id}`, (error, results, fields) => {
    if(error) res.json({status: false, message:'Destroy data failed'})
    else if(results == '') res.json({status: false, message: 'Id not found'})
    else {
      id--
      const province = [
        {
          /*name: results[id].name,
          recovered: results[id].recovered,
          death: results[id].death,
          positive: results[id].positive*/
        }
      ]
    res.json({status: true, message: 'Destroy data success', stored: province})
    global.counter--
    }
  })
})