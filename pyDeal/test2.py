# coding: utf8
# import binascii
# python 3.7
from Crypto.Cipher import AES

class testClass:
    def __init__(self, key, iv):
        self.iv = iv
        self.key = key
        self.mode = AES.MODE_CBC

        # 加密函数，如果text不是16的倍数【加密文本text必须为16的倍数！】，那就补足为16的倍数

    def encrypt(self, text):
        cipher = AES.new(self.key, self.mode, self.iv)
        encodeStr = cipher.encrypt(text)
        print(encodeStr)
        print(type(encodeStr))
        return encodeStr.hex()


if __name__ == '__main__':
    print("test aes-128-cbc")
    padding = "123456"
    spacePadding = '\0\0\0\0\0\0\0\0\0\0\0'
    tc = testClass("qwertyuiop"+padding, padding+"qwertyuiop")
    print(testClass.encrypt(tc, spacePadding+'test1'))

# 471ef6f5698f0366af4f73dcdb5fdf06
# 6fe54ec8fd3899ad7a963a5a91a38bc2
