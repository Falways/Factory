// 记录执行时间，console.time 和 console.timeEnd 中value一致即可
console.time("time");
let start = new Date()
console.log('执行我花费了一点时间');
console.log('又花费了一点时间');
setTimeout(()=>{let end = new Date()
    console.log((end-start)+'ms')},1000)

console.timeEnd("time");


let arr = [0,1,2,3,4,5,6,7,8]
let tmp = arr.slice(0,5);
console.log(tmp)
arr = arr.concat([9,9,9])
arr = arr.concat([6,6,6])
console.log(arr)

