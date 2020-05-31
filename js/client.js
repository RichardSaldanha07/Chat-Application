const socket = io('http://localhost:8000')

// GET the DOM elements in the respective JS variables
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container")

//Audio that will play on receiving the messages
var audio = new Audio('notify.mp3');

// Function that will append the events executed information to the container

const append = (message, position)=>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position == 'left'){
        audio.play();
    }
    
}


// This code will ask the user to enter their name in order to join the chat application and let the server know
const name = prompt("Enter your name to join");
socket.emit('new-user-joined', name);

// If the new user joins, receive the event from the server
socket.on('user-joined', name =>{
    append(`${name} joined the chat`, 'right')
})

// If the server sends a message we receive it
socket.on('receive', data =>{
    append(`${data.name}: ${data.message}`, 'left')
})

// If the user leaves the chat application then inform the server about it and append the information to the container
socket.on('left', name =>{
    append(`${name} left the chat`, 'right')
})

// Once the form is submitted we then send the message to the server about it.
form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = ''

}) 