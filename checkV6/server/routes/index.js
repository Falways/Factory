var express = require('express');
var router = express.Router();
var exec = require('child_process').exec;
var async = require('async');
var request = require('request');
var deviceUtil = require('device');
let Iconv = require('iconv-lite');
var proxy = require('../proxy/history');
/* GET home page. */
router.get('/' ,function(req, res, next) {
    let ip = getClientIp(req);
    let connect = {};
    let v4Ip = ip.match(/(((2[0-4][0-9])|(25[0-5])|(1[0-9]{0,2})|([1-9][0-9])|([1-9]))\.){3}((2[0-4][0-9])|(25[0-5])|(1[0-9]{0,2})|([1-9][0-9])|([1-9]))/g);
    let v6Ip = ip.match(/((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?/g)
    connect['isV4'] = v4Ip && v4Ip.length>0?true:false;
    connect['isV6']= v6Ip && v6Ip.length>0?true:false;

    let agent = req.headers['user-agent'];
    let device =deviceUtil(agent);
    //console.log(JSON.stringify(device))
    if (v4Ip && v4Ip[0]){
        connect['ip']=v4Ip[0];
    }else if (v6Ip && v6Ip[0]) {
        connect['ip']=v6Ip[0];
    }
    connect['device']=device.type;
    async.waterfall([
        function(done){
            getAddr(ip,function (result) {
                //113.65.17.129
                if (result){
                    result = result.split(' ')
                    connect['addr']= result[0];
                    connect['internet']=result[1];
                }
                done()
            });
        },
        function (done) {
            proxy.getTop5(function (err,data) {
                if (err){
                    res.json({err:err});
                    return;
                }
                done(null,data)
            })
        },
        function(result,done){
            console.log(JSON.stringify(connect))
            res.json(Object.assign({top:result},connect));
        }
    ])
});

router.post('/checkV6',async (req,res,next)=>{
    let body = req.body;
    let domain = body.domain;
    let reg = /((http:\/\/)|(https:\/\/))?([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}(:\d+\/)?/gi;
    let reg1 = /([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}(:\d+)?/gi;
    if (!domain || !domain.match(reg) || domain.match(reg).length<=0){
        res.code(500)
        res.json({state:false,message:'illegalDomain'})
        return;
    }
    domain = domain.match(reg)[0].match(reg1)[0];
    console.log(domain);
    let arr = domain.split(':')
    let final = {};
    final['time']=new Date();
    final['url']=domain;
    let score = 0;
    await exec(`dig @114.114.114.114 ${arr[0]} A`,function (error,stdout,stderr) {
        if (error && error!=null){
            res.status(500)
            res.json({state:false,message:'systemFailure'})
            return;
        }
        if (stderr){
            res.status(500)
            res.json({state:false,message:'systemFailure'})
            return;
        }
        let v4addr = null;
        let reg = /ANSWER SECTION:((\r\n)|(\n))[\w\s.\d:-]+/gm;
        let v4reg = /((2[0-4][0-9])|(25[0-5])|(1[0-9]{0,2})|([1-9][0-9])|([1-9]))\.(((2[0-4][0-9])|(25[0-5])|(1[0-9]{0,2})|([1-9][0-9])|([0-9]))\.){2}((2[0-4][0-9])|(25[0-5])|(1[0-9]{0,2})|([1-9][0-9])|([1-9]))/g;
        console.log(stdout);
        let s0 = stdout.match(reg);
        if (s0 && s0.length>0){
            let s1 = null;
            for (let i = 0;i<s0.length;i++){
                let temp = s0[i].match(v4reg);
                if (temp && temp[0]) {
                    s1=temp[0];
                    break;
                }
            }
            if (s1){
                console.log('我的输出：'+s1)
                v4addr = s1;
                final['supportV4']=true;
                final['v4addr']=v4addr;
                score+=10;
            }else {
                final['supportV4']=false;
                final['v4addr']=null;
            }
        }else {
            final['supportV4']=false;
            final['v4addr']=null;
        }
    })
    await exec(`dig @114.114.114.114 ${arr[0]} AAAA`,function (error,stdout,stderr) {
        if (error && error!=null){
            res.status(500)
            res.json({state:false,message:'systemFailure'})
            return;
        }
        if (stderr){
            res.status(500)
            res.json({state:false,message:'systemFailure'})
            return;
        }
        let v6addr = null;
        let reg = /ANSWER SECTION:((\r\n)|(\n))[\w\s.\d:-]+/gm;
        let v6reg = /((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?/g;
        console.log(stdout);
        let s0 = stdout.match(reg);
        if (s0 && s0.length>0){
            let s1 = null;
            for (let i = 0;i<s0.length;i++){
                let temp = s0[i].match(v6reg);
                if (temp && temp[0]) {
                    s1=temp[0];
                    break;
                }
            }
            if (s1){
                v6addr = s1;
                final['v6addr']=v6addr;
                score+=10;
            }else {
                final['v6addr']=null;
            }
        }else {
            final['supprtV4']=false;
            final['v6addr']=null;
        }
        final['supportV6']=false;
        async.waterfall([
            function (done) {
                //v4 http
                validReq('http://'+domain,(result)=>{
                    if (result=='success') {
                        final['v4http'] = result;
                        score+=20;
                        final['score']=score;
                    } else {
                        final['v4http']=result;
                        final['score']=score;
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
                        final['score']=score;
                    } else {
                        final['v4https']=result;
                        final['score']=score;
                    }
                    done()
                })
            },
            function (done) {
                if (v6addr){
                    //v6 http
                    score += 20;
                    final['supportV6']=true;
                    curlSpeed('http://'+domain,(result)=>{
                        if (result!='err_url') {
                            final['v6http']='success';
                            score+=20;
                            final['score']=score;
                        } else {
                            final['v6http']=result;
                            final['score']=score;
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
                    curlSpeed('https://'+domain,(result)=>{
                        if (result!='err_url') {
                            final['v6https']='success';
                            score+=20;
                            final['score']=score;
                        } else {
                            final['v6https']=result;
                            final['score']=score;
                        }
                        done()
                    })
                }else {
                    final['score']=score;
                    done()
                }
            },
            function (done) {
                proxy.insertOne(final.state,final.time.toString(),final.url,final.v4addr,final.v6addr,final.v4http,final.v6http,final.v4https,final.v6https,final.supportV4,final.supportV6,final.score,function (err,data) {
                    if (err){
                        final = {state:false};
                    }
                    done()
                })
            },
            function(done){
              if (final.v4http=='success'){
                  testSpeed('http://'+domain,function (result) {
                      final['v4HttpSpeed']=result;
                      done()
                  })
              }else {
                  done()
              }
            },
            function(done){
                if (final.v4https=='success'){
                    testSpeed('https://'+domain,function (result) {
                        final['v4HttpsSpeed']=result;
                        done()
                    })
                }else {
                    done()
                }
            },
            function(done){
                if (final.v6http=='success'){
                    testCurlSpeed('http://'+domain,function (result) {
                        final['v6HttpSpeed']=result;
                        done()
                    })
                }else {
                    done()
                }
            },
            function(done){
                if (final.v6https=='success'){
                    testCurlSpeed('https://'+domain,function (result) {
                        final['v6HttpsSpeed']=result;
                        done()
                    })
                }else {
                    done()
                }
            },
            function (done) {
                res.json(final);
                return
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
           /* console.log('输出URL:'+url);
            console.log('输出Body：'+body)*/
            if (err) {
                done('err_url')
            }else if(body){
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
const curlSpeed = (url,done) => {
    let start = new Date()
    exec(`curl -6 ${url}`,{timeout:10000,maxBuffer:20000 * 1024},(error,stdout,stderr) => {
        if (error && error!=null){
            done('err_url')
            return;
        }
        let end = new Date();
        done(end-start)
    })
}
const testCurlSpeed = function(url,callback) {
    let arr = [];
    async.waterfall([
        function (done) {
            for (let i = 0; i<10;i++){
                curlSpeed(url,function (time) {
                    if (time == 'err_url') {
                        callback('err_url');
                        return;
                    }
                    arr.push(time);
                    if (arr.length==10){
                        done()
                    }
                })
            }
        },
        function (done) {
            console.log(arr.sort());
            let max = 0;
            let min = 10000000;
            let sum = 0;
            arr.forEach(function (item) {
                if (item>max) max=item;
                if (item<min) min=item;
                sum+=item;
            })
            let avg = sum/10;
            console.log('max:'+max,'min:'+min,'avg:'+avg)
            callback({max:max,min:min,avg:avg})
        }
    ])
}
const speed = (url,done) => {
    let start = new Date();
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
            let end = new Date();
            done(end-start)
        })
}

const testSpeed = function(url,callback) {
    let arr = [];
    async.waterfall([
        function (done) {
            for (let i = 0; i<10;i++){
                speed(url,function (time) {
                    arr.push(time);
                    if (arr.length==10){
                        done()
                    }
                })
            }
        },
        function (done) {
            console.log(arr.sort());
            let max = 0;
            let min = 10000000;
            let sum = 0;
            arr.forEach(function (item) {
                if (item>max) max=item;
                if (item<min) min=item;
                sum+=item;
            })
            let avg = sum/10;
            console.log('max:'+max,'min:'+min,'avg:'+avg)
            callback({max:max,min:min,avg:avg})
        }
    ])
}

module.exports = router;
