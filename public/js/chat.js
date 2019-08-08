let socket = io();

function scrollToBottom(){
    //selectors
    let messages = jQuery('#messages');
    let newMessage = messages.children('li:last-child');
    //heights
    let clientHeight = messages.prop('clientHeight');
    let scrollTop = messages.prop('scrollTop');
    let scrollHeight = messages.prop('scrollHeight');
    let newMessageHeight = newMessage.innerHeight();
    let lastMessageHeight = newMessage.prev().innerHeight();

    if(clientHeight + scrollTop +newMessageHeight +lastMessageHeight >= scrollHeight){
        messages.scrollTop(scrollHeight);
    };
};
socket.on('connect', function (){
    //console.log('Connected to server');
    let params = jQuery.deparam(window.location.search);
    
    socket.emit('join',params, function(err){
        if (err) {
            alert(err);
            window.location.href = '/';
        }
        else{
            console.log('No error');
        }
    });
});

socket.on('disconnect',function (){
    console.log('Disconnected from server');
});
socket.on('updateUserList',function(users){
    var ol = jQuery('<ol></ol>');
    users.forEach(function(user) {
        ol.append(jQuery('<li></li>').text(user));
    });

    jQuery('#users').html(ol);
    console.log('Users List: ',users);
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
    scrollToBottom();
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
    scrollToBottom();

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
    });
});