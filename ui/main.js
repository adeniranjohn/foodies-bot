const socket = io();

const messages = document.querySelector('#messages');
const form = document.querySelector("form#form");
const chat_input = document.querySelector('#chat_input');
const send_btn = document.querySelector('#send_btn');

messages.scrollTop = messages.scrollHeight - messages.clientHeight;

const messageSender = (message) => {

    const div = document.createElement("div");
    div.classList.add("message");
   
    if(message.sender === "bot"){
    div.innerHTML = `
    <span class="sender"><img src="https://img.icons8.com/dusk/64/null/bot--v1.png" width="30"/>
    </span>
    <span class="message">${message.message}</span>`}
    else{
    div.classList.add("right")
    div.innerHTML = `<span class="sender">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-user"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></span>
    <span>
    <span class="message">${message.message}</span>`}
    //append the div to the messages div
    messages.appendChild(div);
    
  }

//listen for the chat message event from the server
socket.on("chat message", (message) => {
  messageSender(message);
  chat_input.focus();
});

//attach an event listener to the form
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = chat_input.value;
  socket.emit("chat message", message);
  chat_input.value = "";
  chat_input.focus();
});

