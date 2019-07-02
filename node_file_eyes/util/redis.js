/**
 * create by xuhang 2018/08/28
 */
let redis = require('redis');
let config = require('../config');

// 连接redis
let client = null;

if(config.redis.host && config.redis.port){
    client = redis.createClient(config.redis.port, config.redis.host);
} else {
    client = redis.createClient();
}
if(config.redis.password)  {
    client.auth(config.redis.password,function(res){});
}

client.on('err',function (err) {
    console.log("Error " + err);
});

client.on('ready',function (res) {
    console.log('redis连接成功！');
});

module.exports = client;
