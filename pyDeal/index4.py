"""类的装饰器"""

class Deco(object):
    def __init__(self,fuc):
        self.fuc = fuc
    def __call__(self, *args, **kwargs):
        print('class decorator is running')
        self.fuc()
        print('class decorate ending')
@Deco
def test():
    print('Happy')

test()
print('------------------------')


class Foo(object):
    def __init__(self):
        pass

    def __call__(self, func):
        def _call(*args, **kw):
            print('class decorator runing')
            print(args)

            return func(*args, **kw)

        return _call


class Bar(object):
    @Foo()
    def bar(self, test, ids):   # bar = Foo()(bar)
        print('bar')


Bar().bar('aa', 'ids')

