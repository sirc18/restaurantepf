//Cargo los modulos necesarios
//cargo el modulo de Express para crear el servidor
//cargo el modulo cors para permitir la comunicacion entre el servidor y el frontend
//cargo el modulo de mysql para conectar con la base de datos
//cargo el modulo de dotenv para cargar las variables de entorno desde un archivo .env



const express = require('express')
const cors = require('cors')
const mysql = require('mysql2')
require('dotenv').config()
// creo una instancia de Express que es mi servidor web,como nginx o apache pero en Node.js
const app = express()
//configuro CORS para permitir solicitudes desde el fronted
app.use(cors())
const port = 3000
let db

//
function connectWithRetry() {
  db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  })

  // Attempt to connect
  db.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err)
      // Retry after 5 seconds
      console.log('Retrying in 5 seconds...')
      setTimeout(connectWithRetry, 5000)
    } else {
      console.log('Connected to MySQL database')
    }
  })
}

// Start the connection with retries
connectWithRetry()

// Define your endpoints

// Get all categories
app.get('/categories', (req, res) => {
  db.query('SELECT * FROM categorias', (err, results) => {
    if (err) {
      console.error('Error executing query:', err)
      res.status(500).json({ error: 'Internal Server Error' })
    } else {
      res.json(results)
    }
  })
})

// Get all restaurants
app.get('/restaurants', (req, res) => {
  db.query('SELECT * FROM restaurantes', (err, results) => {
    if (err) {
      console.error('Error executing query:', err)
      res.status(500).json({ error: 'Internal Server Error' })
    } else {
      res.json(results)
    }
  })
})

// Get all dishes
app.get('/dishes', (req, res) => {
  db.query('SELECT * FROM platos', (err, results) => {
    if (err) {
      console.error('Error executing query:', err)
      res.status(500).json({ error: 'Internal Server Error' })
    } else {
      res.json(results)
    }
  })
})

// Get all customers
app.get('/customers', (req, res) => {
  db.query('SELECT * FROM clientes', (err, results) => {
    if (err) {
      console.error('Error executing query:', err)
      res.status(500).json({ error: 'Internal Server Error' })
    } else {
      res.json(results)
    }
  })
})

// Get all orders
app.get('/orders', (req, res) => {
  db.query('SELECT * FROM pedidos', (err, results) => {
    if (err) {
      console.error('Error executing query:', err)
      res.status(500).json({ error: 'Internal Server Error' })
    } else {
      res.json(results)
    }
  })
})

// Get all dishes for a specific order
app.get('/order/:orderId/dishes', (req, res) => {
  const orderId = req.params.orderId
  db.query(
    'SELECT pl.platoID, pl.plato, pl.descripcion, pl.precio, pp.cantidad FROM platospedidos pp JOIN platos pl ON pp.platoID = pl.platoID WHERE pp.pedidoID = ?',
    [orderId],
    (err, results) => {
      if (err) {
        console.error('Error executing query:', err)
        res.status(500).json({ error: 'Internal Server Error' })
      } else {
        res.json(results)
      }
    }
  )
})

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
