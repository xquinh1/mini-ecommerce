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
server.use(cors({
    origin: "https://mini-ecommerce-kappa-ten.vercel.app"
  }))

// Routes
server.use("/", createRoutes(controller))

//start server
const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})