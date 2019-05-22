"""
Python中*args与*kwargs区别
   注意点：参数arg、*args、**kwargs三个参数的位置必须是一定的。
   必须是(arg,*args,**kwargs)这个顺序，否则程序会报错
"""

#*args以元组形式展示
def fuc(*args):
    print(args,type(args))

fuc(1, 2, 3)
# 输出
# (1, 2, 3) <class 'tuple'>

# *kwargs 打包关键字参数成dict给函数体调用
def fuc2(**kwargs):
    print(kwargs, type(kwargs))

fuc2(a=1,b=2,c=3)
# 输出
# {'a': 1, 'b': 2, 'c': 3} <class 'dict'>