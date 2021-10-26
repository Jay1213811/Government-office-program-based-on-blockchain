from django.db import models


# Create your models here.
class User(models.Model):
    openId = models.CharField(db_index=True, max_length=100, default='0', null=True)  # 唯一表示微信用户的id
    userWxName = models.CharField(verbose_name='用户微信名', max_length=40, null=True)  # 用户微信名
    userLoginName = models.CharField(verbose_name='用户登录名', max_length=10, null=True)
    userPassword = models.CharField(verbose_name='用户登录名拼接用户密码后计算的hash值', max_length=64, null=True)
    avatarUrl = models.URLField(max_length=255, null=True)  # 用户头像
    activateTime = models.DateTimeField(verbose_name='注册时间', null=True)
    registeredStatus = models.BooleanField(verbose_name='注册状态', default=False)
    userCreditPoint = models.IntegerField(verbose_name='信用积分', default=100)
    accountAddress = models.CharField(verbose_name='用户账号地址', max_length=255, null=True, default='', blank=True)
    accountPk = models.CharField(verbose_name='用户公钥', max_length=255, null=True, default='', blank=True)
    accountSk = models.CharField(verbose_name='用户私钥', max_length=255, null=True, default='', blank=True)
    accountBalance = models.CharField(verbose_name='用户余额', max_length=50, null=True, default='', blank=True)
    userTypeChoices = [(0, '个人'), (1, '企业'), (2, '行政机关')]
    userType = models.PositiveSmallIntegerField(verbose_name='用户类型', choices=userTypeChoices, null=True, blank=True)
    downloadRecord = models.ManyToManyField("OfficeFile", blank=True, through='DownloadRecord',
                                            through_fields=('user', 'officeFile'), related_name='userDownloadRecord')

    # hadApply = models.BooleanField("已提交保研申请", default=False)

    class Meta:
        verbose_name_plural = "用户"

    def __str__(self):
        return str(self.userWxName) + "_" + str(self.userLoginName) + '_' + str(self.id)


class Suggest(models.Model):
    user = models.ForeignKey(User, verbose_name='用户主键', on_delete=models.CASCADE)
    # titleChioces = [(, '后勤问题'), (, '交通问题'), (, '运动'), (, ''), ]
    suggestTitle = models.CharField(verbose_name='留言标题', max_length=50)
    suggestContent = models.TextField(verbose_name='留言内容')
    changeSuggestTitle = models.TextField(verbose_name='替换违禁词后的留言标题', null=True)
    changeSuggestContent = models.TextField(verbose_name='替换违禁词后的留言内容', null=True)
    suggestTime = models.DateTimeField(auto_now_add=True)
    isCompliance = models.BooleanField(verbose_name='合规', default=True)

    class Meta:
        verbose_name_plural = "建议"

    def __str__(self):
        return self.suggestTitle


"""class Data(models.Model):
    user = models.ForeignKey(User, verbose_name='用户主键', on_delete=models.CASCADE)
    dataTitle = models.CharField('资源标题', max_length=30)
    dataIntroduction = models.CharField('资源简介', max_length=255)
    dataLink = models.CharField('资源链接', max_length=255)
    dataHash = models.CharField('数据哈希值', max_length=64)
    uploadTime = models.DateTimeField(verbose_name='上传时间', auto_now_add=True)
    downloadsNum = models.IntegerField('下载次数', default=0)
    dataValue = models.PositiveSmallIntegerField('数据价格', default=0)

    class Meta:
        verbose_name_plural = "数据上传" 

    def __str__(self):
        return self.dataTitle"""


class Office(models.Model):
    departmentName = models.CharField('部门名称', max_length=100, null=True)

    class Meta:
        verbose_name_plural = "部门"

    def __str__(self):
        return self.departmentName


class OfficeMember(models.Model):
    department = models.ForeignKey(Office, on_delete=models.CASCADE, blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    account = models.CharField(verbose_name='成员登录名', max_length=10, null=True, unique=True)
    password = models.CharField(verbose_name='成员密码', max_length=30, null=True)
    identityChoices = [(0, '科员'), (1, '科长'), (2, '处长'), (3, '校验员')]
    identity = models.PositiveSmallIntegerField(verbose_name='成员身份', choices=identityChoices, null=True, blank=True)

    class Meta:
        verbose_name_plural = "部门成员"

    def __str__(self):
        return str(self.department) + '_' + str(self.user.userLoginName) + '_' + str(
            self.identityChoices[self.identity][1])


class OfficeFile(models.Model):
    officeMember = models.ForeignKey(OfficeMember, on_delete=models.CASCADE, blank=True, null=True)
    dataTitle = models.CharField('资源标题', max_length=50)
    dataIntroduction = models.CharField('资源简介', max_length=255)
    informationLink = models.CharField('材料链接', max_length=255)
    informationHash = models.CharField('材料哈希值', max_length=64)
    uploadTime = models.DateTimeField(verbose_name='上传时间', auto_now_add=True)
    downloadsNum = models.IntegerField('下载次数', default=0)

    boss1SignLink = models.CharField('签字图片1下载链接', max_length=255, null=True)
    boss1SignHash = models.CharField('签字图片1哈希值', max_length=64, null=True)
    boss1Opinion = models.BooleanField('领导1意见', null=True)
    boss2SignLink = models.CharField('签字图片2下载链接', max_length=255, null=True)
    boss2SignHash = models.CharField('签字图片2哈希值', max_length=64, null=True)
    boss2Opinion = models.BooleanField('领导2意见', null=True)
    checkHash = models.CharField(verbose_name='审核结果哈希值', null=True, max_length=64)
    reviewResult = models.BooleanField(verbose_name='秘书长审核结果', null=True)
    researchResult = models.BooleanField(verbose_name='最终结果', null=True)  # 最终意见opinion
    workingStatus = models.BooleanField(verbose_name='工作已经完成', default=False, null=True)

    class Meta:
        verbose_name_plural = "办公流程"

    def __str__(self):
        return self.dataTitle


class DownloadRecord(models.Model):
    user = models.ForeignKey('User', on_delete=models.CASCADE, blank=True)
    officeFile = models.ForeignKey('OfficeFile', on_delete=models.CASCADE, blank=True)

    class Meta:
        verbose_name_plural = "下载记录"

    def __str__(self):
        return str(self.user.userLoginName) + "_下载_" + str(self.officeFile.dataTitle)


class DataDisclosure(models.Model):
    economic = models.BooleanField('经济', default=False)
    population = models.BooleanField('人口', default=False)
    agriculture = models.BooleanField('农业', default=False)
    industry = models.BooleanField('工业', default=False)
    serviceIndustry = models.BooleanField('服务业', default=False)
    peopleLivelihood = models.BooleanField('民生', default=False)
    naturalResources = models.BooleanField('自然资源', default=False)

    class Meta:
        verbose_name_plural = "政府数据披露"

    def __str__(self):
        return User.userTypeChoices[self.id - 1][1]

"""class InformationDisclosure(models.Model):
    user = models.ForeignKey(User, verbose_name='用户主键', on_delete=models.CASCADE)
    info1 = models.BooleanField("披露头像", default=False)
    info2 = models.BooleanField("披露ID", default=False)
    info3 = models.BooleanField("披露身份", default=False)
    info4 = models.BooleanField("披露地址", default=False)
    info5 = models.BooleanField("披露公钥", default=False)
    info6 = models.BooleanField("披露私钥", default=False)
    target1 = models.BooleanField("披露对象学生", default=False)
    target2 = models.BooleanField("披露对象教师", default=False)
    target3 = models.BooleanField("披露对象行政人员", default=False)

    class Meta:
        verbose_name_plural = "信息披露"

    def __str__(self):
        return str(self.user.userLoginName) + '_信息披露'  """
        


