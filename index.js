const express = require("express");
const { Server } = require("socket.io");
const path = require("path");
const http = require("http");
const session = require("express-session");
const data = require("./data/menu.json");


const app = express();

app.use(express.static(path.join(__dirname, "ui")));

//session configuration
const sessionMiddleware = session({
  secret: "secret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 604 * 24,
  },
});

const server = http.createServer(app);
const io = new Server(server);

//using the session middleware
app.use(sessionMiddleware);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
io.engine.use(sessionMiddleware);

//listening for user connection
io.on("connection", (socket) => {
  console.log("a user connected");
  const session = socket.request.session;
  const sessionId = session.id;
  socket.join(sessionId);


  io.to(sessionId).emit("chat message", data.welcome_message);
  io.to(sessionId).emit("chat message", data.first_menu);
  
  let orders = [];
  //listen for the chat message event from the client
  socket.on("chat message", (message) => {

    console.log(message);
    //output the user message to the DOM by emitting the chat message event to the client
    io.to(sessionId).emit("chat message", { sender: "user", message });
    //logic to check the user's progress
    let progress = 1;



    switch (progress) {
      case 0:
        io.to(sessionId).emit("chat message", data.first_menu);
        progress = 1;
        break;
      case 1:
        let botresponse = "";
        switch (message) {
          case "1":
            let i = 1;
            botresponse = "You selected option 1, here is the menu <br/>";
            data.menu.forEach((item) => {
              i++;
              botresponse += `${i}  ${item.food} <br/>`;
            });
            botresponse +=
              `<br>99 Checkout order 
               <br>98 Order history
               <br>0  Cancel order`;
            break;
          case "2":
            botresponse = `You selected option ${message} <br/><strong>
                                    ${
                                      data.menu[message - 2].food
                                    } </strong> has been added to your order
                                    <br>Select 1 to View menu 
                                    <br>Select 99 to Checkout order 
                                    <br>Select 98 to see Order history 
                                    <br>Select 97 to see Current order 
                                    <br>Select 0 to Cancel order`;
                                    orders[orders.length] = data.menu[message - 2];

                                    
            break;

          case "3":
            botresponse = `You selected option ${message} <br/><strong>
                                    ${
                                      data.menu[message - 2].food
                                    } </strong> has been added to your order
                                    <br>Select 1 to View menu 
                                    <br>Select 99 to Checkout order 
                                    <br>Select 98 to see Order history 
                                    <br>Select 97 to see Current order 
                                    <br>Select 0 to Cancel order`;
                                    orders[orders.length] = data.menu[message - 2];

            break;
          case "4":
            botresponse = `You selected option ${message} <br/>
            <strong>
                ${data.menu[message - 2].food} </strong> has been added to your order
                <br>Select 1 to View menu 
                <br>Select 99 to Checkout order 
                <br>Select 98 to see Order history 
                <br>Select 97 to see Current order 
                <br>Select 0 to Cancel order`;

                orders[orders.length] = data.menu[message - 2];

            break;
          case "5":
            botresponse = `You selected option ${message} <br/>
            <strong>
                ${data.menu[message - 2].food}  </strong> has been added to your order
                <br>Select 1 to View menu 
                <br>Select 99 to Checkout order 
                <br>Select 98 to see Order history 
                <br>Select 97 to see Current order 
                <br>Select 0 to Cancel order`;
                orders[orders.length] = data.menu[message - 2];

            break;

          case "6":
            botresponse = `You selected option ${message} <br/>
            <strong>
                ${data.menu[message - 2].food} </strong> has been added to your order
                <br>Select 1 to View menu 
                <br>Select 99 to Checkout order 
                <br>Select 98 to see Order history 
                <br>Select 97 to see Current order 
                <br>Select 0 to Cancel order`;
                orders[orders.length] = data.menu[message - 2];

            break;

          case "7":
            botresponse = `You selected option ${message} <br/>
            <strong>
                ${data.menu[message - 2].food} </strong> has been added to your order
                <br>Select 1 to View menu 
                <br>Select 99 to Checkout order 
                <br>Select 98 to see Order history 
                <br>Select 97 to see Current order 
                <br>Select 0 to Cancel order`;
                orders[orders.length] = data.menu[message - 2];

            break;
          case "8":
            botresponse = `You selected option ${message} <br/><strong>
                ${data.menu[message - 2].food} </strong> has been added to your order
                <br>Select 1 to View menu 
                <br>Select 99 to Checkout order 
                <br>Select 98 to see Order history 
                <br>Select 97 to see Current order 
                <br>Select 0 to Cancel order`;
                orders[orders.length] = data.menu[message - 2];

            break;
          case "9":
            botresponse = `You selected option ${message} <br/>
            <strong>
                ${data.menu[message - 2].food} </strong> has been added to your order
                <br>Select 1 to View menu 
                <br>Select 99 to Checkout order 
                <br>Select 98 to see Order history 
                <br>Select 97 to see Current order 
                <br>Select 0 to Cancel order`;
                orders[orders.length] = data.menu[message - 2];

            break;

            case "97":
              botresponse = `You selected option ${message} to see current order<br/>
              <strong>
                  ${data.menu[message - 2].food} </strong> has been added to your order
                  <br>Select 1 to View menu 
                  <br>Select 99 to Checkout order 
                  <br>Select 98 to see Order history 
                  <br>Select 97 to see Current order 
                  <br>Select 0 to Cancel order`;
                  orders[orders.length] = data.menu[message - 2];
  
              break;
          case "98":
            botresponse =
              `You selected option ${message} <br /><strong> Order history </strong><br/>`;
              console.log(orders);
              orders.forEach((item) => {
                botresponse += `${item.food} at ${item.price}naira <br/>`
              });
              let total = orders.reduce((total, item) => item.price + total, 0);
              botresponse += `<br/>Total amount is <strong>${total}naira</strong>`;
            break;
          case "99":
            botresponse = `You selected option ${message} <br /> Checkout your order`;
            break;
          default: //if the user enters an invalid option, we send the default message
            console.log(progress);
            console.log(message);
            botresponse =
              `Invalid option. Kindly follow the below instruction<br> ` +
              data.first_menu.message;

            //set the progess as 1 until the proper input is recieved
            progress = 1;
            io.to(sessionId).emit("chat message", {
              sender: "bot",
              message: botresponse,
            });
            return;
        }
       
        io.to(sessionId).emit("chat message", {
          sender: "bot",
          message: botresponse,
        });

        //reset the progress
        progress = 0;
        break;
    }
  });
});

//starting the server
server.listen(3000, () => {
  console.log("listening on :3000");
});
