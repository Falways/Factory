from functools import wraps

def log_handler(func):
    @wraps(func)
    def wrapper(*args,**kwargs):
        # 获取被装饰函数的名称
        print("call %s(): " % func.__name__)
        # 获取被装饰函数的参数
        print("args = {}".format(*args))
        # 透传参数，并且一定要return，否则不生效
        return func(*args,**kwargs)

    # 返回处理装饰函数的引用
    return wrapper

@log_handler
def do_some_things(env):
    pass

# 带参数带装饰器
def log_with_param(text):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            print('call %s():' % func.__name__)
            print('args = {}'.format(*args))
            print('log_param = {}'.format(text))
            return func(*args, **kwargs)

        return wrapper

    return decorator


@log_with_param("param")
def test_with_param(p):
    print(test_with_param.__name__)

if __name__ == '__main__':
    do_some_things("run a programmer")
    print("------------------ split line -------------------")
    test_with_param("anythings")


