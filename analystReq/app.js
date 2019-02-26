let express = require('express');
let app = express();

app.get('/',(req,res)=>{
    res.send('你的源IP是：'+getClientIp(req));
})

let getClientIp = function (req) {
    let ip = req.headers['x-forwarded-for'] ||
        req.ip ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress || '';
    if (ip.split(',').length > 0) {
        ip = ip.split(',')[0];
    }
    return ip;
};

let server = app.listen('8080',() => {
    console.log("start server",'http://localhost:8080')
})