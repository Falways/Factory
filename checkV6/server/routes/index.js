var express = require('express');
var router = express.Router();
var exec = require('child_process').exec;
var async = require('async');
var request = require('request');
var deviceUtil = require('device');
let Iconv = require('iconv-lite');
/* GET home page. */
router.get('/' ,function(req, res, next) {
    let ip = getClientIp(req);
    ip = ip.match(/(((2[0-4][0-9])|(25[0-5])|(1[0-9]{0,2})|([1-9][0-9])|([1-9]))\.){3}((2[0-4][0-9])|(25[0-5])|(1[0-9]{0,2})|([1-9][0-9])|([1-9]))/g)[0];
    let agent = req.headers['user-agent'];
    let device =deviceUtil(agent);
    //console.log(JSON.stringify(device))
    let connect = {};
    connect['ip']=ip;
    connect['device']=device.type;
    async.waterfall([
        function(done){
            getAddr(ip,function (result) {
                connect['addr']= result ;
                done()
            });
        },
        function(done){
            console.log(JSON.stringify(connect))
            res.render('index', { title: 'Express',connect:connect});
        }
    ])

});

router.post('/checkV6',(req,res,next)=>{
    let body = req.body;
    let domain = body.domain;
    let reg = /^((http:\/\/)|(https:\/\/))?([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}(:\d+\/)?/gi;
    let reg1 = /([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}(:\d+)?/gi;
    if (!domain || !domain.match(reg) || domain.match(reg).length<=0){
        res.json({state:false,message:'illegalDomain'})
        return;
    }
    domain = domain.match(reg)[0].match(reg1)[0];
    console.log(domain);
    let arr = domain.split(':')
    exec(`dig @114.114.114.114 ${arr[0]} AAAA`,function (error,stdout,stderr) {
        if (error && error!=null){
            res.json({state:false,message:'systemFailure'})
            return;
        }
        if (stderr){
            res.json({state:false,message:'systemFailure'})
            return;
        }
        let v6addr = null;
        let reg = /ANSWER SECTION:\n[\w\s.\d:]+/gm;
        let v6reg = /((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?/g;
        console.log(stdout)
        if (stdout.match(reg) && stdout.match(reg).length>0 && (stdout.match(reg)[0]).match(v6reg) && (stdout.match(reg)[0]).match(v6reg).length>0){
            v6addr =  (stdout.match(reg)[0]).match(v6reg)[0];
        }
        let score = 0;
        let final = {}
        final['supportV6']=false;
        async.waterfall([
            function (done) {
                //v4 http
                validReq('http://'+domain,(result)=>{
                    if (result=='success') {
                        final['v4http'] = result;
                        score+=20;
                    } else {
                        final['v4http']=result;
                    }
                    done()
                })
            },
            function (done) {
                //v4 https
                validReq('https://'+domain,(result)=>{
                    if (result=='success') {
                        final['v4https']=result;
                        score+=20;
                    } else {
                        final['v4https']=result;
                    }
                    done()
                })
            },
            function (done) {
                if (v6addr){
                    //v6 http
                    score += 20;
                    final['supportV6']=true;
                    let v6Ip =  arr[1]?`[${arr[0]}]:${arr[1]}`:`[${arr[0]}]`;
                    validReq('http://'+v6Ip,(result)=>{
                        if (result=='success') {
                            final['v6http']=result;
                            score+=20;
                        } else {
                            final['v6http']=result;
                        }
                        done()
                    })
                }else {
                    done()
                }
            },
            function (done) {
                if (v6addr){
                    //v6 https
                    let v6Ip =  arr[1]?`[${arr[0]}]:${arr[1]}`:`[${arr[0]}]`;
                    validReq('https://'+v6Ip,(result)=>{
                        if (result=='success') {
                            final['v6https']=result;
                            score+=20;
                        } else {
                            final['v6https']=result;
                        }
                        done()
                    })
                }else {
                    done()
                }
            },
            function (done) {
                final['state']=true;
                final['score']=score;
                res.json(final)
            }
        ])
    })

})

const validReq = (url,done) => {
    let headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36'
    }
    request(
        {
            uri:url,
            encoding: null,
            path: '/',
            strictSSL:false,
            timeout: 10000,
            headers
        },
        (err,res,body) => {
            if (err) {
                done('err_url')
            }else if(body.toString()){
                done('success')
            }else {
                done('null_response')
            }
        })
}

const getClientIp = function (req) {
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

const getAddr = function(ip,callback){
    let headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36'
    }
    request.get(
        {
            uri:'https://sp0.baidu.com/8aQDcjqpAAV3otqbppnN2DJv/api.php?query='+ip+'&co=&resource_id=6006&t=1529809984888&ie=utf8&oe=gbk&format=json&tn=baidu',
            encoding: null,
            strictSSL:false,
            headers
        },
        (err,res,body) => {
            if (err) {
                console.error(err);
                callback(null);;
            }
           let parse = Iconv.decode(body, 'gb2312');
            console.log(parse)
           if (!parse.state==0){
               callback(null);
           }
           parse = JSON.parse(parse)
           if (!parse || parse.hasOwnProperty('data')==false || parse.data.length <= 0){
               callback(null);
           } else {
               callback(parse.data[0].location);
           }

        })
}

module.exports = router;
