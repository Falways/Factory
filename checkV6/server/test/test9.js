let async = require('async');

async.waterfall([
    function (callback) {
        callback(null,0)
    },
    function (pass,callback) {
        console.log(pass)
        callback(null,1)
    },
    function (pass,callback) {
        console.log(pass)
        callback(null,2)
    },
    function (pass,callback) {
        console.log(pass)
    }

])

console.log([1,2,3].join(','))