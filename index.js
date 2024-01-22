import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import Connection from './database/db.js';
import Routes from './routes/Routes.js';
import http from "http";




dotenv.config();
const app = express();
const PORT = 8000;
const server=http.createServer(app)
const io = new Server(server, {
    cors: {
        origin:process.env.ORIGIN_URL
    }, 
})


let users = [];

const addUser = (userData, socketId) => {
    !users.some(user => user.sub === userData.sub) && users.push({ ...userData, socketId });
}

const removeUser = (socketId) => {
    users = users.filter(user => user.socketId !== socketId);
}

const getUser = (userId) => {
    return users.find(user => user.sub === userId);
}

io.on('connection',  (socket) => {
    console.log('user connected')

    //connect
    socket.on("addUsers", userData => {
        addUser(userData, socket.id);
        io.emit("getUsers", users);
    })

    //send message
    socket.on('sendMessage', (data) => {
        const user = getUser(data.receiverId);
        io.emit('getMessage', data)
    })

    //disconnect
    socket.on('disconnect', () => {
        console.log('user disconnected');
        removeUser(socket.id);
        io.emit('getUsers', users);
    })
})



const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;

Connection(username, password);
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use(express.static("./client/build"))
app.get("*",function(req,res){
    res.sendFile("index.html", { root: "client/build" });
  })
  app.use('/', Routes);
  server.listen(PORT, () => console.log(`Server is running successfully on PORT ${PORT}`));
