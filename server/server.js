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

    // socket.emit('newEmail',{
    //     from: 'ramy@test.com',
    //     text: 'Hey Whatsapp',
    //     createdAt: 123
    // });
    socket.emit('newMessage',{
        from:'fakhry',
        text:'Mantej ya paolo',
        createdAt: 123
    });
    socket.on('createMessage',(newMessage)=>{
        console.log('createdMessage',newMessage);
    });
    socket.on('disconnect',(socket)=>{
        console.log('User was disconnected');
    });
});



server.listen(port, () => {    //i am already calling creating server behind the scenes passing app as argument
    console.log(`Server is up on port ${port}`);
}); 