let NATS = require('nats');
const nc = NATS.connect({'url':"nats://localhost:4242", 'user':'msg', 'pass':'secret1234'});
// Simple Publisher
nc.publish('foo', 'Hello World!');