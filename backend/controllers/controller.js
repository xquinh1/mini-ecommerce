class Controller {
    constructor(service) {
        this.service = service
    }

    createUser(user) {
        try {
            return this.service.createUser(user)
        } catch (err) {
            console.error("Create user error:", err.message)
        }
    }

    getUsers() {
        return this.service.getAll()
    }

    getUserById(userId) {
        return this.service.getUserById(userId)
    }

    async login(req, res) {
        try {
            const { email, password } = req.body
            const token = await this.service.login(email, password)
            res.json({ token })
        } catch (err) {
            res.status(400).json({ error: err.message })
        }
    }

    async loginWithGoogle(req, res) {
        try {
            const { credential } = req.body
            const token = await this.service.loginWithGoogle(credential)
            res.json({ token })
        } catch (err) {
            res.status(400).json({ error: err.message })
        }
    }

    getAllProduct() {
        return this.service.getAllProduct()
    }

    addToCart(userId, productId, quantity) {
        return this.service.addToCart(userId, productId, quantity)
    }

    async getCart(userId) {
        return await this.service.getCart(userId)
    }

    async updateCartItemQuantity(cartItemId, quantity) {
        return await this.service.updateCartItemQuantity(cartItemId, quantity)
    }

    async deleteItem(cartItemId) {
        return await this.service.deleteItem(cartItemId)
    }

    async createOrder(userId) {
        return await this.service.createOrder(userId)
    }

}

module.exports = { Controller }
