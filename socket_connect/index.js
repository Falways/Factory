const io = require('socket.io')();

io.on('connection', socket => {
    // 监听客户端发送的信息
    socket.on("msg", (message,fn) => {
        // 给客户端返回信息
        console.log('Server: I receive msg from socket client:'+message)
        fn("sendToClient: handshake success!");
    });
});
io.listen(3000);


