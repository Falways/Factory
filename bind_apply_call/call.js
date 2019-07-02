function a() {
    // 此时this指向函数b，相当于把函数b拿过来作为自己，所以可以调用函数b的方法属性内容
    b.call(this)
}

function b(){
    this.username = 'test call'
}

// 定义：调用一个对象的一个方法，以另一个对象替换当前对象。
/**
 * thisObj的取值有以下4种情况：
 （1） 不传，或者传null,undefined， 函数中的this指向window对象
 （2） 传递另一个函数的函数名，函数中的this指向这个函数的引用
 （3） 传递字符串、数值或布尔类型等基础类型，函数中的this指向其对应的包装对象，如 String、Number、Boolean
 （4） 传递一个对象，函数中的this指向这个对象
 */


let c = new a()
console.log(c.username)


function class1() {
    this.name = function () {
        console.log('class1内的方法！')
    }
}

function classs2() {
    class1.call(this) //此行代码执行后，当前的this指向了class1（也可以说class2继承了class1）
}

let f = new classs2()
    f.name()

function eat(x,y){
    console.log(x+y);
}
function drink(x,y){
    console.log(x-y);
}
eat.call(drink,3,2);

function Animal(){
    this.name = 'shark'
    this.showName=function(){
        console.log(this.name);
    }
}
function Dog(){
    this.name="dog";
    // Animal.call(this); // 取消注释，会将this 传递给animal中
}
var animal=new Animal();
var dog=new Dog();

animal.showName.call(dog);
