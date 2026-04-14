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

    return router
}
