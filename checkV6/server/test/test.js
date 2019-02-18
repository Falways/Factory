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
// working('https://sp0.baidu.com/8aQDcjqpAAV3otqbppnN2DJv/api.php?query={116.209.191.186}&co=&resource_id=6006&t=1529809984888&ie=utf8&oe=gbk&format=json&tn=baidu')

//working('https://www.superhang.top')
const valid = (domain) => {
    let reg = /^((http:\/\/)|(https:\/\/))?([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}(:\d+\/)?/gi;
    let reg1 = /([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}(:\d+)?/gi;
    domain = domain.match(reg)[0].match(reg1)[0];
    console.log(domain)
}
//valid('https://blog.csdn.net:8081/helixue2012/article/details/80454244')

const validReg = (value) => {
    let reg = /ANSWER SECTION:((\r\n)|(\n))[\w\s.\d:-]+/gm;
    let v6reg = /((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?/g;
    let v4reg = /((2[0-4][0-9])|(25[0-5])|(1[0-9]{0,2})|([1-9][0-9])|([1-9]))\.(((2[0-4][0-9])|(25[0-5])|(1[0-9]{0,2})|([1-9][0-9])|([0-9]))\.){2}((2[0-4][0-9])|(25[0-5])|(1[0-9]{0,2})|([1-9][0-9])|([1-9]))/g;
    console.log((value.match(reg)))
}
validReg('; <<>> DiG 9.9.7 <<>> @114.114.114.114 www.youku.com A\n' +
    '; (1 server found)\n' +
    ';; global options: +cmd\n' +
    ';; Got answer:\n' +
    ';; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 37829\n' +
    ';; flags: qr rd ra; QUERY: 1, ANSWER: 3, AUTHORITY: 0, ADDITIONAL: 1\n' +
    '\n' +
    ';; OPT PSEUDOSECTION:\n' +
    '; EDNS: version: 0, flags:; udp: 4096\n' +
    ';; QUESTION SECTION:\n' +
    ';www.youku.com.\t\t\tIN\tA\n' +
    '\n' +
    ';; ANSWER SECTION:\n' +
    'www.youku.com.\t\t215\tIN\tCNAME\tipv6-aserver-heyi.m.taobao.com.\n' +
    'ipv6-aserver-heyi.m.taobao.com.\t148 IN\tCNAME\tipv6-aserver-heyi.m.taobao.com.gds.alibabadns.com.\n' +
    'ipv6-aserver-heyi.m.taobao.com.gds.alibabadns.com. 31 IN A 106.11.186.3\n' +
    '\n' +
    ';; Query time: 112 msec\n' +
    ';; SERVER: 114.114.114.114#53(114.114.114.114)\n' +
    ';; WHEN: Mon Feb 18 18:14:03 ?D1��������?����?? 2019\n' +
    ';; MSG SIZE  rcvd: 159')

