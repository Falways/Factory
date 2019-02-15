let request = require('request');
const validReq = (url) => {
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
            console.log(body)
            if (err) {
               console.log(err)
            }else if(body.toString()){
                console.log('success')
            }else {
                console.log('null_response')
            }
        })
}