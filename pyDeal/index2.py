from urllib.request import urlopen

def index(url):
    def get():
        return urlopen(url).read()
    return get

# 返回的是get函数的地址
python = index("http://www.python.org")
print(python()) # 执行get函数《并且将返回的结果打印出来
baidu = index("http://www.baidu.com")
print(baidu())