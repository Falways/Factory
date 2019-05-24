let reg = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}(:\d+\/)?$/gi;

let str = 'http://www.baidu.com';
let domain = str.replace(/(http|https):\/\//gi,'');
console.log(domain)
console.log(reg.test(domain))
