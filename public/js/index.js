let socket = io();

socket.on('connect', function (){
    console.log('Connected to server');
    
    //  socket.emit('createMessage',{
    //     from:'rambo',
    //     text:'Hey this is rambo'
    // });
});

socket.on('disconnect',function (){
    console.log('Disconnected from server');
});

socket.on('newMessage',function(message){
    // console.log('New message',message);
    let formattedTime = moment(message.createdAt).format('h:mm a');
    // let li = jQuery('<li></li>');
    // li.text(`${message.from} ${formattedTime}: ${message.text}`);
 
    // jQuery('#messages').append(li);
    let template = jQuery('#message-template').html();
    let html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    });

    jQuery('#messages').append(html);
});

socket.on('newLocationMessage',function(message){
    let formattedTime = moment(message.createdAt).format('h:mm a');
    // let li = jQuery('<li></li>');
    // let a = jQuery('<a target="_blank">My current location</a>'); 
    //                         //tells browser to open the link in new tab

    // li.text(`${message.from} ${formattedTime} : `);
    // a.attr('href',message.url);
    // li.append(a);
    // jQuery('#messages').append(li);

    let template = jQuery('#location-message-template').html();
    let html = Mustache.render(template, {
        from: message.from,
        createdAt: formattedTime,
        url: message.url
    });

    jQuery('#messages').append(html);

});

jQuery('#message-form').on('submit', function(e){
    e.preventDefault();
    let msgTxtBox = jQuery('[name=message]');
    socket.emit('createMessage',{
        from: 'User',
        text: msgTxtBox.val()
    },function(){
        msgTxtBox.val('');
    });
});


let locationButton = jQuery('#send-location');
locationButton.on('click',function(){
    if (!navigator.geolocation){
         return alert('Geolocation not supported by your browser');
    }
    locationButton.attr('disabled','disabled').text('Sending locartion ...');
    navigator.geolocation.getCurrentPosition(function ( position ){
        locationButton.removeAttr('disabled').text('Send location');
        socket.emit('createLocationMessage',{
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    },function(){ //is fired if someone tried to fetch location but clicks deny
        locationButton.removeAttr('disabled').text('Send location');           
        alert('Unable to fetch location.');
    })
});