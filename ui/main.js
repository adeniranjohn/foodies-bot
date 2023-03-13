// var socket = io();

//   var messages = document.getElementById('messages');
//   var form = document.getElementById('form');
//   var input = document.getElementById('input');

//   form.addEventListener('submit', function(e) {
//     e.preventDefault();
//     if (input.value) {
//       socket.emit('chat message', input.value);
//       input.value = '';
//     }
//   });

//   socket.on('chat message', function(msg) {
//     var item = document.createElement('li');
//     item.textContent = msg;
//     messages.appendChild(item);
//     window.scrollTo(0, document.body.scrollHeight);
//   });

const socket = io();

const messages = document.querySelector('#messages');
const form = document.querySelector("#form");


const messageSender = (message) => {
    //create a div element
    console.log(message);
    const div = document.createElement("div");
    div.classList.add("message");
    //check if the message is from the bot or the user
    if(message.sender === "bot"){
    div.innerHTML = `bot: ${message.message}`}
    else{
    div.innerHTML = `user: ${message.message}`}
    //append the div to the messages div
    messages.appendChild(div);
  }

//listen for the chat message event from the server
socket.on("chat message", (message) => {
  messageSender(message);
});

//attach an event listener to the form
form.addEventListener("submit", (e) => {
  //prevent the default behaviour
  e.preventDefault();
  //get the message from the input
  const message = e.target.elements["message-input"].value;
  //sends the message to the server
  socket.emit("chat message", message);
  //clear the input field
  e.target.elements["message-input"].message.value = "";
  e.target.elements["message-input"].focus();
});

