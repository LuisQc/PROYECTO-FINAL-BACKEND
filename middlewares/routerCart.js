const express = require('express')
const router = express.Router()
const Container = require('../controllers/container')
const FILE_CART = 'cart.json'
const FILE_PRD = 'products.json'
const container = new Container(FILE_CART)
const containerProducts = new Container(FILE_PRD)

// Cart routes
router.post('/', (req, res) => {
    const cart = {
        timestamp: Date.now(),
        products: []
    }
    container.save(cart)
        .then (data => { res.json(data) })
})

router.delete('/:id', (req, res) => {
    let { id } = req.params
    id = parseInt(id)
    container.deleteById(id)
        .then (data => { res.json(data) })
})

router.get('/:id/productos', (req, res) => {
    let { id } = req.params
    id = parseInt(id)
    container.getById(id)
        .then (data => { res.json(data) })
})

router.post('/:id/productos', (req, res) => {
    let { id } = req.params
    let idProduct = req.body.idProduct
    id = parseInt(id)
    idProduct = parseInt(idProduct)
    containerProducts.getById(idProduct)
        .then (product => {
            container.getById(id)
                .then (cart => {
                    cart.products.push(product)
                    cart.timestamp = Date.now()
                    container.updateById(id, cart)
                        .then (data => { res.json(data) })
                })
                .catch (err => { res.json({ error: err }) })
        })
        .catch (err => { res.json({ error: err }) })
})

router.delete('/:id/productos/:id_prod', (req, res) => {
    let { id, id_prod } = req.params
    id = parseInt(id)
    id_prod = parseInt(id_prod)
    container.getById(id)
        .then (cart => {
            const prevCount = cart.products.length
            cart.products = cart.products.filter(product => product.id !== id_prod)
            const newCount = cart.products.length
            cart.timestamp = Date.now()
            container.updateById(id, cart)
                .then (data => {
                    if (prevCount > newCount) { 
                        res.json(data)
                    } else {
                        res.json({ error: 'product not found' })
                    } 
                })
                .catch (err => { res.json({ error: err }) })
        })
        .catch (err => { res.json({ error: err }) })
})

// Export router
module.exports = {
    router: router
}