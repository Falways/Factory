let request = require('request');
let Iconv = require('iconv-lite');

const working = function (url) {
    let headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36'
    }
    request.get(
        {
            uri:url,
            encoding: null,
            strictSSL:false,
            headers
        },
        (err,res,body) => {
            if (err) {
                console.error(err);
                return;
            }

            console.log(Iconv.decode(body, 'gb2312'))
        })
}
working('https://sp0.baidu.com/8aQDcjqpAAV3otqbppnN2DJv/api.php?query={116.209.191.186}&co=&resource_id=6006&t=1529809984888&ie=utf8&oe=gbk&format=json&tn=baidu')

//working('https://www.superhang.top')
const valid = (domain) => {
    let reg = /^((http:\/\/)|(https:\/\/))?([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}(:\d+\/)?/gi;
    let reg1 = /([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}(:\d+)?/gi;
    domain = domain.match(reg)[0].match(reg1)[0];
    console.log(domain)
}
//valid('https://blog.csdn.net:8081/helixue2012/article/details/80454244')

const validReg = (value) => {
    let reg = /ANSWER SECTION:\n[\w\s.\d:]+/gm;
    let v6reg = /((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?/g;
    console.log((value.match(reg)[0]).match(v6reg)[0])
}
validReg('\n' +
    '; <<>> DiG 9.9.4-RedHat-9.9.4-72.el7 <<>> @114.114.114.114 www.cyberex.com.cn AAAA\n' +
    '; (1 server found)\n' +
    ';; global options: +cmd\n' +
    ';; Got answer:\n' +
    ';; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 48936\n' +
    ';; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1\n' +
    '\n' +
    ';; OPT PSEUDOSECTION:\n' +
    '; EDNS: version: 0, flags:; udp: 4096\n' +
    ';; QUESTION SECTION:\n' +
    ';www.cyberex.com.cn.            IN      AAAA\n' +
    '\n' +
    ';; ANSWER SECTION:\n' +
    'www.cyberex.com.cn.     560     IN      AAAA    240e:ff:9000:1100::402\n' +
    '\n' +
    ';; Query time: 22 msec\n' +
    ';; SERVER: 114.114.114.114#53(114.114.114.114)\n' +
    ';; WHEN: Tue Jan 29 21:03:19 CST 2019\n' +
    ';; MSG SIZE  rcvd: 75\n')

