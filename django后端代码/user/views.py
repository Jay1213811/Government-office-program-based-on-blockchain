import json
import datetime
import re
import time

# Create your views here.
from user.models import User, Suggest, OfficeFile, OfficeMember, Office, DownloadRecord, DataDisclosure
from jwt import ExpiredSignatureError

from utils.apiTest import registered, updateUserCredit, addSuggestToChain, getSuggesterId, \
    bossSignOnChain, checkResultOnChain, getSuggestFromChain, uploadOfficeFile, turnToShowFileToPeople, \
    updateFileDownloadNum, setLogForDatePublic
from utils.appInfo import miniProgramAppID, miniProgramApp, Bucket, SecretKey, AccessKey
import jwt
from django.http import JsonResponse, HttpResponse
import requests
import qiniu
import datetime
import hashlib

from utils.checkContent import checkContent
from utils.getUser import get_user


def get_openid_session_key(request):  # 获取openid和session_key，创建用户数据，并返回加密token给前端
    appid = miniProgramAppID
    app_secret = miniProgramApp
    # primary_key_id = 0  # 记录用户主键
    js_code = json.loads(request.body)  # js_code为dict = {'code': '……'}
    """js_code = str(request.body)[2:-1] # request.body为b'code'，类型为bytes，故将其转为string且用字符串方法去掉b''"""
    # js_code = request.GET.get('code')  # get方法
    url = 'https://api.weixin.qq.com/sns/jscode2session' + '?appid=' + appid + '&secret=' + app_secret + '&js_code=' + \
          js_code['code'] + '&grant_type=authorization_code'
    r = requests.get(url)
    # print(r.json())
    openId = r.json()['openid']
    """try:
        UnionId = r.json()['unionid']
    except Exception as e:
        print(e)
        UnionId = None"""
    # session_key = r.json()['session_key']
    try:
        user = User.objects.get(openId=openId)
    except Exception as e:
        user = None
    if user:
        primary_key_id = user.id
        print('数据库中有该用户\n')
    else:
        print('注册新用户\n')
        user = User(openId=openId)
        user.userLoginName = str(int(time.time()))
        user.save()
        primary_key_id = user.id  # 主键
    secret = b'\x3d\xef\x87\xd5\xf8\xbb\xff\xfc\x80\x91\x06\x91\xfd\xfc\xed\x69'
    dic = {
        'exp': datetime.datetime.now() + datetime.timedelta(hours=3),  # 过期时间
        'iat': datetime.datetime.now(),  # 开始时间
        'iss': 'cyb',  # 签名
        'data': {  # 内容，一般存放该用户id和开始时间
            'id': primary_key_id,
            'openId': openId,
        },
    }  # 由此生成的token将由用户保存，不存入数据库。用户传回服务端后，解析出整数型主键id（用以检索，速度比检索openid快）
    encrypted_string = jwt.encode(dic, secret, algorithm='HS256')
    # jwt.encode为加密生成字节流,为b'code'，类型为bytes，故将其转为string且用字符串方法去掉b'
    # print('get_openid_session_key运行结束\n')
    dicIncludeTokenAndUserid = {
        'token': encrypted_string,  # 学长服务器那里不知道为啥不用转换
        # 'token': str(encrypted_string, encoding='utf-8'),  # encrypted_string为bytes类型，需转为字符串才能通过jsonResponse传输
        'userId': primary_key_id,  # 若直接把字节型的encrypted_string通过HttpResponse传给前端，前端会自动转为字符串
        'idNumber': user.userLoginName,
        # 'registeredStatus': checkRegistered(user.id),
        # 'creditPoint': user.userCreditPoint,
        'addressToCopy': user.accountAddress,
        'publicKeyToCopy': user.accountPk,
        'privateKeyToCopy': user.accountSk,
        # 'hadApply': user.hadApply,
        'userType': user.userType,
        "userWxName": user.userWxName,
        "avatarUrl": user.avatarUrl,
    }
    # print('返回dicIncludeTokenAndUserid')
    return JsonResponse(dicIncludeTokenAndUserid, safe=False)


def check_token(request):
    secret = b'\x3d\xef\x87\xd5\xf8\xbb\xff\xfc\x80\x91\x06\x91\xfd\xfc\xed\x69'
    encrypted_string = json.loads(request.body)
    print('check_token开始运行\n')
    try:
        decrypt_string = jwt.decode(encrypted_string['token'], secret, issuer='cyb', algorithms=['HS256'])  # 解密，校验签名
        print('check_token运行结束，返回true\n')
        primary_key = (decrypt_string['data'])['id']
        user = User.objects.get(id=primary_key)
        data = {
            'idNumber': user.userLoginName,
            "tokenActivate": "true",
            'userId': primary_key,
            'userType': user.userType,
            # 'registeredStatus': checkRegistered(user.id),
            # 'creditPoint': getCredit(user.id),
            'addressToCopy': user.accountAddress,
            'publicKeyToCopy': user.accountPk,
            'privateKeyToCopy': user.accountSk,
            # 'hadApply': user.hadApply,
            "userWxName": user.userWxName,
            "avatarUrl": user.avatarUrl,
        }
        return JsonResponse(data)  # 没过期
    except ExpiredSignatureError:
        print('check_token运行结束，返回false\n')
        data = {"token": "false"}
        return JsonResponse(data)  # 过期，令前端重新调用函数get_openid_session_key
    except jwt.exceptions.DecodeError:
        print('check_token运行结束，getProxy返回false\n')
        data = {"token": "false"}
        return JsonResponse(data)  # 过期，令前端重新调用函数get_openid_session_key


def getUserInfo(request):
    obj = json.loads(request.body)
    user = get_user(obj)
    if not user:
        return HttpResponse('false')  # token过期
    else:
        if obj['funType'] == 0:
            user.userWxName = obj['name']
            user.avatarUrl = obj['avatarUrl']
            user.save()
        userTypeList = []
        choices = User.userTypeChoices
        for c in choices:
            userTypeList.append(c[1])
        data = {'userType': user.userType, 'userTypeList': userTypeList}
        if obj['funType'] == 1:
            data['avatarUrl'] = user.avatarUrl
            data['nickName'] = user.userWxName
        return JsonResponse(data, safe=False)


def setPassword(request):
    obj = json.loads(request.body)
    user = get_user(obj)
    if not user:
        return HttpResponse('false')  # token过期
    else:
        s = hashlib.sha256()  # Get the hash algorithm.
        s.update(obj['password'].encode("utf8"))  # Hash the data.
        user.userPassword = s.hexdigest()  # Get he hash value.
        user.registeredStatus = True
        user.userType = int(obj['userType'])
        user.save()
        user.activateTime = datetime.datetime.now()
        registered(user.userLoginName, user.userWxName, obj['password'], User.userTypeChoices[int(obj['userType'])][1])
        url = 'https://frontjhw.jhw66.cn/WeBASE-Front/privateKey?type=0&userName=' + str(user.userLoginName)
        print("url:")
        print(url)
        r = requests.get(url)
        obj = json.loads(r.content.decode('utf-8'))
        user.accountAddress = obj['address']
        user.accountPk = obj['publicKey']
        user.accountSk = obj['privateKey']
        user.save()
        print('注册结果：')
        print(obj)
        return HttpResponse("true")


def addSuggest(request):
    obj = json.loads(request.body)
    user = get_user(obj)
    if not user:
        return HttpResponse('false')  # token过期
    else:
        suggest = Suggest(user_id=user.id, suggestTitle=obj['suggestTitle'], suggestContent=obj['suggestContent'])
        suggest.save()
        addSuggestToChain(suggest.id, user.userLoginName, suggest.suggestTitle, suggest.suggestContent)
        content = getSuggestFromChain(suggest.id)[1]
        suggestFromChain = content[1]
        titleStartIndex = re.search('建议标题为:', suggestFromChain).span()[1]
        contentStartIndex = re.search('建议内容为:', suggestFromChain).span()[1]
        data1 = checkContent(suggestFromChain[titleStartIndex:contentStartIndex - 6])
        data2 = checkContent(suggestFromChain[contentStartIndex:])
        suggest.changeSuggestTitle = data1['text']
        suggest.changeSuggestContent = data2['text']
        if data1['num'] > 0 or data2['num'] > 0:
            suggest.isCompliance = False
            user.userCreditPoint = user.userCreditPoint - 1
            user.save()
        else:
            suggest.isCompliance = True
        suggest.save()
        if suggest.isCompliance is False:
            suggesterId = getSuggesterId(suggest.id)
            updateUserCredit(suggesterId, 1, 0)
    return HttpResponse("success")


def return_qiniu_upload_token(request):
    bucket = Bucket  # 上传的空间名
    key = ""  # 上传的文件名，默认为空
    auth = qiniu.Auth(AccessKey, SecretKey)
    policy = {
        # "mimeLimit": "image/*"
    }
    upToken = auth.upload_token(bucket, policy=policy)  # 生成上传凭证
    # upToken = auth.upload_token(bucket)  # 生成上传凭证
    # print('upToken:')
    # print(upToken)
    data = {"uptoken": upToken}
    return JsonResponse(data, safe=False)


"""def getData(request):
    obj = json.loads(request.body)
    user = get_user(obj)
    if not user:
        return HttpResponse('false')  # token过期
    else:
        data = Data(user_id=user.id, dataTitle=obj['dataTitle'], dataIntroduction=obj['dataIntroduction'],
                    dataHash=obj['dataHash'], dataLink=obj['dataLink'], dataValue=obj['dataValue'])
        data.save()
        uploadDateResource(data.id, user.userLoginName, data.dataHash, data.dataValue,
                           data.uploadTime.strftime("%Y年%m月%d日"))
        return HttpResponse('success')"""


def returnSuggestList(request):
    obj = json.loads(request.body)
    pageSize = 10
    currentPage = obj['currentPage']
    startRow = (currentPage - 1) * pageSize
    endRow = currentPage * pageSize
    suggests = Suggest.objects.all().order_by('-id')[startRow:endRow]
    suggestList = []
    for s in suggests:
        obj = {"id": s.id, "userId": s.user.userLoginName, 'title': s.changeSuggestTitle,
               "content": s.changeSuggestContent,
               "isCompliance": s.isCompliance, "suggestTime": s.suggestTime.strftime("%Y.%m.%d")}
        suggestList.append(obj)
    return JsonResponse({"suggestList": suggestList})


"""def returnResourceList(request):
    obj = json.loads(request.body)
    user = get_user(obj)
    if not user:
        return HttpResponse('false')  # token过期
    else:
        pageSize = 10
        currentPage = obj['currentPage']
        startRow = (currentPage - 1) * pageSize
        endRow = currentPage * pageSize
        resources = Data.objects.all().order_by('-id')[startRow:endRow]
        dataList = []
        for r in resources:
            obj = {"id": r.id, "userId": r.user.userLoginName, 'title': r.dataTitle, "introduction": r.dataIntroduction,
                   "dataLink": r.dataLink, "downloadNum": r.downloadsNum, "dataValue": r.dataValue,
                   "uploadTime": r.uploadTime.strftime("%Y.%m.%d"), 'dataHash': r.dataHash}
            dataList.append(obj)
        return JsonResponse({"dataList": dataList})"""


def dataDownload(request):
    obj = json.loads(request.body)
    user = get_user(obj)
    if not user:
        return HttpResponse('false')  # token过期
    else:
        data = OfficeFile.objects.get(id=int(obj['dataId']))
        data.downloadsNum = data.downloadsNum + 1
        data.save()
        downloadRecord = DownloadRecord.objects.create(user_id=user.id, officeFile_id=data.id)
        downloadRecord.save()
        updateFileDownloadNum(user.userLoginName, data.id)

        return HttpResponse("success")


def getAdminPassword(request):
    obj = json.loads(request.body)
    user = get_user(obj)
    if not user:
        return HttpResponse('false')  # token过期
    else:
        officeMember = OfficeMember.objects.get(account=obj['account'])
        if obj['password'] == officeMember.password:
            choices = OfficeMember.identityChoices
            adminTypeList = []
            for c in choices:
                adminTypeList.append(c[1])
            return JsonResponse(
                {'identity': officeMember.identity, 'id': officeMember.id, 'departmentId': officeMember.department.id,
                 'departmentName': officeMember.department.departmentName, 'status': 'success',
                 'adminTypeList': adminTypeList})
        else:
            return JsonResponse({'status': 'failed'})


def getApplyData(request):
    obj = json.loads(request.body)
    user = get_user(obj)
    if not user:
        return HttpResponse('false')  # token过期
    else:
        officeFile = OfficeFile(officeMember_id=obj['officeMemberId'], dataTitle=obj['dataTitle'],
                                dataIntroduction=obj['dataIntroduction'],
                                informationLink=obj['informationLink'], informationHash=obj['informationHash'])
        officeFile.save()
        if uploadOfficeFile(officeFile.id, user.userLoginName, obj['informationHash']):
            return HttpResponse("success")
        else:
            return HttpResponse("failed")
        # user.hadApply = True
        # user.save()


def returnFileListToStaff(request):
    obj = json.loads(request.body)
    user = get_user(obj)
    if not user:
        return HttpResponse('false')  # token过期
    else:
        pageSize = 10
        currentPage = obj['currentPage']
        startRow = (currentPage - 1) * pageSize
        endRow = currentPage * pageSize
        officeFiles = OfficeFile.objects.filter(officeMember_id=obj['memberId']).order_by('-id')[startRow:endRow]
        officeFileList = []
        for o in officeFiles:
            data = {'fileId': o.id, 'uploadTime': o.uploadTime.strftime("%Y.%m.%d"), 'workingStatus': o.workingStatus,
                    'userId': o.officeMember.user.userLoginName, "downloadNum": o.downloadsNum,
                    "informationLink": o.informationLink, "informationHash": o.informationHash, 'title': o.dataTitle,
                    "introduction": o.dataIntroduction, 'researchResult': o.researchResult,
                    "boss1Opinion": o.boss1Opinion, "boss1SignLink": o.boss1SignLink, "boss1SignHash": o.boss1SignHash,
                    "boss2Opinion": o.boss2Opinion, "boss2SignLink": o.boss2SignLink, "boss2SignHash": o.boss2SignHash,
                    'reviewResult': o.reviewResult}
            officeFileList.append(data)
        return JsonResponse({'officeFileList': officeFileList})


# 给申请人看当前申请状态
def returnApplyStatus(request):
    obj = json.loads(request.body)
    user = get_user(obj)
    if not user:
        return HttpResponse('false')  # token过期
    else:
        a = OfficeFile.objects.get(id=obj['fileId'])
        data = {'uploadTime': a.uploadTime.strftime("%Y.%m.%d"),
                "informationLink": a.informationLink, "informationHash": a.informationHash,
                "boss1Opinion": a.boss1Opinion, "boss1SignLink": a.boss1SignLink, "boss1SignHash": a.boss1SignHash,
                "boss2Opinion": a.boss2Opinion, "boss2SignLink": a.boss2SignLink, "boss2SignHash": a.boss2SignHash,
                "checkHash": a.checkHash, "researchResult": a.researchResult, 'reviewResult': a.reviewResult
                }
        return JsonResponse(data)


def postApplicationListToAdminToSign(request):  # 领导签字列表推送
    obj = json.loads(request.body)
    user = get_user(obj)
    if not user:
        return HttpResponse('false')  # token过期
    else:
        whichBoss = obj['identity']
        departmentId = obj['departmentId']
        pageSize = 10
        currentPage = obj['currentPage']
        startRow = (currentPage - 1) * pageSize
        endRow = currentPage * pageSize
        if whichBoss == 1:
            officeFiles = OfficeFile.objects.filter(workingStatus=False, boss1Opinion=None,
                                                    officeMember__department__id=departmentId).order_by('-id')[
                          startRow:endRow]
        else:
            officeFiles = OfficeFile.objects.filter(workingStatus=False, boss2Opinion=None,
                                                    officeMember__department__id=departmentId).exclude(
                boss1Opinion=None).order_by('-id')[startRow:endRow]
        officeFileList = []
        for o in officeFiles:
            data = {"fileId": o.id, 'uploadTime': o.uploadTime.strftime("%Y.%m.%d"),
                    "informationLink": o.informationLink, "informationHash": o.informationHash, 'title': o.dataTitle,
                    "introduction": o.dataIntroduction, 'userId': o.officeMember.user.userLoginName}
            officeFileList.append(data)
        return JsonResponse({"officeFileList": officeFileList})


def bossSign(request):
    obj = json.loads(request.body)
    user = get_user(obj)
    if not user:
        return HttpResponse('false')  # token过期
    else:
        whichBoss = obj['whichBoss']
        applicationForm = OfficeFile.objects.get(id=obj['id'])
        if whichBoss == 1:
            applicationForm.boss1Opinion = obj['boss1Opinion']
            applicationForm.boss1SignLink = obj['boss1SignLink']
            applicationForm.boss1SignHash = obj['boss1SignHash']
            if obj['boss1Opinion'] is False:
                applicationForm.researchResult = False
                applicationForm.workingStatus = False
        else:
            applicationForm.boss2Opinion = obj['boss2Opinion']
            applicationForm.boss2SignLink = obj['boss2SignLink']
            applicationForm.boss2SignHash = obj['boss2SignHash']
            if obj['boss2Opinion'] is False:
                applicationForm.researchResult = False
                applicationForm.workingStatus = False
        if applicationForm.boss1Opinion is not None and applicationForm.boss2Opinion is not None:
            s = hashlib.sha256()  # Get the hash algorithm.
            s.update((applicationForm.boss1SignHash + applicationForm.boss2SignHash).encode("utf8"))  # Hash the data.
            applicationForm.checkHash = s.hexdigest()  # Get he hash value.
            bossSignOnChain(obj['id'], s.hexdigest())
        applicationForm.save()
        return HttpResponse("success")


def postPublicityList(request):  # 公示列表推送或人事处审核列表推送 由obj['workingStatus'] 决定是哪个
    obj = json.loads(request.body)
    user = get_user(obj)
    if not user:
        return HttpResponse('false')  # token过期
    else:
        pageSize = 10
        currentPage = obj['currentPage']
        startRow = (currentPage - 1) * pageSize
        endRow = currentPage * pageSize
        if obj['workingStatus']:
            officeFiles = OfficeFile.objects.filter(workingStatus=True, researchResult=True).order_by('-id')[
                          startRow:endRow]
        else:
            departmentId = obj['departmentId']
            officeFiles = OfficeFile.objects.filter(workingStatus=False, reviewResult=None,
                                                    officeMember__department__id=departmentId).exclude(
                boss1Opinion=None).exclude(boss2Opinion=None).order_by('-id')[startRow:endRow]
        officeFileList = []
        for a in officeFiles:
            data = {"fileId": a.id, 'title': a.dataTitle, "introduction": a.dataIntroduction,
                    'uploadTime': a.uploadTime.strftime("%Y.%m.%d"), 'userId': a.officeMember.user.userLoginName,
                    "informationLink": a.informationLink, "informationHash": a.informationHash,
                    "boss1Opinion": a.boss1Opinion, "boss1SignLink": a.boss1SignLink, "boss1SignHash": a.boss1SignHash,
                    "boss2Opinion": a.boss2Opinion, "boss2SignLink": a.boss2SignLink, "boss2SignHash": a.boss2SignHash,
                    "checkHash": a.checkHash, "researchResult": a.researchResult, 'reviewResult': a.reviewResult}
            officeFileList.append(data)
        return JsonResponse({"officeFileList": officeFileList})


def bossCheck(request):
    obj = json.loads(request.body)
    user = get_user(obj)
    if not user:
        return HttpResponse('false')  # token过期
    else:
        applicationForm = OfficeFile.objects.get(id=obj['id'])
        applicationForm.reviewResult = obj['reviewResult']
        applicationForm.workingStatus = True
        if applicationForm.boss1Opinion and applicationForm.boss2Opinion:
            applicationForm.researchResult = True
            checkResultOnChain(user.userWxName, obj['id'], '通过')
            turnToShowFileToPeople(obj['id'], user.userLoginName, applicationForm.informationHash)
        else:
            applicationForm.researchResult = False
            checkResultOnChain(user.userWxName, obj['id'], '不通过')
        applicationForm.save()
        return HttpResponse("success")


# 返回用户身份信息和披露数据信息
def returnDisclosureInfo(request):
    obj = json.loads(request.body)
    user = get_user(obj)
    if not user:
        return HttpResponse('false')  # token过期
    else:
        list0 = [
            {'title': "经济", 'checked': False, 'value': 'c0'},
            {'title': "人口", 'checked': False, 'value': 'c1'},
            {'title': "农业", 'checked': False, 'value': 'c2'},
            {'title': "工业", 'checked': False, 'value': 'c3'},
            {'title': "服务业", 'checked': False, 'value': 'c4'},
            {'title': "民生", 'checked': False, 'value': 'c5'},
            {'title': "自然资源", 'checked': False, 'value': 'c6'},
        ]
        list1 = []
        userTypeChoices = User.userTypeChoices
        for index in range(len(userTypeChoices)):
            list1.append({"title": userTypeChoices[index][1], 'checked': False, 'value': index})
        return JsonResponse({'list0': list0, 'list1': list1})


# 设置披露的对象
def setDisclosureObject(request):
    obj = json.loads(request.body)
    user = get_user(obj)
    if not user:
        return HttpResponse('false')  # token过期
    else:
        showPeopleArray = obj['targetList']
        showObjectArray = obj['infoList']
        objText = ''
        infoText = []
        for p in showPeopleArray:
            targetId = int(p) + 1
            if targetId == 1:
                objText = '个人'
            if targetId == 2:
                objText = '企业'
            if targetId == 3:
                objText = '行政机关'
            dataDisclosure = DataDisclosure.objects.get(id=targetId)
            dataDisclosure.economic = False
            dataDisclosure.population = False
            dataDisclosure.agriculture = False
            dataDisclosure.industry = False
            dataDisclosure.serviceIndustry = False
            dataDisclosure.peopleLivelihood = False
            dataDisclosure.naturalResources = False

            if 'c0' in showObjectArray:
                dataDisclosure.economic = True
                infoText.append('经济')
            if 'c1' in showObjectArray:
                dataDisclosure.population = True
                infoText.append('人口')
            if 'c2' in showObjectArray:
                dataDisclosure.agriculture = True
                infoText.append('农业')
            if 'c3' in showObjectArray:
                dataDisclosure.industry = True
                infoText.append('工业')
            if 'c4' in showObjectArray:
                dataDisclosure.serviceIndustry = True
                infoText.append('服务业')
            if 'c5' in showObjectArray:
                dataDisclosure.peopleLivelihood = True
                infoText.append('民生')
            if 'c6' in showObjectArray:
                dataDisclosure.naturalResources = True
                infoText.append('自然资源')
            dataDisclosure.save()
            setLogForDatePublic(user.userLoginName, objText, '、'.join(infoText))
            objText = ''
            infoText = []
        return HttpResponse("success")


def returnDataDisclosure(request):
    obj = json.loads(request.body)
    user = get_user(obj)
    if not user:
        return HttpResponse('false')  # token过期
    else:
        dataLinkArray = [
            {'name': "经济", 'link': "https://onestopimages.luckydraw.net.cn/%E7%BB%8F%E6%B5%8E.png", 'hadCheck': False},
            {'name': "人口", 'link': "https://onestopimages.luckydraw.net.cn/%E4%BA%BA%E5%8F%A3.png", 'hadCheck': False},
            {'name': "农业", 'link': "https://onestopimages.luckydraw.net.cn/%E5%86%9C%E4%B8%9A.png", 'hadCheck': False},
            {'name': "工业", 'link': "https://onestopimages.luckydraw.net.cn/%E5%B7%A5%E4%B8%9A.png", 'hadCheck': False},
            {'name': "服务业", 'link': "https://onestopimages.luckydraw.net.cn/%E6%9C%8D%E5%8A%A1%E4%B8%9A.png",
             'hadCheck': False},
            {'name': "民生", 'link': "https://onestopimages.luckydraw.net.cn/%E6%B0%91%E7%94%9F.png", 'hadCheck': False},
            {'name': "自然资源", 'link': "https://onestopimages.luckydraw.net.cn/%E8%87%AA%E7%84%B6%E8%B5%84%E6%BA%90.png",
             'hadCheck': False},
        ]
        userType = user.userType + 1
        dataDisclosure = DataDisclosure.objects.get(id=userType)

        if dataDisclosure.economic is False:
            dataLinkArray[0]['link'] = None
        if dataDisclosure.population is False:
            dataLinkArray[1]['link'] = None
        if dataDisclosure.agriculture is False:
            dataLinkArray[2]['link'] = None
        if dataDisclosure.industry is False:
            dataLinkArray[3]['link'] = None
        if dataDisclosure.serviceIndustry is False:
            dataLinkArray[4]['link'] = None
        if dataDisclosure.peopleLivelihood is False:
            dataLinkArray[5]['link'] = None
        if dataDisclosure.naturalResources is False:
            dataLinkArray[6]['link'] = None
        return JsonResponse({"dataLinkArray": dataLinkArray})


def setHighDiskArea(request):
    obj = json.loads(request.body)
    highDiskArea = obj['highDiskArea']
    print(highDiskArea)
    return HttpResponse("success")


def setLowDiskArea(request):
    obj = json.loads(request.body)
    lowDiskArea = obj['lowDiskArea']
    print(lowDiskArea)
    return HttpResponse("success")


def setUserPassingArea(request):
    obj = json.loads(request.body)
    userID = obj['userID']
    passingArea = obj['passingArea']
    print(userID)
    print(passingArea)
    return HttpResponse("success")


def getUserPassingArea(request):
    obj = json.loads(request.body)
    userID = obj['userID']
    print(userID)
    passingAreaList = [{"name": '南昌', "isRisky": False}, {"name": '南昌', "isRisky": False}]
    return JsonResponse({"passingAreaList": passingAreaList})


"""def getInformationDisclosure(request):
    obj = json.loads(request.body)
    user = get_user(obj)
    if not user:
        return HttpResponse('false')  # token过期
    else:
        informationDisclosure = InformationDisclosure(user_id=user.id)
        infoList = obj['infoList']
        targetList = obj['targetList']
        infoToPost = []
        targetToPost = []
        if 'c1' in infoList:
            informationDisclosure.info1 = True
            infoToPost.append('头像')
        if 'c2' in infoList:
            informationDisclosure.info2 = True
            infoToPost.append('ID')
        if 'c3' in infoList:
            informationDisclosure.info3 = True
            infoToPost.append('身份')
        if 'c4' in infoList:
            informationDisclosure.info4 = True
            infoToPost.append('地址')
        if 'c5' in infoList:
            informationDisclosure.info5 = True
            infoToPost.append('公钥')
        if 'c6' in infoList:
            informationDisclosure.info6 = True
            infoToPost.append('私钥')

        if 'c1' in targetList:
            informationDisclosure.target1 = True
            targetToPost.append('学生')
        if 'c2' in targetList:
            informationDisclosure.target2 = True
            targetToPost.append('教师')
        if 'c3' in targetList:
            informationDisclosure.target3 = True
            targetToPost.append('行政人员')
        informationDisclosure.save()
        setMyInfoPublic(user.userLoginName, "、".join(infoToPost), "、".join(targetToPost))
        return HttpResponse("success")"""

"""def returnInformationDisclosure(request):
    obj = json.loads(request.body)
    user = get_user(obj)
    if not user:
        return HttpResponse('false')  # token过期
    else:
        userType = obj['userType']
        informationDisclosureList = []
        informationDisclosures = None
        pageSize = 10
        currentPage = obj['currentPage']
        startRow = (currentPage - 1) * pageSize
        endRow = currentPage * pageSize
        if userType == 0:
            informationDisclosures = InformationDisclosure.objects.filter(target1=True).order_by('-id')[
                                     startRow:endRow]
        elif userType == 1:
            informationDisclosures = InformationDisclosure.objects.filter(target2=True).order_by('-id')[
                                     startRow:endRow]
        else:
            informationDisclosures = InformationDisclosure.objects.filter(target3=True).order_by('-id')[
                                     startRow:endRow]
        for i in informationDisclosures:
            # '/images/avatar.png'
            data = {'userAvatar': i.user.avatarUrl, 'userIdNumber': i.user.userLoginName, 'userType': None,
                    'publicKey': None, 'privateKey': None, 'userWxName': i.user.userWxName, 'id': i.id, 'address': None}
            if i.info1:
                data['userAvatar'] = i.user.avatarUrl
            if i.info2:
                data['userIdNumber'] = i.user.userLoginName
            if i.info3:
                data['userType'] = i.user.userType
            if i.info4:
                data['address'] = i.user.accountAddress
            if i.info5:
                data['publicKey'] = i.user.accountPk
            if i.info6:
                data['privateKey'] = i.user.accountSk
            informationDisclosureList.append(data)
        userTypeList = []
        choices = User.userTypeChoices
        for c in choices:
            userTypeList.append(c[1])
        return JsonResponse({'informationDisclosureList': informationDisclosureList, 'userTypeList': userTypeList})"""

"""def getOwnList(request):
    obj = json.loads(request.body)
    user = get_user(obj)
    if not user:
        return HttpResponse('false')  # token过期
    else:
        suggestList = []
        suggests = Suggest.objects.filter(user_id=user.id).order_by('-id')[0:10]
        for s in suggests:
            obj = {"id": s.id, "userId": s.user.userLoginName, 'title': s.changeSuggestTitle,
                   "content": s.changeSuggestContent,
                   "isCompliance": s.isCompliance, "suggestTime": s.suggestTime.strftime("%Y.%m.%d")}
            suggestList.append(obj)

        resourceUpList = []
        ups = Data.objects.filter(user_id=user.id).order_by('-id')[0:10]
        for u in ups:
            obj = {"id": u.id, "userId": u.user.userLoginName, 'title': u.dataTitle, "introduction": u.dataIntroduction,
                   "dataLink": u.dataLink, "downloadNum": u.downloadsNum, "dataValue": u.dataValue,
                   "uploadTime": u.uploadTime.strftime("%Y.%m.%d"), 'dataHash': u.dataHash}
            resourceUpList.append(obj)

        resourceDownList = []
        downs = Data.objects.filter(downloadrecord__user_id=user.id).order_by('-id')[0:10]
        for d in downs:
            obj = {"id": d.id, "userId": d.user.userLoginName, 'title': d.dataTitle, "introduction": d.dataIntroduction,
                   "dataLink": d.dataLink, "downloadNum": d.downloadsNum, "dataValue": d.dataValue,
                   "uploadTime": d.uploadTime.strftime("%Y.%m.%d"), 'dataHash': d.dataHash}
            resourceDownList.append(obj)
        data = {
            'suggestList': suggestList,
            'resourceUpList': resourceUpList,
            'resourceDownList': resourceDownList,
        }
        return JsonResponse(data, safe=False)"""


def getOwnSuggestList(request):
    obj = json.loads(request.body)
    user = get_user(obj)
    if not user:
        return HttpResponse('false')  # token过期
    else:
        pageSize = 10
        currentPage = obj['currentPage']
        startRow = (currentPage - 1) * pageSize
        endRow = currentPage * pageSize
        suggestList = []
        suggests = Suggest.objects.filter(user_id=user.id).order_by('-id')[startRow:endRow]
        for s in suggests:
            obj = {"id": s.id, "userId": s.user.userLoginName, 'title': s.changeSuggestTitle,
                   "content": s.changeSuggestContent,
                   "isCompliance": s.isCompliance, "suggestTime": s.suggestTime.strftime("%Y.%m.%d")}
            suggestList.append(obj)
        return JsonResponse({"suggestList": suggestList}, safe=False)


"""def getResourceUpList(request):
    obj = json.loads(request.body)
    user = get_user(obj)
    if not user:
        return HttpResponse('false')  # token过期
    else:
        pageSize = 10
        currentPage = obj['currentPage']
        startRow = (currentPage - 1) * pageSize
        endRow = currentPage * pageSize
        resourceUpList = []
        ups = Data.objects.filter(user_id=user.id).order_by('-id')[startRow:endRow]
        for u in ups:
            obj = {"id": u.id, "userId": u.user.userLoginName, 'title': u.dataTitle, "introduction": u.dataIntroduction,
                   "dataLink": u.dataLink, "downloadNum": u.downloadsNum, "dataValue": u.dataValue,
                   "uploadTime": u.uploadTime.strftime("%Y.%m.%d"), 'dataHash': u.dataHash}
            resourceUpList.append(obj)

        return JsonResponse({"resourceUpList": resourceUpList}, safe=False)"""


def getResourceDownList(request):
    obj = json.loads(request.body)
    user = get_user(obj)
    if not user:
        return HttpResponse('false')  # token过期
    else:
        pageSize = 10
        currentPage = obj['currentPage']
        startRow = (currentPage - 1) * pageSize
        endRow = currentPage * pageSize
        resourceDownList = []
        downs = OfficeFile.objects.filter(downloadrecord__user_id=user.id).order_by('-id')[startRow:endRow]
        for a in downs:
            obj = {"fileId": a.id, 'title': a.dataTitle, "introduction": a.dataIntroduction,
                   'downloadNum': a.downloadsNum,
                   'uploadTime': a.uploadTime.strftime("%Y.%m.%d"), 'userId': a.officeMember.user.userLoginName,
                   "informationLink": a.informationLink, "informationHash": a.informationHash,
                   "boss1Opinion": a.boss1Opinion, "boss1SignLink": a.boss1SignLink, "boss1SignHash": a.boss1SignHash,
                   "boss2Opinion": a.boss2Opinion, "boss2SignLink": a.boss2SignLink, "boss2SignHash": a.boss2SignHash,
                   "checkHash": a.checkHash, "researchResult": a.researchResult, 'reviewResult': a.reviewResult}
            resourceDownList.append(obj)
        return JsonResponse({"resourceDownList": resourceDownList}, safe=False)


"""def getDownloaderList(request):
    obj = json.loads(request.body)
    user = get_user(obj)
    if not user:
        return HttpResponse('false')  # token过期
    else:
        pageSize = 10
        currentPage = obj['currentPage']
        startRow = (currentPage - 1) * pageSize
        endRow = currentPage * pageSize
        downloaderList = []
        downloaders = DownloadRecord.objects.filter(data_id=obj['dataId']) .order_by('-id')[startRow:endRow]
        for d in downloaders:
            downloaderList.append(d.user.userLoginName)
        return JsonResponse({"downloaderList": downloaderList}, safe=False)"""
