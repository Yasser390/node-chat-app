const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const {generateMessage,generateLocationMessage} = require('./utils/message');
const publicPath = path.join(__dirname,'../public'); 
const port = process.env.PORT || 3000;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath)); // configure middleware

io.on('connection',(socket)=>{
    console.log('New user connceted');
    socket.emit('newMessage',generateMessage('Admin','Welcom User'));   
              //emits event to a single connection

    socket.broadcast.emit('newMessage',generateMessage('Admin','A new user joined ya boooo7a'));
  
    socket.on('createMessage',(message, callback)=>{ 
        console.log('createdMessage',message);
        io.emit('newMessage',generateMessage(message.from,message.text));  
        callback();
                    //emits event to every connection

        //socket.broadcast.emit('newMessage',generateMessage(message.from,message.text));
                       //send it to every connection except the sender            
    });
    
    socket.on('createLocationMessage',(coords)=>{
        io.emit('newLocationMessage',generateLocationMessage
            ('Admin',coords.latitude, coords.longitude));
    });

    socket.on('disconnect',(socket)=>{
        console.log('User was disconnected');
    });
});



server.listen(port, () => {    //i am already calling creating server behind the scenes passing app as argument
    console.log(`Server is up on port ${port}`);
}); 