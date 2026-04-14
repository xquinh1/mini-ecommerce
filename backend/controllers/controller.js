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

}

module.exports = { Controller }