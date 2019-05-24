let NATS = require('nats');
let config = require('../config');
let moment = require('moment');
var log4jsutil = require('../utils/logs');
var LogFile = log4jsutil.getLogger();
let nats;
try {
    // nats = NATS.connect({'url':config.natAddr, 'user':config.natUser, 'pass':config.natPass});
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
const natSubscriber = function(callback){
    // Request for single response with timeout.
    nats.requestOne('eve_reply', null, {}, 1000*60*5, function(response) {
        // `NATS` is the library.
        if(response instanceof NATS.NatsError && response.code === NATS.REQ_TIMEOUT) {
            LogFile.error('Nats subscriber timeout');
            callback(false,'timeout');
            return;
        }
        callback(true,response)
    });
}

process.on('exit', (code) => {
    nats.close();
});


module.exports = {
    natPublish,
    natSubscriber
}
