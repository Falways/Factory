var request = require('request');
var async = require('async')
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

let arr = [];
function test() {
    async.waterfall([
        function (done) {
            for (let i = 0; i<10;i++){
                speed('https://www.baidu.com',function (time) {
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
            arr.forEach(function (item,index) {
                if (item>max) max=item;
                if (item<min) min=item;
                sum+=item;
            })
            let avg = sum/10;
            console.log('max:'+max,'min:'+min,'avg:'+avg)
        }
    ])
}
test()

