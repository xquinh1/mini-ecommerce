const pool = require("../database/db")

class UserRepository {
    async save(user) {
        const result = await pool.query(
            "INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING *",
            [user.email, user.password, user.role]
        )
        return result.rows[0]
    }

    async saveSocialUser(user) {
        const result = await pool.query(
            `INSERT INTO users (email, password, role, provider, provider_id, name, avatar_url)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`,
            [
                user.email,
                null,
                user.role || "user",
                user.provider,
                user.provider_id,
                user.name,
                user.avatar_url
            ]
        )
        return result.rows[0]
    }

    async updateSocialUser(userId, user) {
        const result = await pool.query(
            `UPDATE users
            SET provider = $1,
                provider_id = $2,
                name = COALESCE($3, name),
                avatar_url = COALESCE($4, avatar_url)
            WHERE id = $5
            RETURNING *`,
            [
                user.provider,
                user.provider_id,
                user.name,
                user.avatar_url,
                userId
            ]
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
