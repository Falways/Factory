let jwt = require('jwt-simple');
let moment = require('moment');
let router = require('express').Router();
var async = require('async');
let config = require('../config');

router.post('/eve_login', function (req, res, next) {
    let body = req.body;
    if (!body.username || !body.password || body.username != config.username || body.password != config.password) {
        res.code(400);
        res.json({message: 'forbid login'});
        return;
    }
    // 生成token返回给用户端
    let tokenExpires = parseInt(moment.valueOf()) + parseInt(config.jwt_expire);
    let token = jwt.decode({
        iss: 'MS',
        username:config.username,
        exp: tokenExpires,
        sessionId:Math.random().toString().substr(2),
    },config.jwt_secret);
    res.code(200);
    res.send({message:'success',token:token});
})

router.post('/eve_board',function (req, res, next) {
    let body = req.body;
    try {
        let token = jwt.decode(req.headers.authorization, config.jwt_secret);
        if (token.exp < moment().valueOf()){
            res.code(400);
            res.json({message: 'token expire'});
            return;
        }
        // 处理业务

    }catch (e) {
        res.code(400);
        res.json({message: 'invalid token'});
    }

})

