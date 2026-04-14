const jwt = require("jsonwebtoken")

function authMiddleware(req, res , next) {
    const authHeader = req.header.authorization

    if (!authHeader) {
        return res.status(401).json( { error: "No token" } )
    }
    
    const token = authHeader.split(" ")[1]

    try {
        const decoded = jwt.verify(token, "secret_key")

        req.user = decoded

        next()
    } catch (err) {
        console.log("jwt error:", err.message)
        res.status(401).json( { error: "Invalid token" } )
    }
}

module.exports = { authMiddleware }