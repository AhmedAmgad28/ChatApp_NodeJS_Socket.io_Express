const socket = io('ws://localhost:3500')

const activity = document.querySelector('.activity')
const msgInput = document.querySelector('input')

function sendMessage(e) {
    e.preventDefault()
    if (msgInput.value) {
        socket.emit('message', msgInput.value)
        msgInput.value = ""
    }
    msgInput.focus()
}

document.querySelector('form').addEventListener('submit', sendMessage)

let i = 1; // Initialize i

// Emit setUserName event with custom name
let username = `user${i}`;
socket.emit('setUserName', username);


// Listen for messages 
socket.on("message", (data) => {
    activity.textContent = ""
    const li = document.createElement('li')
    li.textContent = data
    document.querySelector('ul').appendChild(li)
})

msgInput.addEventListener('keypress', () => {
    socket.emit('activity', socket.id.substring(0, 5))
})

let activityTimer;
socket.on("activity", (username) => {
    activity.textContent = `${username} is typing...`

    // Clear after 3 seconds 
    clearTimeout(activityTimer)
    activityTimer = setTimeout(() => {
        activity.textContent = ""
    }, 3000)
})
i++; // Increment i