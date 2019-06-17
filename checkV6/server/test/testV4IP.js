let exec = require('child_process').exec;

exec(`dig @117.25.152.130 www.nbut.cn A`,function (error,stdout,stderr) {
    let reg = /ANSWER SECTION:((\r\n)|(\n))[\w\s.\d:-]+/gm;
    let v4reg = /((2[0-4][0-9])|(25[0-5])|(1[0-9]{0,2})|([1-9][0-9])|([1-9]))\.(((2[0-4][0-9])|(25[0-5])|(1[0-9]{0,2})|([1-9][0-9])|([0-9]))\.){2}((2[0-4][0-9])|(25[0-5])|(1[0-9]{0,2})|([1-9][0-9])|([1-9]))/g;
    console.log(stdout);
    let s0 = stdout.match(reg);
    console.log('===================================');
    console.log(s0)
    if (s0 && s0.length>0){
        let s1 = null;
        for (let i = 0;i<s0.length;i++){
            let temp = s0[i].match(v4reg);
            if (temp && temp[0]) {
                s1=temp[0];
                break;
            }
        }
        if (s1){
            console.log('我的输出：'+s1)
        }else {

        }
    }
})

/*let zone = 'www.nbut.com';
let reg = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}(:\d+\/)?$/gi;
let domain = zone.replace(/(http|https):\/\//gi,'');
if (!reg.test(domain)) {
    console.log('domain is invalid')
    return;
}else {
    console.log('123')
}*/
