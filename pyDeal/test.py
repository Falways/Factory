#!/usr/bin/python
# -*- coding: UTF-8 -*-
import math
import time
from functools import wraps
print("中文编码")

g = (1,2,3)
print(type(g))
r = math.sin(90)


print(time.localtime())
print(time.strftime("%Y-%m-%d %H-%M-%S",time.localtime()))


f = open("index.py","r")
print(f.readlines())

class Test:
    def __init__(self):
        print("init...")

print(Test.__name__)

result = True

print(not result)

# 装饰器解释比较好的文档： https://www.runoob.com/w3cnote/python-func-decorators.html

def a_new_decorator(a_func):
    # wraps解决函数被代替
    @wraps(a_func)
    def wrapTheFunction():
        print("I am doing some boring work before executing a_func()")

        a_func()

        print("I am doing some boring work after executing a_func()")

    return wrapTheFunction


def a_function_requiring_decoration():
    print("I am the function which needs some decoration to remove my foul smell")


a_function_requiring_decoration()
# outputs: "I am the function which needs some decoration to remove my foul smell"

a_function_requiring_decoration = a_new_decorator(a_function_requiring_decoration)
# now a_function_requiring_decoration is wrapped by wrapTheFunction()

a_function_requiring_decoration()
# outputs:I am doing some boring work before executing a_func()
#        I am the function which needs some decoration to remove my foul smell
#        I am doing some boring work after executing a_func()

print(a_function_requiring_decoration.__name__)

@a_new_decorator
def b_function_requiring_decoration():
    print("I am a func")

b_function_requiring_decoration()


def extract_var(fuc):
    @wraps(fuc)
    def inner_func(*v,**k):
        print("args = {}".format(*v))
        return fuc(*v,**k)
    return  inner_func

@extract_var
def test2(v):
    print(v)


test2("xuhang")
