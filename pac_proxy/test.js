
var domains = {
    "gimpshop.com": 1,
    "directcreative.com": 1,
    "speedpluss.org": 1,
    "mingpaovan.com": 1,
    "wikinews.org": 1,
    "joachims.org": 1,
    "maiio.net": 1,
    "idv.tw": 1,
    "www.abc.com":1
}
let proxy = "__PROXY__";
let direct = 'DIRECT;';

let host = 'www.abc.com';
let pos = host.lastIndexOf('.');
console.log(host)
console.log(host.lastIndexOf('.',pos-1))
let suffix;

if (pos <= 0) {
    if (hasOwnProperty.call(domains, host)) {
        console.log('proxy');
    } else {
        console.log('direct');
    }
}else {
    suffix = host.substring(pos + 1);
    console.log(suffix)
    if (hasOwnProperty.call(domains, suffix)) {
        console.log('proxy');
    }
    pos = host.lastIndexOf('.', pos - 1);
}

