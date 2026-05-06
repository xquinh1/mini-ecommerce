require("dotenv").config()

const cors = require("cors")
const express = require("express");
const server = express();

server.use(express.json());

const { Controller } = require("./controllers/controller")
const { Service } = require("./services/service")
const { UserRepository } = require("./repositories/userRepository")
const { ProductRepository } = require("./repositories/productRepository")
const createRoutes = require("./routes/route")

function initializeDependencies() {
    const userRepo = new UserRepository()
    const productRepo = new ProductRepository()
    const service = new Service(userRepo, productRepo)
    const controller = new Controller(service)

    return controller
}

const controller = initializeDependencies()

//Cors
const allowedOrigins = [
    "https://mini-ecommerce-kappa-ten.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000",
]

server.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true)
        }

        return callback(new Error("Not allowed by CORS"))
    }
  }))

// Routes
server.use("/", createRoutes(controller))

//start server
const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
