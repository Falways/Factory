import time, random
"""
装饰器
"""
def index():
    time.sleep(random.randrange(1, 5))
    print('Just test')



def outer(func):
    def inner(*args, **kwargs):
        start_time = time.time()
        func(*args, **kwargs)
        end_time = time.time()
        print('run time is%s' %(end_time-start_time))
    return inner

outer(index())
