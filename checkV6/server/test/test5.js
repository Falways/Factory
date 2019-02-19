let exec = require('child_process').exec;
let func = (url) => {
    let start = new Date()
    exec(`curl -6 ${url}`,{timeout:1000},(error,stdout,stderr) => {
        if (error && error!=null){
            console.log(error)
            return;
        }
        if (stderr){
            console.log(stderr)
            return;
        }
        let end = new Date();
        console.log('使用时间：',end-start)
        console.log(stdout)
    })
}

func('http://www.shanghai.gov.cn')