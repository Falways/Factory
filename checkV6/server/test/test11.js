let NATS = require('nats');
let config = require('../config');
let moment = require('moment');
let nats = NATS.connect({'url':config.natAddr, 'user':config.natUser, 'pass':config.natPass});

nats.publish('eve',JSON.stringify({url:"www.jiangsu.gov.cn",version:new Date().getTime()}))
