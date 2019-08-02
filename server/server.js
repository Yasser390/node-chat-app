const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname,'../public'); 
const port = process.env.PORT || 3000;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath)); // configure middleware

io.on('connection',(socket)=>{
    console.log('New user connceted');

    socket.on('disconnect',(socket)=>{
        console.log('User was disconnected');
    });
});



server.listen(port, () => {    //i am already calling creating server behind the scenes passing app as argument
    console.log(`Server is up on port ${port}`);
}); 