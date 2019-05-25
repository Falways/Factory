let NATS = require('nats');
let config = require('../config');
let moment = require('moment');
var log4jsutil = require('../utils/logs');
var LogFile = log4jsutil.getLogger();
let nats;
try {
     nats = NATS.connect({'url':config.natAddr, 'user':config.natUser, 'pass':config.natPass});
    LogFile.info('Connect Nats success: ');
}catch (e) {
    LogFile.error('Connect Nats error: '+e);
    process.exit()
}


// 发布消息
const natPublish = function(url){
    LogFile.info('Nats publish a message, transmit url is: '+url);
    let message = {url:url,version:parseInt(moment().valueOf())};
    nats.publish('eve',JSON.stringify(message))
};

// 订阅消息
const natSubscriberBySid = function(callback){
    LogFile.info('Self start subscribing message by once');
    let sid;
    try {
        sid = nats.subscribe('eve_reply', function(msg) {
            LogFile.info('Unsubscribe by sid, sid is'+ sid);
            nats.unsubscribe(sid);
            callback(true,msg);
        });
    }catch (e) {
        LogFile.info('Catch Unsubscribe by sid, sid is'+ sid);
        LogFile.error('Subscribing catch Error: '+e);
        nats.unsubscribe(sid);
        callback(false,null);
    }

}

process.on('exit', (code) => {
    nats.close();
});


module.exports = {
    natPublish,
    natSubscriberBySid
}
