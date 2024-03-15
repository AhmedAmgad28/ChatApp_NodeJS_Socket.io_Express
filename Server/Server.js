import express from 'express'
import { Server } from "socket.io"
import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PORT = process.env.PORT || 3500
const app = express()

app.use(express.static(path.join(__dirname, "public")))

app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname + "/Public/index.html"))
})

const expressServer = app.listen(PORT, () => {
    console.log(`listening on http://localhost:${PORT}`)
})

const io = new Server(expressServer);

const userNames = {}; // Store custom names for each socket ID

io.on('connection', socket => {
    // Welcome message - only to the user
    socket.emit('message', 'Welcome to Chat App!');

    // New user connected - to all others
    socket.broadcast.emit('message', `${getUserName(socket)} connected`);

    // Listening for a message event
    socket.on('message', data => {
        io.emit('message', `${getUserName(socket)}: ${data}`);
    });

    // When user disconnects - to all others
    socket.on('disconnect', () => {
        socket.broadcast.emit('message', `${getUserName(socket)} disconnected`);
    });

    // Listen for activity (Typing)
    socket.on('activity', name => {
        socket.broadcast.emit('activity', name);
    });

    // Set custom name for the user
    socket.on('setUserName', name => {
        userNames[socket.id] = name;
    });
});

function getUserName(socket) {
    // Check if a custom name is set for the socket ID
    if (userNames[socket.id]) {
        return userNames[socket.id];
    }
    return `User ${socket.id.substring(0, 5)}`;
}