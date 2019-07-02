/**
 * 二、apply()

 语法：apply([thisObj[,argArray]])

 定义：应用某一对象的一个方法，用另一个对象替换当前对象。

 说明：
 如果 argArray 不是一个有效的数组或者不是 arguments 对象，那么将导致一个 TypeError。
 如果没有提供 argArray 和 thisObj 任何一个参数，那么 Global 对象将被用作 thisObj， 并且无法被传递任何参数。

 call 和 apply的区别
 对于 apply、call 二者而言，作用完全一样，只是接受参数的方式不太一样。
 */

function class1(...arg) {
    this.name = function () {
        console.log(arg)
    }
}

function class2() {
    let args1 = 1;
    let args2 = 2;
    //class1.call(this,args1,args2)
    class1.apply(this,[args1,args2])
}

let Class2 = new class2();
    Class2.name()

/**
 * call 需要把参数按顺序传递进去，而 apply 则是把参数放在数组里。

 既然两者功能一样，那该用哪个呢？

 在JavaScript 中，某个函数的参数数量是不固定的，因此要说适用条件的话，当你的参数是明确知道数量时用 call ；
 而不确定的时候用 apply，然后把参数 push 进数组传递进去。当参数数量不确定时，函数内部也可以通过 arguments 这个数组来遍历所有的参数。
 */