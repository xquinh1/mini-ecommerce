const bcrypt = require("bcrypt")

class Service {
    constructor(userRepository, productRepository) {
        this.userRepository = userRepository 
        this.productRepository = productRepository
    }

    async createUser(user) {
        if (!user.email || !user.email.includes("@") ) {
            throw new Error("Email require!!")
        }

        if (!user.role) {
            user.role = "user"
        }

        const newUser = this.userRepository.save(user)

        return await newUser
    }

    async getAll() {
        return await this.userRepository.findAll()
    }

    async getUserById(userId) {
        return await this.userRepository.findById(userId)
    }

    async login(email, password) {
        const user = await this.userRepository.findByEmail(email)

        if (!user) {
            throw new Error("User not found")
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            throw new Error("Wrong password")
        }

        const jwt = require("jsonwebtoken")

        const token = jwt.sign(
            { id: user.id, role: user.role },
            "secret_key",
            { expiresIn: "1h" }
        )
        
        return token
    }

    getAllProduct() {
        return this.productRepository.getAllProduct()
    }

    async addToCart(userId, productId, quantity) {
        let cart = await this.productRepository.getCartByUserId(userId)

        if (!cart) {
            cart = await this.productRepository.createCart(userId)
        }

        const item = await this.productRepository.getCartItem(cart.id, productId)

        if (item) {
            await this.productRepository.updateQuantity(item.id, quantity)
        } else {
            await this.productRepository.addItem(cart.id, productId, quantity)
        }
    }

    async getCart(userId) {
        return await this.productRepository.getCartItems(userId)
    }
}

module.exports = { Service }