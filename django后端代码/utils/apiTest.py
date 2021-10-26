import datetime
import json

import requests


# 1.注册
def registered(key, userID, password, userType):
    url = 'https://frontjhw.jhw66.cn/WeBASE-Front/trans/handleWithSign'
    obj = {
    "groupId" :5,
    "signUserId": "fee97843cf0c45d683bade8fdebe724f",
    "contractAbi":[{"constant":True,"inputs":[{"name":"_userid","type":"string"}],"name":"isUserActivated","outputs":[{"name":"","type":"string"}],"payable":False,"stateMutability":"view","type":"function"},{"constant":True,"inputs":[{"name":"_userid","type":"string"}],"name":"getUserType","outputs":[{"name":"","type":"string"}],"payable":False,"stateMutability":"view","type":"function"},{"constant":False,"inputs":[{"name":"_userid","type":"string"},{"name":"_integral","type":"uint256"},{"name":"_opcode","type":"int8"}],"name":"updateUserIntegral","outputs":[{"name":"","type":"int8"}],"payable":False,"stateMutability":"nonpayable","type":"function"},{"constant":False,"inputs":[{"name":"_userid","type":"string"},{"name":"_username","type":"string"},{"name":"_userpassword","type":"string"},{"name":"_usertype","type":"string"}],"name":"activateUser","outputs":[{"name":"","type":"int8"}],"payable":False,"stateMutability":"nonpayable","type":"function"},{"constant":False,"inputs":[{"name":"_fields","type":"string[]"},{"name":"index","type":"uint256"},{"name":"values","type":"string"}],"name":"getChangeFieldsString","outputs":[{"name":"","type":"string"}],"payable":False,"stateMutability":"nonpayable","type":"function"},{"constant":True,"inputs":[{"name":"_userid","type":"string"},{"name":"_userpassword","type":"string"}],"name":"Login","outputs":[{"name":"","type":"int8"},{"name":"","type":"string"}],"payable":False,"stateMutability":"view","type":"function"},{"constant":True,"inputs":[{"name":"_userid","type":"string"}],"name":"getUserCreditNum","outputs":[{"name":"","type":"uint256"}],"payable":False,"stateMutability":"view","type":"function"},{"constant":True,"inputs":[{"name":"userid","type":"string"}],"name":"getUserRecordArray","outputs":[{"name":"","type":"int8"},{"name":"","type":"string[]"}],"payable":False,"stateMutability":"view","type":"function"},{"inputs":[],"payable":False,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":False,"inputs":[{"indexed":False,"name":"userid","type":"string"},{"indexed":False,"name":"usertype","type":"string"},{"indexed":False,"name":"activatetime","type":"string"}],"name":"REGISTER_USER_EVENT","type":"event"},{"anonymous":False,"inputs":[{"indexed":False,"name":"user_id","type":"string"},{"indexed":False,"name":"grade","type":"string"},{"indexed":False,"name":"time","type":"string"}],"name":"DEL_CREDITPOINT_EVENT","type":"event"},{"anonymous":False,"inputs":[{"indexed":False,"name":"user_id","type":"string"},{"indexed":False,"name":"grade","type":"string"},{"indexed":False,"name":"time","type":"string"}],"name":"ADD_CREDITPOINT_EVENT","type":"event"}],
    "contractAddress":"0xaa2d2ae8c0be3c025ec87233eb68d7f7a9ad8012",
    "funcName":"activateUser",
    "funcParam":["1611541715","Daniel","123456","个人"],
    "useCns":False,
        "funcParam": [str(key), str(userID), str(password), userType]
    }
    print("用户注册传的参数:")
    print(obj['funcParam'])
    data = json.dumps(obj)
    headers = {"Content-Type": "application/json"}  # 指定提交的是json
    r = requests.post(url, data=data, headers=headers)
    obj = json.loads(r.content.decode('utf-8'))
    print('注册结果：')
    print(obj)
    print(obj['message'].lower())
    if obj['message'].lower() == 'success':
        return True
    else:
        return False


# 2.更新用户信用值
def updateUserCredit(key, creditPoint, action):
    url = 'https://frontjhw.jhw66.cn/WeBASE-Front/trans/handleWithSign'
    obj = {
    "groupId" :5,
    "signUserId": "fee97843cf0c45d683bade8fdebe724f",
    "contractAbi":[{"constant":True,"inputs":[{"name":"_userid","type":"string"}],"name":"isUserActivated","outputs":[{"name":"","type":"string"}],"payable":False,"stateMutability":"view","type":"function"},{"constant":True,"inputs":[{"name":"_userid","type":"string"}],"name":"getUserType","outputs":[{"name":"","type":"string"}],"payable":False,"stateMutability":"view","type":"function"},{"constant":False,"inputs":[{"name":"_userid","type":"string"},{"name":"_integral","type":"uint256"},{"name":"_opcode","type":"int8"}],"name":"updateUserIntegral","outputs":[{"name":"","type":"int8"}],"payable":False,"stateMutability":"nonpayable","type":"function"},{"constant":False,"inputs":[{"name":"_userid","type":"string"},{"name":"_username","type":"string"},{"name":"_userpassword","type":"string"},{"name":"_usertype","type":"string"}],"name":"activateUser","outputs":[{"name":"","type":"int8"}],"payable":False,"stateMutability":"nonpayable","type":"function"},{"constant":False,"inputs":[{"name":"_fields","type":"string[]"},{"name":"index","type":"uint256"},{"name":"values","type":"string"}],"name":"getChangeFieldsString","outputs":[{"name":"","type":"string"}],"payable":False,"stateMutability":"nonpayable","type":"function"},{"constant":True,"inputs":[{"name":"_userid","type":"string"},{"name":"_userpassword","type":"string"}],"name":"Login","outputs":[{"name":"","type":"int8"},{"name":"","type":"string"}],"payable":False,"stateMutability":"view","type":"function"},{"constant":True,"inputs":[{"name":"_userid","type":"string"}],"name":"getUserCreditNum","outputs":[{"name":"","type":"uint256"}],"payable":False,"stateMutability":"view","type":"function"},{"constant":True,"inputs":[{"name":"userid","type":"string"}],"name":"getUserRecordArray","outputs":[{"name":"","type":"int8"},{"name":"","type":"string[]"}],"payable":False,"stateMutability":"view","type":"function"},{"inputs":[],"payable":False,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":False,"inputs":[{"indexed":False,"name":"userid","type":"string"},{"indexed":False,"name":"usertype","type":"string"},{"indexed":False,"name":"activatetime","type":"string"}],"name":"REGISTER_USER_EVENT","type":"event"},{"anonymous":False,"inputs":[{"indexed":False,"name":"user_id","type":"string"},{"indexed":False,"name":"grade","type":"string"},{"indexed":False,"name":"time","type":"string"}],"name":"DEL_CREDITPOINT_EVENT","type":"event"},{"anonymous":False,"inputs":[{"indexed":False,"name":"user_id","type":"string"},{"indexed":False,"name":"grade","type":"string"},{"indexed":False,"name":"time","type":"string"}],"name":"ADD_CREDITPOINT_EVENT","type":"event"}],
    "contractAddress":"0xaa2d2ae8c0be3c025ec87233eb68d7f7a9ad8012",
     "funcName":"updateUserIntegral",
    "funcParam":["1611541715",1,0],
    "useCns":False,
        "funcParam": [str(key), creditPoint, action]
    }
    print("升级用户信用传的参数:")
    print(obj['funcParam'])
    data = json.dumps(obj)
    headers = {"Content-Type": "application/json"}  # 指定提交的是json
    r = requests.post(url, data=data, headers=headers)
    obj = json.loads(r.content.decode('utf-8'))
    print(obj)
    if obj['message'].lower() == 'success':
        return True
    else:
        return False


# 3.建言上链
def addSuggestToChain(suggestKey, userKey, suggestTitle, suggestContent):
    url = 'https://frontjhw.jhw66.cn/WeBASE-Front/trans/handleWithSign'
    obj = {
    "groupId" :5,
    "signUserId": "fee97843cf0c45d683bade8fdebe724f",
    "contractAbi":[{"constant":True,"inputs":[{"name":"_proposeid","type":"string"}],"name":"getSuggestRecordArray","outputs":[{"name":"","type":"int8"},{"name":"","type":"string[]"}],"payable":False,"stateMutability":"view","type":"function"},{"constant":True,"inputs":[{"name":"_proposeid","type":"string"}],"name":"getSuggestRecordJson","outputs":[{"name":"","type":"int8"},{"name":"","type":"string"}],"payable":False,"stateMutability":"view","type":"function"},{"constant":True,"inputs":[{"name":"_proposeid","type":"string"}],"name":"getSuggestId","outputs":[{"name":"","type":"string"}],"payable":False,"stateMutability":"view","type":"function"},{"constant":False,"inputs":[{"name":"_fields","type":"string[]"},{"name":"index","type":"uint256"},{"name":"values","type":"string"}],"name":"getChangeFieldsString","outputs":[{"name":"","type":"string"}],"payable":False,"stateMutability":"nonpayable","type":"function"},{"constant":True,"inputs":[{"name":"_proposeid","type":"string"}],"name":"getSuggestContent","outputs":[{"name":"","type":"string"}],"payable":False,"stateMutability":"view","type":"function"},{"constant":False,"inputs":[{"name":"_proposeid","type":"string"},{"name":"_userid","type":"string"},{"name":"_title","type":"string"},{"name":"_content","type":"string"}],"name":"suggestUser","outputs":[{"name":"","type":"int8"}],"payable":False,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":False,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":False,"inputs":[{"indexed":False,"name":"Proposeid","type":"string"},{"indexed":False,"name":"Userid","type":"string"},{"indexed":False,"name":"_title","type":"string"},{"indexed":False,"name":"SuggestContent","type":"string"},{"indexed":False,"name":"time","type":"string"}],"name":"SUGGEST","type":"event"}],
    "contractAddress":"0x651ed36dfdbfd6dc50447a468d3749e25f7316ec",
      "funcName":"suggestUser",
    "funcParam":["17846","1611541715","关于提供退役军人金融优惠措施的建议","尊敬的领导，本人通过网络知道了了去年事务部和十大银行签了优抚协议，其它省份落实的很好，希望江西省也能对接下江西银行，江西农商银行等"],
    "useCns":False,
        "funcParam": [str(suggestKey), str(userKey), suggestTitle, suggestContent]
    }
    print("传的参数:")
    print(obj['funcParam'])
    data = json.dumps(obj)
    headers = {"Content-Type": "application/json"}  # 指定提交的是json
    r = requests.post(url, data=data, headers=headers)
    obj = json.loads(r.content.decode('utf-8'))
    print("增加用户留言返回结果")
    print(obj)
    if obj['message'].lower() == 'success':
        return True
    else:
        return False


# 4.链上获取建言内容
def getSuggestFromChain(suggestKey):
    url = 'https://frontjhw.jhw66.cn/WeBASE-Front/trans/handleWithSign'
    obj = {
    "groupId" :5,
    "signUserId": "fee97843cf0c45d683bade8fdebe724f",
    "contractAbi":[{"constant":True,"inputs":[{"name":"_proposeid","type":"string"}],"name":"getSuggestRecordArray","outputs":[{"name":"","type":"int8"},{"name":"","type":"string[]"}],"payable":False,"stateMutability":"view","type":"function"},{"constant":True,"inputs":[{"name":"_proposeid","type":"string"}],"name":"getSuggestRecordJson","outputs":[{"name":"","type":"int8"},{"name":"","type":"string"}],"payable":False,"stateMutability":"view","type":"function"},{"constant":True,"inputs":[{"name":"_proposeid","type":"string"}],"name":"getSuggestId","outputs":[{"name":"","type":"string"}],"payable":False,"stateMutability":"view","type":"function"},{"constant":False,"inputs":[{"name":"_fields","type":"string[]"},{"name":"index","type":"uint256"},{"name":"values","type":"string"}],"name":"getChangeFieldsString","outputs":[{"name":"","type":"string"}],"payable":False,"stateMutability":"nonpayable","type":"function"},{"constant":True,"inputs":[{"name":"_proposeid","type":"string"}],"name":"getSuggestContent","outputs":[{"name":"","type":"string"}],"payable":False,"stateMutability":"view","type":"function"},{"constant":False,"inputs":[{"name":"_proposeid","type":"string"},{"name":"_userid","type":"string"},{"name":"_title","type":"string"},{"name":"_content","type":"string"}],"name":"suggestUser","outputs":[{"name":"","type":"int8"}],"payable":False,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":False,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":False,"inputs":[{"indexed":False,"name":"Proposeid","type":"string"},{"indexed":False,"name":"Userid","type":"string"},{"indexed":False,"name":"_title","type":"string"},{"indexed":False,"name":"SuggestContent","type":"string"},{"indexed":False,"name":"time","type":"string"}],"name":"SUGGEST","type":"event"}],
    "contractAddress":"0x651ed36dfdbfd6dc50447a468d3749e25f7316ec",
        "funcName":"getSuggestRecordArray",
    "funcParam":["17846"],
    "useCns":False,
        "funcParam": [str(suggestKey)]
    }
    print("获取建言内容传的参数:")
    print(obj['funcParam'])
    data = json.dumps(obj)
    headers = {"Content-Type": "application/json"}  # 指定提交的是json
    r = requests.post(url, data=data, headers=headers)
    obj = json.loads(r.content.decode('utf-8'))
    print("增加用户留言返回结果")
    print(obj)
    return obj


# 5链上获取建言者id，用于信用管理
def getSuggesterId(suggestKey):
    url = 'https://frontjhw.jhw66.cn/WeBASE-Front/trans/handleWithSign'
    obj = {
    "groupId" :5,
    "signUserId": "fee97843cf0c45d683bade8fdebe724f",
    "contractAbi":[{"constant":True,"inputs":[{"name":"_proposeid","type":"string"}],"name":"getSuggestRecordArray","outputs":[{"name":"","type":"int8"},{"name":"","type":"string[]"}],"payable":False,"stateMutability":"view","type":"function"},{"constant":True,"inputs":[{"name":"_proposeid","type":"string"}],"name":"getSuggestRecordJson","outputs":[{"name":"","type":"int8"},{"name":"","type":"string"}],"payable":False,"stateMutability":"view","type":"function"},{"constant":True,"inputs":[{"name":"_proposeid","type":"string"}],"name":"getSuggestId","outputs":[{"name":"","type":"string"}],"payable":False,"stateMutability":"view","type":"function"},{"constant":False,"inputs":[{"name":"_fields","type":"string[]"},{"name":"index","type":"uint256"},{"name":"values","type":"string"}],"name":"getChangeFieldsString","outputs":[{"name":"","type":"string"}],"payable":False,"stateMutability":"nonpayable","type":"function"},{"constant":True,"inputs":[{"name":"_proposeid","type":"string"}],"name":"getSuggestContent","outputs":[{"name":"","type":"string"}],"payable":False,"stateMutability":"view","type":"function"},{"constant":False,"inputs":[{"name":"_proposeid","type":"string"},{"name":"_userid","type":"string"},{"name":"_title","type":"string"},{"name":"_content","type":"string"}],"name":"suggestUser","outputs":[{"name":"","type":"int8"}],"payable":False,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":False,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":False,"inputs":[{"indexed":False,"name":"Proposeid","type":"string"},{"indexed":False,"name":"Userid","type":"string"},{"indexed":False,"name":"_title","type":"string"},{"indexed":False,"name":"SuggestContent","type":"string"},{"indexed":False,"name":"time","type":"string"}],"name":"SUGGEST","type":"event"}],
    "contractAddress":"0x651ed36dfdbfd6dc50447a468d3749e25f7316ec",
    "funcName":"getSuggestId",
    "funcParam":["17846"],
    "useCns":False,
        "funcParam": [str(suggestKey)]
    }
    print("获取建言内容传的参数:")
    print(obj['funcParam'])
    data = json.dumps(obj)
    headers = {"Content-Type": "application/json"}  # 指定提交的是json
    r = requests.post(url, data=data, headers=headers)
    obj = json.loads(r.content.decode('utf-8'))
    print("增加用户留言返回结果")
    print(obj)
    return int(obj[0])


# 6公文材料文件信息上链
def uploadOfficeFile(fileKey, userKey, dataHash):
    url = 'https://frontjhw.jhw66.cn/WeBASE-Front/trans/handleWithSign'
    obj = {
    "groupId" :5,
    "signUserId": "fee97843cf0c45d683bade8fdebe724f",
    "contractAbi":[{"constant":True,"inputs":[{"name":"_applicationid","type":"string"}],"name":"getApplyHash","outputs":[{"name":"","type":"string"}],"payable":False,"stateMutability":"view","type":"function"},{"constant":False,"inputs":[{"name":"_applicationid","type":"string"},{"name":"_userid","type":"string"},{"name":"_informationhash","type":"string"}],"name":"applyForDocument","outputs":[{"name":"","type":"int8"}],"payable":False,"stateMutability":"nonpayable","type":"function"},{"constant":True,"inputs":[{"name":"_applicationid","type":"string"}],"name":"getLeaderSignHash","outputs":[{"name":"","type":"string"}],"payable":False,"stateMutability":"view","type":"function"},{"constant":False,"inputs":[{"name":"_fields","type":"string[]"},{"name":"index","type":"uint256"},{"name":"values","type":"string"}],"name":"getChangeFieldsString","outputs":[{"name":"","type":"string"}],"payable":False,"stateMutability":"nonpayable","type":"function"},{"constant":True,"inputs":[{"name":"_applicationid","type":"string"}],"name":"getApplyJson","outputs":[{"name":"","type":"int8"},{"name":"","type":"string"}],"payable":False,"stateMutability":"view","type":"function"},{"constant":False,"inputs":[{"name":"_checkerid","type":"string"},{"name":"_applicationid","type":"string"},{"name":"checkresult","type":"string"}],"name":"GiveResultToUser","outputs":[{"name":"","type":"int8"}],"payable":False,"stateMutability":"nonpayable","type":"function"},{"constant":False,"inputs":[{"name":"_applicationid","type":"string"},{"name":"checkhash","type":"string"}],"name":"checkApplyResearch","outputs":[{"name":"","type":"int8"}],"payable":False,"stateMutability":"nonpayable","type":"function"},{"constant":True,"inputs":[{"name":"_applicationid","type":"string"}],"name":"getUserApplyArray","outputs":[{"name":"","type":"int8"},{"name":"","type":"string[]"}],"payable":False,"stateMutability":"view","type":"function"},{"inputs":[],"payable":False,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":False,"inputs":[{"indexed":False,"name":"userid","type":"string"},{"indexed":False,"name":"application_id","type":"string"},{"indexed":False,"name":"date","type":"string"}],"name":"APPLY_DOCUMENT_EVENT","type":"event"},{"anonymous":False,"inputs":[{"indexed":False,"name":"applicationid","type":"string"},{"indexed":False,"name":"signHash","type":"string"},{"indexed":False,"name":"date","type":"string"}],"name":"Track_LeaderSignature","type":"event"},{"anonymous":False,"inputs":[{"indexed":False,"name":"applicationid","type":"string"},{"indexed":False,"name":"checkerid","type":"string"},{"indexed":False,"name":"result","type":"string"},{"indexed":False,"name":"date","type":"string"}],"name":"Tack_Final_Result","type":"event"}],
    "contractAddress":"0x98b9db3f2db6df5d912551b6672a87ae0e9202d7",
   "funcName":"applyForDocument",
    "funcParam":["1976945","1611541715","f44e39c1fc14dc05143eeba2065a921bbbc1bba5"],
    "useCns":False,
        "funcParam": [str(fileKey), str(userKey), dataHash]
    }
    print("传的参数:")
    print(obj['funcParam'])
    data = json.dumps(obj)
    headers = {"Content-Type": "application/json"}  # 指定提交的是json
    r = requests.post(url, data=data, headers=headers)
    obj = json.loads(r.content.decode('utf-8'))
    print(obj)
    if obj['message'].lower() == 'success':
        return True
    else:
        return False

#7领导签字
def bossSignOnChain(fileKey, signHash):
    url = 'https://frontjhw.jhw66.cn/WeBASE-Front/trans/handleWithSign'
    obj = {
    "groupId" :5,
    "signUserId": "fee97843cf0c45d683bade8fdebe724f",
    "contractAbi":[{"constant":True,"inputs":[{"name":"_applicationid","type":"string"}],"name":"getApplyHash","outputs":[{"name":"","type":"string"}],"payable":False,"stateMutability":"view","type":"function"},{"constant":False,"inputs":[{"name":"_applicationid","type":"string"},{"name":"_userid","type":"string"},{"name":"_informationhash","type":"string"}],"name":"applyForDocument","outputs":[{"name":"","type":"int8"}],"payable":False,"stateMutability":"nonpayable","type":"function"},{"constant":True,"inputs":[{"name":"_applicationid","type":"string"}],"name":"getLeaderSignHash","outputs":[{"name":"","type":"string"}],"payable":False,"stateMutability":"view","type":"function"},{"constant":False,"inputs":[{"name":"_fields","type":"string[]"},{"name":"index","type":"uint256"},{"name":"values","type":"string"}],"name":"getChangeFieldsString","outputs":[{"name":"","type":"string"}],"payable":False,"stateMutability":"nonpayable","type":"function"},{"constant":True,"inputs":[{"name":"_applicationid","type":"string"}],"name":"getApplyJson","outputs":[{"name":"","type":"int8"},{"name":"","type":"string"}],"payable":False,"stateMutability":"view","type":"function"},{"constant":False,"inputs":[{"name":"_checkerid","type":"string"},{"name":"_applicationid","type":"string"},{"name":"checkresult","type":"string"}],"name":"GiveResultToUser","outputs":[{"name":"","type":"int8"}],"payable":False,"stateMutability":"nonpayable","type":"function"},{"constant":False,"inputs":[{"name":"_applicationid","type":"string"},{"name":"checkhash","type":"string"}],"name":"checkApplyResearch","outputs":[{"name":"","type":"int8"}],"payable":False,"stateMutability":"nonpayable","type":"function"},{"constant":True,"inputs":[{"name":"_applicationid","type":"string"}],"name":"getUserApplyArray","outputs":[{"name":"","type":"int8"},{"name":"","type":"string[]"}],"payable":False,"stateMutability":"view","type":"function"},{"inputs":[],"payable":False,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":False,"inputs":[{"indexed":False,"name":"userid","type":"string"},{"indexed":False,"name":"application_id","type":"string"},{"indexed":False,"name":"date","type":"string"}],"name":"APPLY_DOCUMENT_EVENT","type":"event"},{"anonymous":False,"inputs":[{"indexed":False,"name":"applicationid","type":"string"},{"indexed":False,"name":"signHash","type":"string"},{"indexed":False,"name":"date","type":"string"}],"name":"Track_LeaderSignature","type":"event"},{"anonymous":False,"inputs":[{"indexed":False,"name":"applicationid","type":"string"},{"indexed":False,"name":"checkerid","type":"string"},{"indexed":False,"name":"result","type":"string"},{"indexed":False,"name":"date","type":"string"}],"name":"Tack_Final_Result","type":"event"}],
    "contractAddress":"0x98b9db3f2db6df5d912551b6672a87ae0e9202d7",
   "funcName":"checkApplyResearch",
    "funcParam":["1976945","f88r46f6ki14dc05143eeba2065a921bbbc1bbqi5"],
    "useCns":False,
        "funcParam": [str(fileKey), signHash]
    }

    print("bossSign传的参数:")
    print(obj['funcParam'])
    data = json.dumps(obj)
    headers = {"Content-Type": "application/json"}  # 指定提交的是json
    r = requests.post(url, data=data, headers=headers)
    obj = json.loads(r.content.decode('utf-8'))
    print(obj)
    if obj['message'].lower() == 'success':
        return True
    else:
        return False

#8结果上链
def checkResultOnChain(userKey, fileKey, result):  # result为"通过"，"不通过"
    url = 'https://frontjhw.jhw66.cn/WeBASE-Front/trans/handleWithSign'
    obj = {
    "groupId" :5,
    "signUserId": "fee97843cf0c45d683bade8fdebe724f",
    "contractAbi":[{"constant":True,"inputs":[{"name":"_applicationid","type":"string"}],"name":"getApplyHash","outputs":[{"name":"","type":"string"}],"payable":False,"stateMutability":"view","type":"function"},{"constant":False,"inputs":[{"name":"_applicationid","type":"string"},{"name":"_userid","type":"string"},{"name":"_informationhash","type":"string"}],"name":"applyForDocument","outputs":[{"name":"","type":"int8"}],"payable":False,"stateMutability":"nonpayable","type":"function"},{"constant":True,"inputs":[{"name":"_applicationid","type":"string"}],"name":"getLeaderSignHash","outputs":[{"name":"","type":"string"}],"payable":False,"stateMutability":"view","type":"function"},{"constant":False,"inputs":[{"name":"_fields","type":"string[]"},{"name":"index","type":"uint256"},{"name":"values","type":"string"}],"name":"getChangeFieldsString","outputs":[{"name":"","type":"string"}],"payable":False,"stateMutability":"nonpayable","type":"function"},{"constant":True,"inputs":[{"name":"_applicationid","type":"string"}],"name":"getApplyJson","outputs":[{"name":"","type":"int8"},{"name":"","type":"string"}],"payable":False,"stateMutability":"view","type":"function"},{"constant":False,"inputs":[{"name":"_checkerid","type":"string"},{"name":"_applicationid","type":"string"},{"name":"checkresult","type":"string"}],"name":"GiveResultToUser","outputs":[{"name":"","type":"int8"}],"payable":False,"stateMutability":"nonpayable","type":"function"},{"constant":False,"inputs":[{"name":"_applicationid","type":"string"},{"name":"checkhash","type":"string"}],"name":"checkApplyResearch","outputs":[{"name":"","type":"int8"}],"payable":False,"stateMutability":"nonpayable","type":"function"},{"constant":True,"inputs":[{"name":"_applicationid","type":"string"}],"name":"getUserApplyArray","outputs":[{"name":"","type":"int8"},{"name":"","type":"string[]"}],"payable":False,"stateMutability":"view","type":"function"},{"inputs":[],"payable":False,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":False,"inputs":[{"indexed":False,"name":"userid","type":"string"},{"indexed":False,"name":"application_id","type":"string"},{"indexed":False,"name":"date","type":"string"}],"name":"APPLY_DOCUMENT_EVENT","type":"event"},{"anonymous":False,"inputs":[{"indexed":False,"name":"applicationid","type":"string"},{"indexed":False,"name":"signHash","type":"string"},{"indexed":False,"name":"date","type":"string"}],"name":"Track_LeaderSignature","type":"event"},{"anonymous":False,"inputs":[{"indexed":False,"name":"applicationid","type":"string"},{"indexed":False,"name":"checkerid","type":"string"},{"indexed":False,"name":"result","type":"string"},{"indexed":False,"name":"date","type":"string"}],"name":"Tack_Final_Result","type":"event"}],
    "contractAddress":"0x98b9db3f2db6df5d912551b6672a87ae0e9202d7",
    "funcName":"GiveResultToUser",
    "funcParam":["1671641799","1976945","通过"],
    "useCns":False,
        "funcParam": [userKey, str(fileKey), result]
    }
    print("checkResultOnChain传的参数:")
    print(obj['funcParam'])
    data = json.dumps(obj)
    headers = {"Content-Type": "application/json"}  # 指定提交的是json
    r = requests.post(url, data=data, headers=headers)
    obj = json.loads(r.content.decode('utf-8'))
    print(obj)
    if obj['message'].lower() == 'success':
        return True
    else:
        return False

#9公开结果
def turnToShowFileToPeople(fileKey, userId, fileHash):
    url = 'https://frontjhw.jhw66.cn/WeBASE-Front/trans/handleWithSign'
    obj = {
    "groupId" :5,
    "signUserId": "fee97843cf0c45d683bade8fdebe724f",
    "contractAbi":[{"constant":True,"inputs":[{"name":"_applicationid","type":"string"}],"name":"getDocumentJson","outputs":[{"name":"","type":"int8"},{"name":"","type":"string"}],"payable":False,"stateMutability":"view","type":"function"},{"constant":False,"inputs":[{"name":"_leaderid","type":"string"},{"name":"_usertype","type":"string"},{"name":"_datatype","type":"string"}],"name":"SetLogForDatePublic","outputs":[{"name":"","type":"bool"}],"payable":False,"stateMutability":"nonpayable","type":"function"},{"constant":True,"inputs":[{"name":"_documentid","type":"string"}],"name":"getDownloadsNum","outputs":[{"name":"","type":"uint256"}],"payable":False,"stateMutability":"view","type":"function"},{"constant":True,"inputs":[{"name":"_applicationid","type":"string"}],"name":"getDocumentArray","outputs":[{"name":"","type":"int8"},{"name":"","type":"string[]"}],"payable":False,"stateMutability":"view","type":"function"},{"constant":False,"inputs":[{"name":"_fields","type":"string[]"},{"name":"index","type":"uint256"},{"name":"values","type":"string"}],"name":"getChangeFieldsString","outputs":[{"name":"","type":"string"}],"payable":False,"stateMutability":"nonpayable","type":"function"},{"constant":False,"inputs":[{"name":"downloadsid","type":"string"},{"name":"_documentid","type":"string"}],"name":"UpdateDownloadsNum","outputs":[{"name":"","type":"int8"}],"payable":False,"stateMutability":"nonpayable","type":"function"},{"constant":False,"inputs":[{"name":"_applicationid","type":"string"},{"name":"_fields","type":"string"}],"name":"PublicDocument","outputs":[{"name":"","type":"int8"}],"payable":False,"stateMutability":"nonpayable","type":"function"},{"constant":False,"inputs":[{"name":"_downloadsid","type":"string"},{"name":"_datatype","type":"string"}],"name":"SetLogForDateDownload","outputs":[{"name":"","type":"bool"}],"payable":False,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":False,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":False,"inputs":[{"indexed":False,"name":"downloadid","type":"string"},{"indexed":False,"name":"applicationid","type":"string"},{"indexed":False,"name":"date","type":"string"},{"indexed":False,"name":"downloadsnum","type":"string"}],"name":"DownLoads_Document_EVENT","type":"event"},{"anonymous":False,"inputs":[{"indexed":False,"name":"downloadid","type":"string"},{"indexed":False,"name":"_datatype","type":"string"},{"indexed":False,"name":"date","type":"string"}],"name":"DateLog_Track_Event","type":"event"},{"anonymous":False,"inputs":[{"indexed":False,"name":"leaderid","type":"string"},{"indexed":False,"name":"usertype","type":"string"},{"indexed":False,"name":"datetype","type":"string"},{"indexed":False,"name":"date","type":"string"}],"name":"Track_DatePublish","type":"event"},{"anonymous":False,"inputs":[{"indexed":False,"name":"applicationid","type":"string"},{"indexed":False,"name":"fields","type":"string"}],"name":"Public_Document","type":"event"}],
    "contractAddress":"0x4ff98862186ada02effaba06bdc891cb9b037c01",
       "funcName":"PublicDocument",
    "funcParam":["1976946","1671681769,f44e39c1fc14dc05143eeba2065a921bbbc1bba5,2021年1月19日14点28分"],
    "useCns":False,
        "funcParam": [str(fileKey),
                      userId + ',' + fileHash + ',' + datetime.datetime.now().strftime('%Y年%m月%d日 %H点%M分')]
    }
    print('turnToShowFileToPeople执行')
    print(obj['funcParam'])
    data = json.dumps(obj)
    headers = {"Content-Type": "application/json"}  # 指定提交的是json
    r = requests.post(url, data=data, headers=headers)
    obj = json.loads(r.content.decode('utf-8'))
    print(obj)
    if obj['message'].lower() == 'success':
        return True
    else:
        return False


#10更新下载次数
def updateFileDownloadNum(userKey, fileKey):
    url = 'https://frontjhw.jhw66.cn/WeBASE-Front/trans/handleWithSign'
    obj = {
    "groupId" :5,
    "signUserId": "fee97843cf0c45d683bade8fdebe724f",
    "contractAbi":[{"constant":True,"inputs":[{"name":"_applicationid","type":"string"}],"name":"getDocumentJson","outputs":[{"name":"","type":"int8"},{"name":"","type":"string"}],"payable":False,"stateMutability":"view","type":"function"},{"constant":False,"inputs":[{"name":"_leaderid","type":"string"},{"name":"_usertype","type":"string"},{"name":"_datatype","type":"string"}],"name":"SetLogForDatePublic","outputs":[{"name":"","type":"bool"}],"payable":False,"stateMutability":"nonpayable","type":"function"},{"constant":True,"inputs":[{"name":"_documentid","type":"string"}],"name":"getDownloadsNum","outputs":[{"name":"","type":"uint256"}],"payable":False,"stateMutability":"view","type":"function"},{"constant":True,"inputs":[{"name":"_applicationid","type":"string"}],"name":"getDocumentArray","outputs":[{"name":"","type":"int8"},{"name":"","type":"string[]"}],"payable":False,"stateMutability":"view","type":"function"},{"constant":False,"inputs":[{"name":"_fields","type":"string[]"},{"name":"index","type":"uint256"},{"name":"values","type":"string"}],"name":"getChangeFieldsString","outputs":[{"name":"","type":"string"}],"payable":False,"stateMutability":"nonpayable","type":"function"},{"constant":False,"inputs":[{"name":"downloadsid","type":"string"},{"name":"_documentid","type":"string"}],"name":"UpdateDownloadsNum","outputs":[{"name":"","type":"int8"}],"payable":False,"stateMutability":"nonpayable","type":"function"},{"constant":False,"inputs":[{"name":"_applicationid","type":"string"},{"name":"_fields","type":"string"}],"name":"PublicDocument","outputs":[{"name":"","type":"int8"}],"payable":False,"stateMutability":"nonpayable","type":"function"},{"constant":False,"inputs":[{"name":"_downloadsid","type":"string"},{"name":"_datatype","type":"string"}],"name":"SetLogForDateDownload","outputs":[{"name":"","type":"bool"}],"payable":False,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":False,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":False,"inputs":[{"indexed":False,"name":"downloadid","type":"string"},{"indexed":False,"name":"applicationid","type":"string"},{"indexed":False,"name":"date","type":"string"},{"indexed":False,"name":"downloadsnum","type":"string"}],"name":"DownLoads_Document_EVENT","type":"event"},{"anonymous":False,"inputs":[{"indexed":False,"name":"downloadid","type":"string"},{"indexed":False,"name":"_datatype","type":"string"},{"indexed":False,"name":"date","type":"string"}],"name":"DateLog_Track_Event","type":"event"},{"anonymous":False,"inputs":[{"indexed":False,"name":"leaderid","type":"string"},{"indexed":False,"name":"usertype","type":"string"},{"indexed":False,"name":"datetype","type":"string"},{"indexed":False,"name":"date","type":"string"}],"name":"Track_DatePublish","type":"event"},{"anonymous":False,"inputs":[{"indexed":False,"name":"applicationid","type":"string"},{"indexed":False,"name":"fields","type":"string"}],"name":"Public_Document","type":"event"}],
    "contractAddress":"0x4ff98862186ada02effaba06bdc891cb9b037c01",
       "funcName":"UpdateDownloadsNum",
    "funcParam":["1976946","1976946"],
    "useCns":False,
        "funcParam": [str(userKey), str(fileKey)]
    }
    print("bossCheck传的参数:")
    print(obj['funcParam'])
    data = json.dumps(obj)
    headers = {"Content-Type": "application/json"}  # 指定提交的是json
    r = requests.post(url, data=data, headers=headers)
    obj = json.loads(r.content.decode('utf-8'))
    print(obj)
    if obj['message'].lower() == 'success':
        return True
    else:
        return False

#11数据追踪
def setLogForDatePublic(userKey, objText, infoText):
    url = 'https://frontjhw.jhw66.cn/WeBASE-Front/trans/handleWithSign'
    obj = {
    "groupId" :5,
    "signUserId": "fee97843cf0c45d683bade8fdebe724f",
    "contractAbi":[{"constant":True,"inputs":[{"name":"_applicationid","type":"string"}],"name":"getDocumentJson","outputs":[{"name":"","type":"int8"},{"name":"","type":"string"}],"payable":False,"stateMutability":"view","type":"function"},{"constant":False,"inputs":[{"name":"_leaderid","type":"string"},{"name":"_usertype","type":"string"},{"name":"_datatype","type":"string"}],"name":"SetLogForDatePublic","outputs":[{"name":"","type":"bool"}],"payable":False,"stateMutability":"nonpayable","type":"function"},{"constant":True,"inputs":[{"name":"_documentid","type":"string"}],"name":"getDownloadsNum","outputs":[{"name":"","type":"uint256"}],"payable":False,"stateMutability":"view","type":"function"},{"constant":True,"inputs":[{"name":"_applicationid","type":"string"}],"name":"getDocumentArray","outputs":[{"name":"","type":"int8"},{"name":"","type":"string[]"}],"payable":False,"stateMutability":"view","type":"function"},{"constant":False,"inputs":[{"name":"_fields","type":"string[]"},{"name":"index","type":"uint256"},{"name":"values","type":"string"}],"name":"getChangeFieldsString","outputs":[{"name":"","type":"string"}],"payable":False,"stateMutability":"nonpayable","type":"function"},{"constant":False,"inputs":[{"name":"downloadsid","type":"string"},{"name":"_documentid","type":"string"}],"name":"UpdateDownloadsNum","outputs":[{"name":"","type":"int8"}],"payable":False,"stateMutability":"nonpayable","type":"function"},{"constant":False,"inputs":[{"name":"_applicationid","type":"string"},{"name":"_fields","type":"string"}],"name":"PublicDocument","outputs":[{"name":"","type":"int8"}],"payable":False,"stateMutability":"nonpayable","type":"function"},{"constant":False,"inputs":[{"name":"_downloadsid","type":"string"},{"name":"_datatype","type":"string"}],"name":"SetLogForDateDownload","outputs":[{"name":"","type":"bool"}],"payable":False,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":False,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":False,"inputs":[{"indexed":False,"name":"downloadid","type":"string"},{"indexed":False,"name":"applicationid","type":"string"},{"indexed":False,"name":"date","type":"string"},{"indexed":False,"name":"downloadsnum","type":"string"}],"name":"DownLoads_Document_EVENT","type":"event"},{"anonymous":False,"inputs":[{"indexed":False,"name":"downloadid","type":"string"},{"indexed":False,"name":"_datatype","type":"string"},{"indexed":False,"name":"date","type":"string"}],"name":"DateLog_Track_Event","type":"event"},{"anonymous":False,"inputs":[{"indexed":False,"name":"leaderid","type":"string"},{"indexed":False,"name":"usertype","type":"string"},{"indexed":False,"name":"datetype","type":"string"},{"indexed":False,"name":"date","type":"string"}],"name":"Track_DatePublish","type":"event"},{"anonymous":False,"inputs":[{"indexed":False,"name":"applicationid","type":"string"},{"indexed":False,"name":"fields","type":"string"}],"name":"Public_Document","type":"event"}],
    "contractAddress":"0x4ff98862186ada02effaba06bdc891cb9b037c01",
        "funcName":"SetLogForDatePublic",
    "useCns":False,
   "funcParam": [userKey, objText, infoText]
    }
    print("setLogForDatePublic传的参数:")
    print(obj['funcParam'])
    data = json.dumps(obj)
    headers = {"Content-Type": "application/json"}  # 指定提交的是json
    r = requests.post(url, data=data, headers=headers)
    obj = json.loads(r.content.decode('utf-8'))
    print(obj)
    if obj['message'].lower() == 'success':
        return True
    else:
        return False