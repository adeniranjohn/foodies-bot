const express = require('express');
const { Server } = require("socket.io");
const path = require("path");
const http = require("http");
const session = require("express-session");
const data = require('./data/menu.json')




const app = express();

app.use(express.static(path.join(__dirname, "ui")));

//session configuration
const sessionMiddleware = session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        //set expiry time for session to 7 days
        maxAge: 1000 * 60 * 604* 24,
    },
});


const server = http.createServer(app);
const io = new Server(server);

//using the session middleware
app.use(sessionMiddleware);
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})
io.engine.use(sessionMiddleware);

//listening for user connection
io.on("connection", (socket) => {
    console.log("a user connected");
    const session = socket.request.session;
    const sessionId = session.id;
    socket.join(sessionId);

  io.to(sessionId).emit("chat message", data.welcome_message);
  io.to(sessionId).emit("chat message", data.first_menu);


  //listen for the chat message event from the client
  socket.on("chat message", (message) => {
    console.log(message)
    //output the user message to the DOM by emitting the chat message event to the client
    io.to(sessionId).emit("chat message", {sender: "user", message});
     //logic to check the user's progress
     let food = getFood(message);
     let progress = 1;
    console.log(progress);
    switch(progress){

      case 0:

        io.to(sessionId).emit("chat message", data.first_menu);
        progress = 1;
        break;
      case 1:

        let botresponse = "";
        if(message === "1"){
          botresponse = "You selected option 1 <br> here is the menu <br/>";
          let i = 0;
          data.menu.forEach((item) => { 
          i++;
          botresponse +=`${i}  ${item.food} <br/>`} );  

        }else if(message === "99"){
          botresponse = "You selected option 2 <br> checkout your order";

        }else if (message === "98"){
          botresponse = "You selected option 3 <br> here is your order history";
        }else if(message === "97"){
          botresponse = "You selected option 4 <br>order canceled";
        }else{
          //if the user enters an invalid option, we send the default message
          console.log(progress);
          console.log(message);
          botresponse = `Invalid option. Kindly follow the below instruction<br> ` + data.first_menu.message;
   
          //set the progess as 1 until the proper input is recieved
          progress = 1;
          io.to(sessionId).emit("chat message", {sender: "bot", message: botresponse});
          return
        }
        io.to(sessionId).emit("chat message", {sender: "bot", message: botresponse});

        //reset the progress
        progress = 0;
        break;
        console.log(food);
    }


  });
});


function getFood(message){
  return data.menu[message];
}
//starting the server
server.listen(3000, () => {
    console.log("listening on :3000");
});