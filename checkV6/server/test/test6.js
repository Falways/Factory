let request = require('request');

let headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36'
}
request.get(
    {
        uri:'https://www.google.com',
        encoding: null,
        strictSSL:false,
        headers
    },
    (err,res,body) => {
        if (err) {
            console.error(err);
            return;
        }

        console.log(body.toString())
    }
)