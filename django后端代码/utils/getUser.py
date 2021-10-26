import jwt
from jwt import ExpiredSignatureError

from user.models import User


def get_user(obj):
    token = obj['token']
    secret = b'\x3d\xef\x87\xd5\xf8\xbb\xff\xfc\x80\x91\x06\x91\xfd\xfc\xed\x69'
    EncryptedString = token
    """#print(type(EncryptedString))
    #print("EncryptedString:")
    #print(EncryptedString)"""
    try:
        EncryptedString = jwt.decode(token, secret, issuer='cyb', algorithms=['HS256'])  # 解密，校验签名
        # print(type(EncryptedString))
        # print(EncryptedString)
        primary_key = (EncryptedString['data'])['id']
        # print('primary_key')
        # print(primary_key)
        # print(type(primary_key))
        # print(primary_key)
        user = User.objects.get(id=primary_key)  # 通过openid获取user
        # print(type(user))
        # print(user)
        return user
    except ExpiredSignatureError:
        return False
