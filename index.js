const express = require('express');
const { Server } = require("socket.io");
const path = require("path");
const http = require("http");
const session = require("express-session")



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
//More Code To Be Added Here
});

//starting the server
server.listen(3000, () => {
    console.log("listening on :3000");
});