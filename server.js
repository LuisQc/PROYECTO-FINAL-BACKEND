// Definitions and imports
const express = require('express')
const app = express()
const routerProducts = require('./middlewares/routerProducts').router
const routerCart = require('./middlewares/routerCart').router

// Server config
const PORT = process.env.PORT || 8080
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Router Products configuration
app.use('/api/productos', routerProducts)

// Router Cart configuration
app.use('/api/carrito', routerCart)

// 404 error
app.use((req, res, next) => {
    const response = {
        error: -2,
        descripcion: `${req.url} ${req.method} no implementado`
    }
    res.status(404).json(response)
})

// Server start
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

server.on('error', (err) => {
    console.log(`Error: ${err}`)
})