const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { OAuth2Client } = require("google-auth-library")

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

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

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        )
        
        return token
    }

    async loginWithGoogle(credential) {
        if (!credential) {
            throw new Error("Google credential is required")
        }

        if (!process.env.GOOGLE_CLIENT_ID) {
            throw new Error("GOOGLE_CLIENT_ID is not configured")
        }

        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID
        })

        const payload = ticket.getPayload()

        if (!payload.email || !payload.email_verified) {
            throw new Error("Google email is not verified")
        }

        const googleUser = {
            email: payload.email,
            provider: "google",
            provider_id: payload.sub,
            name: payload.name,
            avatar_url: payload.picture,
            role: "user"
        }

        let user = await this.userRepository.findByEmail(googleUser.email)

        if (!user) {
            user = await this.userRepository.saveSocialUser(googleUser)
        } else if (user.provider !== "google" || user.provider_id !== googleUser.provider_id) {
            user = await this.userRepository.updateSocialUser(user.id, googleUser)
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
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

    async updateCartItemQuantity(cartItemId, quantity) {
        if (quantity <= 0) {
            return await this.productRepository.deleteItem(cartItemId)
        }
        return await this.productRepository.updateCartItemQuantity(cartItemId, quantity)
    }

    async deleteItem(cartItemId) {
        return await this.productRepository.deleteItem(cartItemId)
    }

    async createOrder(userId) {
        const cartItems = await this.productRepository.getCartItems(userId)

        if (!cartItems.length) {
            throw new Error("Cart is empty")
        }

        const total = cartItems.reduce(
            (sum, item) => sum + item.price * item.quantity, 0
        )

        const order = await this.productRepository.createOrder(userId, total) 

        for (const item of cartItems) {
            await this.productRepository.createOrderItem(
                order.id, item.product_id, item.quantity, item.price
            )
        }

        await this.productRepository.clearCart(userId)

        return order
    }
}

module.exports = { Service }
