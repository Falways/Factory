let jwt = require('jwt-simple');
let moment = require('moment');
let router = require('express').Router();
let async = require('async');
let config = require('../config');
let v46 = require('./index').checkNormalV46;
let NAT = require('../utils/nat');
let log4jsutil = require('../utils/logs');
let LogFile = log4jsutil.getLogger();

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
            res.status(500);
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
        /*let mockData = {
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
        res.json(mockData)*/
        // 获取监测是v4(6)http(s)情况
        v46(domain,async function (finalSend) {
            LogFile.info('Self v46 response Data is: '+JSON.stringify(finalSend));
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
            await NAT.natSubscriberBySid(function (state,data) {
                LogFile.info('Nats response Data is: '+JSON.stringify(data));
                if (!state || data=='ERROR'){
                    res.status(500)
                    res.json({state:false,message:'系统错误！'})
                    return;
                }
                // 返回客户端数据
                try {
                    data = JSON.parse(data);
                    if (data.url!==domain){
                        LogFile.error('Domain is difference with Nats respones url!');
                        res.status(500);
                        res.json({state:false,message:'系统错误！'});
                        return;
                    }
                }catch (e) {
                    res.status(500)
                    res.json({state:false,message:'系统错误！'})
                    return;
                }

                let finalResult = {};
                // IPv6支持度数据
                finalResult['v46'] = [{
                    url:domain,
                    supportV4:finalSend.supportV4?'是':'否',
                    supportV6:finalSend.supportV6?'是':'否',
                    ipv4_http:finalSend.v4http==='success'?'是':'否',
                    ipv4_https:finalSend.v4https==='success'?'是':'否',
                    ipv6_http:finalSend.v6http==='success'?'是':'否',
                    ipv6_https:finalSend.v6https==='success'?'是':'否',
                }];
                finalResult['score'] = finalSend.score;

                // IPv6转换规模评估
                finalResult['links'] = [{
                    total: data.second_site_num ? data.second_site_num+'条':0+'条',
                    list: data.all_site && data.all_site.length>0 ? data.all_site:[]
                }]

                let http_evaluateValue = finalSend.v4https==='success'?'1000':'500'

                // IPv6转换复杂度评估
                finalResult['detail'] = [
                    {
                        evaluateProject: finalSend.v4https==='success'?'支持HTTPS':'不支持HTTPS',
                        number:'1',
                        coefficient:finalSend.v4https==='success'?'1000':'500',
                        evaluateValue:http_evaluateValue
                    },
                    {
                        evaluateProject:'内部链接',
                        number:data.internal_links_num,
                        coefficient:100,
                        evaluateValue:parseInt(data.internal_links_num)*100
                    },
                    {
                        evaluateProject:'外部链接',
                        number:data.external_links_num,
                        coefficient:200,
                        evaluateValue:parseInt(data.external_links_num)*200
                    },
                    {
                        evaluateProject:'图片链接',
                        number:data.photo_kinks_num,
                        coefficient:100,
                        evaluateValue:parseInt(data.photo_kinks_num)*100
                    },
                    {
                        evaluateProject:'IP链接',
                        number:data.ip_links_num,
                        coefficient:200,
                        evaluateValue:parseInt(data.ip_links_num)*200,
                    },
                    {
                        evaluateProject:'Javascript插件页面',
                        number:data.js_links_num,
                        coefficient:300,
                        evaluateValue:parseInt(data.js_links_num)*300
                    },
                    {
                        evaluateProject:'CSS样式链接',
                        number:data.scc_links_num,
                        coefficient:300,
                        evaluateValue:parseInt(data.scc_links_num)*300
                    },
                    {
                        evaluateProject:'定制化评估汇总',
                        number:'-',
                        coefficient:'-',
                        evaluateValue:parseInt(data.scc_links_num)*300+parseInt(data.js_links_num)*300+parseInt(data.ip_links_num)*200+parseInt(data.photo_kinks_num)*200+parseInt(data.external_links_num)*200+parseInt(data.internal_links_num)*100+parseInt(http_evaluateValue)
                    }
                ]
                res.json({state:true,data:finalResult})
            })
        })

    } catch (e) {
        res.status(400);
        res.json({message: 'invalid token'});
    }

})

module.exports = router;
