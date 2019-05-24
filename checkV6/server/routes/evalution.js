let jwt = require('jwt-simple');
let moment = require('moment');
let router = require('express').Router();
var async = require('async');
let config = require('../config');
let v46 = require('./index').checkNormalV46;
let NAT = require('../utils/nat');

router.post('/eve_login', function (req, res, next) {
    let body = req.body;
    if (!body.username || !body.password || body.username != config.username || body.password != config.password) {
        res.status(400);
        res.json({message: 'forbid login'});
        return;
    }
    // 生成token返回给用户端
    let tokenExpires = parseInt(moment().valueOf()) + parseInt(config.jwt_expire);
    let token = jwt.encode({
        iss: 'MS',
        username: config.username,
        exp: tokenExpires,
        sessionId: Math.random().toString().substr(2),
    }, config.jwt_secret);
    res.json({message: 'success', token: token});
})

router.get('/eve_board', function (req, res, next) {
    let body = req.query;
    try {
        let token = jwt.decode(req.headers.authorization, config.jwt_secret);
        if (token.exp < moment().valueOf()) {
            res.status(400);
            // token expire
            res.json({message: '请重新登录'});
            return;
        }
        // 处理业务
        let reg = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}(:\d+\/)?$/gi;
        let domain = body.url.replace(/(http|https):\/\//gi,'');
        if (!reg.test(domain)) {
            res.status(500)
            res.json({state: false, message: '域名不合法'})
            return;
        }
        // 测试先回客户端假数据
        /**
         * v6addr: '240e:ff:9000:1100::402',
         supportV6: true,
         supportV4: true,
         v4addr: '119.29.239.72',
         v4http: 'success',
         score: 60,
         v4https: 'err_url',
         v6http: 'err_url',
         v6https: 'err_url',
         systemError: false
         */
        let mockData = {
            v6addr: '240e:ff:9000:1100::402',
            supportV6: true,
            supportV4: true,
            v4addr: '119.29.239.72',
            v4http: 'success',
            score: 60,
            v4https: 'err_url',
            v6http: 'err_url',
            v6https: 'err_url'
        };
        res.json(mockData)
        // 获取监测是v4(6)http(s)情况
        /*v46(domain,async function (finalSend) {
            if (finalSend.systemError==true){
                res.status(500)
                res.json({state:false,message:'系统错误！'})
                return;
            }
            if (finalSend.v4https!=='success' && finalSend.v4http!=='success'){
                res.status(400);
                res.json({state:false,message:"不合法的域名"})
                return;
            }
            // 消息队列调python取值
            await NAT.natPublish(domain)
            await NAT.natSubscriber(function (state,data) {
                if (!state){
                    res.status(500)
                    res.json({state:false,message:'系统错误！'})
                    return;
                }
                // 返回客户端数据

            })
        })*/

    } catch (e) {
        res.status(400);
        res.json({message: 'invalid token'});
    }

})

module.exports = router;
