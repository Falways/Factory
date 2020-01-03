const io = require('socket.io-client');
// forceNew: false , not to reuse an existing connection
const socket = io('http://localhost:3000',{forceNew:false});

socket.on('connect_error',(err)=>{
    console.log('connect err, such as: ')
    console.log(err);
})

socket.on('connect_timeout',()=>{
    console.log('connect_timeout');
})

socket.on('connect', () => {
    console.log('socket id: '+socket.id); // true
    console.log('connect is ok: '+socket.connected); // true

    // send message
    socket.emit('msg', 'send some data', (data) => {
        console.log('socket server reply msg:'+data); // data will be 'woot'
    });
});


