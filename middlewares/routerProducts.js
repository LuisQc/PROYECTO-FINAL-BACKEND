const express = require('express')
const router = express.Router()
const Container = require('../controllers/container')
const FILE_PRD = 'products.json'
const container = new Container(FILE_PRD)
const { isAuthenticated } = require('./auth')

// Products routes
router.get('/:id?', (req, res) => {
    let { id } = req.params
    id = parseInt(id)
    if (id) {
        container.getById(id)
            .then (data => { res.json(data) })
    } else {
        container.getAll()
            .then (data => { res.json(data) })
    }
})

// Requires authentication 'admin'
router.post('/', isAuthenticated, (req, res) => {
    const product = req.body
    if (product.nombre && product.descripcion && product.precio && product.stock) {
        product.timestamp = Date.now()
        product.precio = parseFloat(product.precio)
        product.stock = parseInt(product.stock)
        if (!product.foto) {
            product.foto = './assets/no-image.svg'
        }
        container.save(product)
            .then (data => { res.json(data) })
    } else {
        res.json({ error: 'missing fields' })
    }
})

router.put('/:id', isAuthenticated, (req, res) => {
    let { id } = req.params
    id = parseInt(id)
    const product = req.body
    if (product.nombre && product.descripcion && product.precio && product.stock) {
        product.timestamp = Date.now()
        product.precio = parseFloat(product.precio)
        product.stock = parseInt(product.stock)
        if (!product.foto) {
            product.foto = './assets/no-image.svg'
        }
        container.updateById(id, product)
            .then (data => { res.json(data) })
    } else {
        res.json({ error: 'missing fields' })
    }
})

router.delete('/:id', isAuthenticated, (req, res) => {
    let { id } = req.params
    id = parseInt(id)
    container.deleteById(id)
        .then (data => { res.json(data) })
})

// Export router
module.exports = {
    router: router
}