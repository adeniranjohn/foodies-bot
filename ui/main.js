const socket = io();

const messages = document.querySelector('#messages');
const form = document.querySelector("form#form");
const chat_input = document.querySelector('#chat_input');
const send_btn = document.querySelector('#send_btn');

const messageSender = (message) => {
    //create a div element
    console.log(message);
    const div = document.createElement("div");
    div.classList.add("message");
    //check if the message is from the bot or the user
    if(message.sender === "bot"){
    div.innerHTML = `<span class="sender">bot</span><span class="message">${message.message}</span>`}
    else{
    div.classList.add("right")
    div.innerHTML = `<span class="sender">User</span><span class="message">${message.message}</span> <br/>`}
    //append the div to the messages div
    messages.appendChild(div);
  }

//listen for the chat message event from the server
socket.on("chat message", (message) => {
  messageSender(message);
});

//attach an event listener to the form
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = chat_input.value;
  socket.emit("chat message", message);
  chat_input.value = "";
  chat_input.focus();
});

