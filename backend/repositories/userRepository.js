const pool = require("../database/db")

class UserRepository {
    async save(user) {
        const result = await pool.query(
            "INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING *",
            [user.email, user.password, user.role]
        )
        return result.rows[0]
    }

    async findAdll() {
        const result = await pool.query("SELECT * FROM users")
        return result.rows
    }


    async findById(userId) {
        const result = await pool.query(
            "SELECT * FROM users WHERE id = $1",
            [userId]
        )
        return result.rows[0]
    }

    async findByEmail(email) {
        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        )

        return result.rows[0]
    }
}

module.exports = { UserRepository }