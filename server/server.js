const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const {generateMessage} = require('./utils/message');
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
    
    socket.emit('newMessage',generateMessage('Admin','Welcom User'));   
              //emits event to a single connection

    socket.broadcast.emit('newMessage',generateMessage('Admin','A new user joined ya boooo7a'));
            
        
    
    socket.on('createMessage',(message)=>{ 
        console.log('createdMessage',message);
        // io.emit('newMessage',{          //emits event to every connection
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // });
        socket.broadcast.emit('newMessage',generateMessage(message.from,message.text));
                       //send it to every connection except the sender
            
    });
    socket.on('disconnect',(socket)=>{
        console.log('User was disconnected');
    });
});



server.listen(port, () => {    //i am already calling creating server behind the scenes passing app as argument
    console.log(`Server is up on port ${port}`);
}); 