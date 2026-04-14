const cors = require("cors")
const express = require("express");
const server = express();

server.use(express.json());

const { Controller } = require("./controllers/controller")
const { Service } = require("./services/service")
const { UserRepository } = require("./repositories/userRepository")
const createRoutes = require("./routes/route")

function initializeDependencies() {
    const userRepo = new UserRepository()
    const service = new Service(userRepo)
    const controller = new Controller(service)

    return controller
}

const controller = initializeDependencies()

//Cors
server.use(cors())

// Routes
server.use("/", createRoutes(controller))

//start server
const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})