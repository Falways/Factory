var express = require('express');
var router = express.Router();
var exec = require('child_process').exec;
var async = require('async');
var request = require('request');
var deviceUtil = require('device');
let Iconv = require('iconv-lite');
var proxy = require('../proxy/history');
let excel = require('../utils/excel');
var log4jsutil = require('../utils/logs');
var LogFile = log4jsutil.getLogger();

router.get('/',function (req,res,next) {
    let body = req.query;
    let reg = /([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}(:\d+)?/gi;
    if (!reg.test(body.domain)) {
        res.status(400)
        res.json({message:'InvalidParams'});
        return;
    }
    // 调用接口，第一步获取token
    requireToken('http://119.29.190.236:3000/api/auth/login',function (err,data) {
        if (err){
            res.status(500)
            res.json({message:'SystemFailure'});
            return;
        }
        if (data){
            requireDomainResult(data,'http://119.29.190.236:3000/api/evils',body.domain,function (err,result) {
                if (err){
                    res.status(500)
                    res.json({message:'SystemFailure'});
                    return;
                }
                if (JSON.stringify(result)!=='{}'){
                    LogFile.info('查询的域名是：'+body.domain);
                    res.json({'result':result});
                }else {
                    res.status(500)
                    res.json({message:'ServerRelax'});
                    return;
                }

            }) 
        }else {
            res.status(500)
            res.json({message:'TokenRelax'});
        }
    })

})

router.get('/template',function (req,res,next) {
    let body = req.query;
    let fields = [
        {param:'ip_addr',desc:'域名'}
    ]
    excel.download(req, res, 'template', fields, []);
})

router.post('/importfiles',function (req,res,next) {
    let fields = [
        {param:'ip_addr',desc:'域名',required:true,validate:function (v) {
                return true;
            }}
    ]
    excel.upload(req,res,function (err,excelData,parameters) {
        if (err) {
            res.status(500)
            res.json({message:'SystemFailure'});
            return;
        }
        try {
            excel.validate(fields, excelData);
        }catch (e) {
            res.status(400)
            res.json({message:'InvalidData'});
            return;
        }
        excelData.splice(0, 1);
        async.waterfall([
            function (callback) {
                requireToken('http://119.29.190.236:3000/api/auth/login',function (err,data) {
                    if (err){
                        callback(err);
                        return;
                    }
                    if (!data){
                        callback('TokenRelax');
                        return;
                    }
                    callback(null,data);
                })
            },
            function(data,callback){
                // auth,url,params,done
                console.log(excelData)
                let arr = [];
                excelData.forEach(function (item) {
                    if (arr.indexOf(item[0])==-1){
                        arr.push(item[0])
                    }
                })
                let params = {uris:arr};
                requireManyDomainResult(data,'http://119.29.190.236:3000/api/evils',params,function (err,result) {
                  if (err){
                      callback(err);
                      return;
                  }
                  if (JSON.stringify(result)!=='{}'){
                      LogFile.info('查询的数组为：'+excelData.join(',----,'));
                      res.json({'result':result});
                  }else {
                      callback('ServerRelax');
                      LogFile.error('ServerRelax')
                  }
                })
            }
        ],function (err) {
            if (err){
                res.status(500)
                res.json({message:'SystemFailure'});
            }
        })

    })
})

const requireToken = function(url,done){
    let headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36'
    }
    /**
     * request params(conditionJson,callback)
     */
    request.post(
        {
            uri:url,
            encoding: null,
            path: '/',
            strictSSL:false,
            timeout: 10000,
            json:true,
            body:{username:'test',password:'123456Qw!'},
            headers},
        (err,res,body) => {
            if (err){
                done(err);
                return;
            }
            done(null,body.token);
        }
    )
}
//requireToken('http://119.29.190.236:3000/api/auth/login')

const requireDomainResult = (auth,url,uri,done) => {
    console.log(url+'?uri='+uri,auth)
    let headers = {
        "Content-Type":'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36',
        'Authorization':'Bearer '+auth
    }
    /**
     * request params(conditionJson,callback)
     */
    request.get(
        {
            uri:url+'?uri='+uri,
            encoding: null,
            strictSSL:false,
            timeout: 10000,
            json:true,
            headers},
        (err,res,body) => {
            if (err){
                done(err);
                return;
            }
            done(null,body.success);
        }
    )
}

const requireManyDomainResult = (auth,url,params,done) => {
    let headers = {
        "Content-Type":'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36',
        'Authorization':'Bearer '+auth
    }
    /**
     * request params(conditionJson,callback)
     */
    console.log(params)
    request.post(
        {
            uri:url,
            encoding: null,
            path: '/',
            strictSSL:false,
            json:true,
            timeout: 10000,
            body:params,
            headers},
        (err,res,body) => {
            if (err){
                done(err);
                return;
            }
            done(null,body.success);
        }
    )
}

module.exports = router;
