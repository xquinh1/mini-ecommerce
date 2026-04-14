const bcrypt = require("bcrypt")

class Service {
    constructor(userRepository) {
        this.userRepository = userRepository 
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
        return this.userRepository.findAll()
    }

    async getUserById(userId) {
        return this.userRepository.findById(userId)
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
            { userId: user.id, role: user.role },
            "secret_key",
            { expiresIn: "1h" }
        )
        
        return token
    }
}

module.exports = { Service }