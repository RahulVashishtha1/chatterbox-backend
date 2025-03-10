const app = require("./app")
const dotenv = require("dotenv")
dotenv.config({path: "./config.env"})

const mongoose = require("mongoose"); 

const http = require("http"); //http comes built-in with nodejs
const server = http.createServer()


const PORT = process.env.PORT || process.env.API_PORT;

console.log(process.env.MONGO_URI)



mongoose.connect(process.env.MONGO_URI).then(() => {
    server.listen(PORT, () => {
        console.log(`Server is listeneing on ${PORT}`)
    })
}).catch((err)=>{
    console.log("database connection failed. Server not started")
    console.log(error)
})

