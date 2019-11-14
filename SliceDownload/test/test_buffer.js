let fs = require('fs');
let path = require('path');
let through2 = require('through2');

let f = fs.readFileSync(path.resolve(__dirname,'../blobs/test.txt'));
let w = fs.createWriteStream(path.resolve(__dirname,'../blobs/test2.txt'));
let w_ = fs.createWriteStream(path.resolve(__dirname,'../blobs/test3.txt'))
//let buf = Buffer.from(f)

// 创建16进制的数组
let _16systemArr = [0x30, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x61, 0x62, 0x63, 0x64, 0x65, 0x66];
// 加载到缓冲区中
let buf_arr = Buffer.from(_16systemArr)
//console.log(buf_arr)
// 通过stream将buffer写到文件中
//w.write(buf_arr)
//w.end()

let ar = Buffer.alloc(f.length);
console.log(ar)




