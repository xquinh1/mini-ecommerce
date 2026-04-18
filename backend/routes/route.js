const express = require("express")
const { authMiddleware } = require("../authMiddleware")
const router = express.Router()
const bcrypt = require("bcrypt")

module.exports = ( controller ) => {
    router.post("/signup", async (req, res) => {
        try {
            const { email, password, role } = req.body

            const hashedPassword = await bcrypt.hash(password, 10)

            const user = await controller.createUser( {
                email,
                password: hashedPassword,
                role } )
            res.status(201).json(user)
        } catch (err) {
            res.status(400).json({ error: err.message })
        }
    })

    router.post("/login", async (req, res) => {
        await controller.login(req, res)       
    })

    router.get("/products", async (req, res) => {
        try {
            const products = await controller.getAllProduct(req, res)
            res.status(201).json(products)
        } catch (err) {
            res.status(400).json({ error: err.message })
        }
    })

    router.post("/cart/add", authMiddleware, async (req, res) => {
        try {
            const userId = req.user.id
            const { product_id, quantity } = req.body

            await controller.addToCart(userId, product_id, quantity)

            res.status(201).json({ message: "Added to cart" })
        } catch (err) {
            res.status(400).json({ error: err.message })
        }
    })

    router.get("/cart", authMiddleware, async (req, res) => {
        try {
            const userId = req.user.id
            
            const cart = await controller.getCart(userId)

            res.status(201).json(cart)
        } catch (err) {
            res.status(400).json({ error: err.message })
        }
    })

    return router
}
