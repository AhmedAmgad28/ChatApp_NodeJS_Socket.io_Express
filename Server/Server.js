import express from 'express'
import { Server } from "socket.io"
import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PORT = process.env.PORT || 3500
const app = express()

app.use(express.static(path.join(__dirname, "/Public")))

app.get(["/","/index.html","/Public/index.html"],(req,res)=>{
    res.sendFile(path.join(__dirname + "/Public/index.html"))
})

app.get(["/script.js","/Public/script.js","/Server/Public/script.js"],(req,res)=>{
    res.sendFile(path.join(__dirname + "/Public/script.js"))
})

const expressServer = app.listen(PORT, () => {
    console.log(`listening on http://localhost:${PORT}`)
})

const io = new Server(expressServer);

io.on('connection', socket => {
    // Upon connection - only to user 
    socket.emit('message', "Welcome to Chat App!")

    // Upon connection - to all others 
    socket.broadcast.emit('message', `User ${socket.id.substring(0, 5)} connected`)

    // Listening for a message event 
    socket.on('message', data => {
        io.emit('message', `${socket.id.substring(0, 5)}: ${data}`)
    })

    // When user disconnects - to all others 
    socket.on('disconnect', () => {
        socket.broadcast.emit('message', `User ${socket.id.substring(0, 5)} disconnected`)
    })

    // Listen for activity 
    socket.on('activity', (name) => {
        socket.broadcast.emit('activity', name)
    })
})