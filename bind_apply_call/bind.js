/**
 *bind是在EcmaScript5中扩展的方法（IE6,7,8不支持）
 bind() 方法与 apply 和 call 很相似，也是可以改变函数体内 this 的指向。
 MDN的解释是：bind()方法会创建一个新函数，称为绑定函数，当调用这个绑定函数时，绑定函数会以创建它时传入 bind()方法的第一个参数作为 this，
 传入 bind() 方法的第二个 以及以后的参数加上绑定函数运行时本身的参数 按照顺序 作为原函数的参数来调用原函数。
 #注意：bind方法的返回值是函数#
 */

let bar = function () {
    console.log(this.x)
}

let foo = {
    x:1
}

bar.bind(foo)()

// 或
let func = bar.bind(foo);
func()

function log(){
    var args = Array.prototype.slice.call(arguments);
    args.unshift('(app)');

    console.log.apply(console, args);
};

log(1,2)