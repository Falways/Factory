# 闭包函数
# 特点
# 1. 延迟计算 2. 自带作用域
def outer():
    x = 1
    y = 2

    def inner():
        print("x= %s" %x)
        print("y= %s" %y)

    print(inner.__closure__)
    return inner

outer()
