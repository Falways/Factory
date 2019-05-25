let NATS = require('nats');
let config = require('../config');
let moment = require('moment');
let nats = NATS.connect({'url':config.natAddr, 'user':config.natUser, 'pass':config.natPass});

nats.publish('eve',JSON.stringify({url:"www.baihe.com",version:new Date().getTime()}))
nats.subscribe('eve_reply',function (message) {
    console.log('Response Message: '+message)
})

nats.request('eve_reply', null, {'max':2}, function(response) {
    console.log('Got a response for help: ' + response);
});

var sid = nats.subscribe('eve_reply', function(msg) {
    console.log(msg)
});
console.log(sid);
nats.unsubscribe(sid);

var pid = nats.subscribe('eve_reply', function(msg) {
    console.log('2: '+msg)
});
console.log(pid);
nats.unsubscribe(pid);
