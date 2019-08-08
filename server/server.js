const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const {generateMessage,generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');
const publicPath = path.join(__dirname,'../public'); 
const port = process.env.PORT || 3000;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);
let users = new Users();

app.use(express.static(publicPath)); // configure middleware

io.on('connection',(socket)=>{
    console.log('New user connceted');
    
    
    socket.on('join',(params,callback)=>{
        if(!isRealString(params.name) || !isRealString(params.room)){
            return callback('Name and room name are required');
        }
        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id,params.name,params.room);
        
        io.to(params.room).emit('updateUserList',users.getUserList(params.room)); 
        socket.emit('newMessage',generateMessage('Admin','Welcome to chat-app'));   
              //emits event to a single connection

        socket.broadcast.to(params.room).emit('newMessage',
                        generateMessage('Admin',`${params.name} joined ya boooo7a`));
        callback();
    });
    
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

    socket.on('disconnect',()=>{
        
        var user = users.removeUser(socket.id);
        
        if (user){
            io.to(user.room).emit('updateUserList',users.getUserList(user.room));
            io.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} has left`));
        }
    });
});



server.listen(port, () => {    //i am already calling creating server behind the scenes passing app as argument
    console.log(`Server is up on port ${port}`);
}); 