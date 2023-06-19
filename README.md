# 政务通——区块链助力政府办公

## 1.项目简介

​	区块链具有不可篡改性以及可追溯性，因此对于一些重要信息区块链更能够保障信息的安全。基于区块链的这两大特点，本篇将介绍如何将区块链应用于政府办公，实现**协同办公**，**数据脱敏上链**，以及**数据溯源**打破数据孤岛等功能。以小程序为载体，体现区块链在实际生活中的具体作用。总体设计分为四个模块。具体如表1.1所示，

​																				**表1.1 功能模块分析**

| 功能模块            |                           技术特点                           |
| :------------------ | :----------------------------------------------------------: |
| 1. **用户管理模块** | 注册时候对用户信息进行**资产数字化处理**，用户密码等关键信息脱敏上链。存储的是通过sha256运算后的哈希值，保障了用户的安全。用户登录时，输入密码进行一次哈希运算，与链上比对，即完成“**确权**”，验证一致才可登陆。 |
| 2. **建言献策模块** | 用户留言内容记录上链，同时对留言内容**调用外部api**，如果留言内容涉及敏感词，则扣除用户信用积分。**打造一个好的社会信用生态** |
| **3巡检模块**       |               用户打卡记录上链，涉及“数据溯源”               |
| **4.政务合作模块**  |               体现联盟链的**“多方协作”**特点.                |

## 2 项目优势

区块链技术的去中心化、不可篡改、可信任、可溯源等特点，使得区块链技术不仅在数据安全领域有所作为，在政务服务系统中也可大展身手。通过对大量数据信息 的分析和快速处理，区块链应用开发技术可以迅速将有效信息传递至各部门，为扁平 化管理创造了条件。因此本项目有如下特点与优势。

1、区块链技术可在政府部门间构建起分布式对等网络，让政府组织结构的信息传 递更加直接高效，部门间可运用区块链技术直接进行点对点信息传递。

2、区块链分布式的模式特点可以实现多部门间的数据同享，可使得政务管理层级 减少，部门与部门间、上级与下级间的沟通会更顺畅，对于人员的需求也会相应减少。 政府部门可利用区块链技术打造高效的行政系统，推动政府治理和公共服务模式创新。

3、每个在区块链上获取数据的主体是平等关系，需要共同承担管理责任。数据的 变动和更改会同步在整个网络节点上更新，这种变动需要每个参与者确认，即使部分 数据库系统出现失灵或错误，其他节点数据依然完整，数据库系统依旧可以正常有效 运转。

4、公共服务部门利用区块链技术可以降低成本、保证数据安全、增加信任、透明 度和可靠性。区块链的特性使得数据可以追根溯源，数据安全性提升且不能随意变动， 有助于建立权威数据库，进而建立更安全、开放、包容高效的公共服务平台。

## 3.系统实现

​		区块链部分基于`FISCO BCOS` 开发。`FISCO BCOS` 是由国内企业主导研发、对外开源、安全可控的企业级金融联盟链底层平台。另外通过微信小程序作为媒介，客户端由小程序和后台管理网站通过`https`  请求，经过 `nginx` 进行负载均衡。后台采用 django,将用户的 `access_token `等存储在` redis` 缓存服务器中，进行定时刷新。 前端采用小程序的原生框架,采用  `WXML + WXSS  + JS` 进行原生开发与布局。

### 3.1用户管理模块

​	该模块包含用户注册登陆以及管理员对用户信用积分的管理。登录功能是可确权登录的操作手段，以此实现用户的操作安全性，确保用户的账 号数据安全为用户本人操作。用户在正确登录小程序后，后台会获取登录用户的身份， 根据身份给予该用户不同的权限进行操作。

#### 3.1.1 合约代码

**1.功能说明：**本合约实现功能主要为:1.用户注册2.用户登录3.查看用户信息

- `activateUser(string memory _userid,string memory _username,string memory _userpassword, string memory _usertype)`:用户实现注册,传入用户的ID号、名字、密码，用户身份类别。
- `Login(string memory _userid,string memory _userpassword)`用户的ID、用户的密码
- `getUserRecordArray(string userid)`用户的ID

```solidity
pragma solidity ^0.4.25;
pragma experimental ABIEncoderV2;
import "../lib/SafeMath.sol";
import "../utils/TimeUtil.sol";
import "../utils/StringUtil.sol";
import "../utils/TypeConvertUtil.sol";
import "./TableDefTools.sol";
contract UserControl is TableDefTools{
    /*******   引入库  *******/
     using TimeUtil for *;
     using SafeMath for *;
     using TypeConvertUtil for *;
     using StringUtil for *;
   /*
    * 构造函数，初始化使用到的表结构
    *
    * @param    无
    *
    * @return   无
    */
    constructor() public{
        //初始化需要用到的表。用户信息表
        initTableStruct(t_user_struct, TABLE_USER_NAME, TABLE_USER_PRIMARYKEY, TABLE_USER_FIELDS);
    }
    // 事件
    event REGISTER_USER_EVENT(string userid,string usertype,string activatetime); //注册用户事件.记录注册人身份，类型，注册时间
    event DEL_CREDITPOINT_EVENT(string user_id,string grade,string time); //扣分时间，扣分人id、扣分数、扣分时间
    event ADD_CREDITPOINT_EVENT(string user_id,string grade,string time);
   /*
    * 1.用户注册
    *
    * @param _userid  用户id
    * @param _fields 用户信息表各字段值拼接成的字符串（除最后三个字段；用逗号分隔。最后三个字段分别是注册时间【根据注册时间生成】,注册状态
    注册后这个值默认为1，信用积分默认为100分），包括如下：
    *                   用户ID(主键)
    *                   用户名   
    *                   登陆密码
    *                   注册时间
    *                   注册状态[1代表已注册，0代表为注册]
    *                   信用积分                 
    *
    * @return 执行状态码
    *
    * 测试举例  参数一："191867345212322"  
    * 参数二："江会文","123456","个人"
    *注册成功返回SUCCESS否则返回错误码，错误码对应的问题请参考DB
    */
    function activateUser(string memory _userid,string memory _username,string memory _userpassword, string memory _usertype) public  returns(int8){
                 // 获得当前的时间
        string memory _passwordhash=TypeConvertUtil.bytes32ToString(sha256(abi.encode(_userid,_userpassword)));
        string memory nowDate = TimeUtil.getNowDate();
        string memory firstFiveParams=StringUtil.strConcat7(_username,',',_passwordhash,',',nowDate,',',_usertype);
        string memory lastTwoParams = "1,100";
        string memory storeFields = StringUtil.strConcat3(firstFiveParams,',',lastTwoParams);
        emit REGISTER_USER_EVENT(StringUtil.strConcat2("注册人的ID为:",_userid),StringUtil.strConcat2("注册人身份为:",_usertype),StringUtil.strConcat2("注册时间为:",nowDate)); 
        return insertOneRecord(t_user_struct,_userid,storeFields,false);//最后的false代表主键下记录不可重复
    }
    /*
    * 2.用户登陆
    *
    * @param userid  用户id
    * @param  userpassword  用户密码
    * @return 用户所有信息并以JSON格式返回
    *
    * 测试举例  参数一："191867345212322,123456"
    */
    function Login(string memory _userid,string memory _userpassword) public view returns (int8,string) {
         string memory _passwordhash=TypeConvertUtil.bytes32ToString(sha256(abi.encode(_userid,_userpassword)));
         return loginInToJson(t_user_struct,_userid,_passwordhash);
    }
    /*
    * 3.查询用户信息并以字符串数组方式输出
    *
    * @param _userid  用户id
    *
    * @return 执行状态码
    * @return 该用户信息的字符串数组
    *
    * 测试举例  参数一："191867345212322"
    */
    function getUserRecordArray(string userid) public view returns(int8, string[]){
        return selectOneRecordToArray(t_user_struct, userid, ["user_id",userid]);
    }
}
```

**2使用实例:**

- 用户注册:

通过调用activateUser传入用户的ID、姓名、密码、身份类别完成注册。

![用户注册](https://tva1.sinaimg.cn/large/008i3skNgy1gxp78txigqj30lk0i6t9w.jpg)

- 查询用户信息:

  ​	因为区块链上的信息是公开透明的。因此不应当把密码等隐私数据直接上链。而应当对隐私数据进行**“脱敏上链”**，在这里我们对用户的密码进行了hash处理。由于哈希函数具有单向性，因此即使该哈希值被他人读取了也很难破解用户的密码。

  ![查询用户信息](https://tva1.sinaimg.cn/large/008i3skNgy1gxp7bumgikj30hx06ct8u.jpg)

- 用户注册日志记录:

  ![](https://tva1.sinaimg.cn/large/008i3skNgy1gxp7f0ezbfj31rq0gwn07.jpg)

#### 3.1.2 前端代码

​	前端界面主要分为用户注册页面和用户登录页面.这里主要讲一下注册页面.通过一个`form`表单让用户输入关键的信息。注册时候，能自动获取的信息就不让用户手动再输入一遍，增加用户的使用体验。自动获取用户的微信昵称作为用户的账户名，用户需要手工输入6-20位的密码，再通过复选框`cu-form-group`选择三类身份中的一种。最后点击提交即可完成注册。

```js
    <view class="zan-dialog {{ showDialog ? 'zan-dialog--show' : '' }}">
      <view class="zan-dialog__mask" bindtap="toggleDialog" />
      <view class="zan-dialog__container">
        <view class="padding flex flex-direction">
          //用户注册,输入需要的信息
          <view class="text-center text-xl text-bold text-cyan margin-top">{{registeredStatus?'登陆后获得发布和下载权限':'注册后获得发布和下载权限'}}</view>
          <view class="cu-form-group margin-top">
            <view class="title">用户账号</view>
            <input disabled="true" value="{{userNickName}}"></input>
          </view>
          <view class="cu-form-group">
            <view class="title">输入密码</view>
            <input placeholder="请输入6~20位的密码" password="true" maxlength="20" value="{{password}}" bindinput='getPassword'></input>
          </view>
          <view class="cu-form-group" wx:if="{{!(isLogin || registeredStatus)}}">
            <view class="title">确认密码</view>
            <input placeholder="请重新输入密码" password="true" maxlength="20" value="{{passwordToCheck}}" bindinput='getPasswordToCheck'></input>
          </view>
					//用户身份选择可以用下拉框.分为三类个人、企业、政府
          <view class="cu-form-group" wx:if="{{!(isLogin || registeredStatus)}}">
          <view class="title">选择用户身份</view>
            <picker bindchange="changeUserType" value="{{userType}}" range="{{userTypeList}}">
              <view class="picker">
                {{userTypeList[userType]}}
              </view>
            </picker>
          </view>
          <button class="cu-btn bg-cyan margin-top lg" bindtap="checkPasswordAndPost" wx:if="{{!registeredStatus}}">提交</button>
          <button class="cu-btn bg-cyan margin-top lg" bindtap="login" wx:if="{{!isLogin&&registeredStatus}}">登陆</button>
        </view>
      </view>
    </view>
```

前端界面效果图如下:

- 注册界面:

  <img src="https://tva1.sinaimg.cn/large/008i3skNgy1gxp7ggamljj30ku112ab8.jpg" alt="注册" style="zoom:60%;" />

- 登陆界面:

  <img src="https://tva1.sinaimg.cn/large/008i3skNgy1gxp7hhn9hej30ku1120u2.jpg" style="zoom:60%;" />

#### 3.1.3 后端代码

​	后端根据用户微信登录后产生唯一的openId自动作为用户的Id，作为用户注册的唯一主键。通过该主键获取用户的微信号、微信昵称、密码哈希、微信头像、注册状态、信用积分、用户身份类别、下载文件记录等信息。

```python
class User(models.Model):
    #自动生成openId作为用户的唯一ID
    openId = models.CharField(db_index=True, max_length=100, default='0', null=True)  # 唯一表示微信用户的id
    userWxName = models.CharField(verbose_name='用户微信名', max_length=40, null=True)  # 用户微信名
    userLoginName = models.CharField(verbose_name='用户登录名', max_length=10, null=True)
    userPassword = models.CharField(verbose_name='密码通过sha256计算后的hash值', max_length=64, null=True)
    avatarUrl = models.URLField(max_length=255, null=True)  # 用户头像
    activateTime = models.DateTimeField(verbose_name='注册时间', null=True)
    registeredStatus = models.BooleanField(verbose_name='注册状态', default=False)
    userCreditPoint = models.IntegerField(verbose_name='信用积分', default=100)#给定默认信用积分为100分
    userTypeChoices = [(0, '个人'), (1, '企业'), (2, '政府机构')] #通过用户在前端界面选择的序号确定身份类别
    userType = models.PositiveSmallIntegerField(verbose_name='用户类型', choices=userTypeChoices, null=True, blank=True)
    downloadRecord = models.ManyToManyField("OfficeFile", blank=True, through='DownloadRecord',
                                            through_fields=('user', 'officeFile'), related_name='userDownloadRecord')
    #获取用户信息
    def getUserInfo(self,request):
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
```

### 3.2 **建言献策模块**

​	每位用户可在建言献策界面的文本框内输入建言标题和建言内容，确保内容无误后点击“提交建议”，建言数据将上传到本地数据库和区块链上，后端调用 API 对用户所发布的内容进行违规词检测替换，若内容有不文明用词将扣除用户 1 点信用值，且将建言标题内容和信用扣除记录上传到区块链上(用户违规事件记录上链)。每位用户可在小程序首页浏览所有用户提交的建议，且每条 建议会显示建议提交者 ID、提交时间以及是否违规，同时也可在个人中心的信用值记 录查看自己提交的建言的详细记录

#### 3.2.1 合约代码

**1.功能说明：**本合约实现功能主要为:1.用户留言 2.查看用户留言记录

- `suggest(string memory _proposeid,string memory _userid,string memory _title,string memory _content)`:用户留言:传入留言内容Id、用户的ID号、留言标题、留言内容。
- `getSuggestRecordJson(string _proposeid)`:返回留言内容:传入留言内容ID号，以json形式返回留言内容

```Solidity
pragma solidity ^0.4.25;
pragma experimental ABIEncoderV2;
import "../lib/SafeMath.sol";
import "../utils/TimeUtil.sol";
import "./TableDefTools.sol";
/*
*
* UserSuggest实现用户留言功能。
* 首先查看用户是否注册，登陆。如果没有则不能留言
* 操作的表为t_suggest.
*
*/
contract Suggest is TableDefTools{
    /*******   引入库  *******/
     using TimeUtil for *;
     using SafeMath for *;
     event SUGGEST(string Proposeid,string  Userid,string _title,string SuggestContent,string time);//留言事件.留言人ID，留言标题，内容。时间
   /*
    * 构造函数，初始化使用到的表结构
    *
    * @param    无
    *
    * @return   无
    */
    constructor() public{
        //初始化需要用到的表。建言献策表
        initTableStruct(t_propose_struct, TABLE_PROPOSE_NAME, TABLE_PROPOSE_PRIMARYKEY, TABLE_PROPOSE_FIELDS);
    }
   /*
    * 1.用户留言
    *
    * @param _proposeid      留言ID号  
    * @param _userid    留言人ID
    * @param _title    留言内容标题
    * @param _content   留言内容    
    *
    * @return 执行状态码
    *
   * 测试举例  参数一："17846"  
    * 参数二："191867345212322","关于提供退役军人金融优惠措施的建议","尊敬的领导，本人通过网络知道了了去年事务部和十大银行签了优抚协议，其它省份落实的很好，希望江西省也能对接下江西银行，江西农商银行等"
    *注册成功返回SUCCESS,以及留言的句子。否则返回错误码，错误码对应的问题请参考TableDefTools写的
    */
   function suggest(string memory _proposeid,string memory _userid,string memory _title,string memory _content) public  returns(int8){
        //获取时间
        string memory nowDate = TimeUtil.getNowDate();
        string memory suggestfields=StringUtil.strConcat4("建议标题为:",_title,"建议内容为:",_content);
        string memory storeFields = StringUtil.strConcat5(_userid,',',suggestfields,',',nowDate);
        emit SUGGEST(StringUtil.strConcat2("留言的ID号为:",_proposeid),StringUtil.strConcat2("留言人的ID为:",_userid),
        StringUtil.strConcat2("留言标题为:",_title),StringUtil.strConcat2("留言内容为:",_content),StringUtil.strConcat2("留言时间为:",nowDate)); 
        return (insertOneRecord(t_propose_struct,_proposeid,storeFields,false));
    }
    /*
    * 2.根据留言ID号查询留言人ID号和留言内容并以Json字符串方式输出
    *
    * @param _proposeid  留言id
    *
    * @return 执行状态码 
    * @return 该用户所有留言信息的Json字符串
    *
    * 测试举例  参数一："17846"
    */
    function getSuggestRecordJson(string _proposeid) public view returns(int8, string){
        return selectOneRecordToJson(t_propose_struct, _proposeid);
    }
```



**2使用实例:**

- 用户留言:

  ![用户留言](https://tva1.sinaimg.cn/large/008i3skNgy1gxp8ahiotzj30ia0hcq49.jpg)

- 用户留言成功的回执信息

  ![](https://tva1.sinaimg.cn/large/008i3skNgy1gxp8bedgz9j30hv0kv0v7.jpg)

- 通过留言内容的Id号查看留言信息

  ![](https://tva1.sinaimg.cn/large/008i3skNgy1gxp8dxgxdlj30fx0bcq3f.jpg)

  

  ![](https://tva1.sinaimg.cn/large/008i3skNgy1gxp8c2k5bmj30i107vjs1.jpg)

- 用户留言事件在区块链端的日志记录

  ![](https://tva1.sinaimg.cn/large/008i3skNgy1gxp8eesnpej31wu06y0ts.jpg)

- 用户违规发言的扣分记录

  ![](https://tva1.sinaimg.cn/large/008i3skNgy1gxp8elm4ylj31ry0aitad.jpg)

#### 3.2.2 前端代码

1. 用户提交留言:用户在表单中输入留言标题和留言内容。通过`placeholder`给用户提供输入内容事例。防止用户不知道该如何留言。表单设置容纳最大大小为500字，防止内容过多。

   ```html
   <!--pages/suggest/addSuggest/addSuggest.wxml-->
   <view class="cu-form-group">
     	<!--用户输入留言的标题和内容,后台通过js请求生成留言Id号并获取用户Id-->
       <view class="title">建言标题</view>
       <input placeholder="如：审批流程问题建议" maxlength="50" value="{{suggestTitle}}" bindinput="getSuggestTitle"></input>
     </view>
     <view class="cu-form-group align-start" style="height: 500rpx;">
       <view class="title">建言内容</view>
       	<!--给出用户示例输入-->
       <textarea maxlength="-1" value="{{suggestContent}}" placeholder="请输入政府办公流程体制内存在的具体问题及有可能解决该问题的建议" bindinput="getSuggestContent" style="height: 450rpx;"></textarea>
     </view>
     <view class="btn-area padding-xl">
       <!--两个按钮.用户确认无误点击提交,否则点击重新填写-->
       <button class="cu-btn block bg-cyan lg" style="width: 500rpx; height: 80rpx;" bindtap="postSuggest"><text
           class="cuIcon-upload" style="margin-right: 7rpx;"></text>提交建议</button>
       <button class="cu-btn block bg-grey margin-tb-sm lg" style="width: 500rpx; height: 80rpx;"
         bindtap="resetSuggest"><text class="cuIcon-refresh" style="margin-right: 7rpx;"></text>重新填写</button>
     </view>
   ```

2. 用户留言内容展示:后端通过`http`请求将用户留言的标题、内容、留言时间、上传用户的Id、留言内容是否合规等信息展示到前端来。这里对用户留言合规用绿色表示，如果不合格用红色表示，起到醒目的作用。

```html
<!--pages/suggest/suggestInfo/suggestInfo.wxml-->
<view class="cu-bar bg-white" style="margin: 0rpx 0 1rpx 0;">
  <view class="action">
    <text class="cuIcon-title text-green"></text>
    <text>建言标题</text>
  </view>
</view>
<view class="padding bg-white text-bold">{{title}}</view>
<view class="cu-bar bg-white" style="margin: 1rpx 0 1rpx 0;">
  <view class="action">
    <text class="cuIcon-title text-green"></text>
    <text>建言内容</text>
  </view>
</view>
<view class="padding bg-white" style="margin: 0rpx 0 2rpx 0;text-align: justify;">{{content}}</view>
<view class="cu-form-group">
  <view class="title">留言时间</view>
  <view>{{suggestTime}}</view>
</view>
<view class="cu-form-group">
  <view class="title">上传用户ID</view>
  <view class="text-right">{{userId}}</view>
</view>
<view class="cu-form-group">
  <view class="title">内容是否合规</view>
  <view class="text-{{isCompliance=='内容合规'?'green':'red'}}">{{isCompliance}}</view>
</view>
```

- 用户留言前端界面图:

  <img src="https://tva1.sinaimg.cn/large/008i3skNgy1gxp8yis1hej30ku112abb.jpg" alt="用户留言" style="zoom:60%;" />

- 用户查看自己的留言记录图:

  <img src="https://tva1.sinaimg.cn/large/008i3skNgy1gxp8yubgxjj30ku112gn1.jpg" style="zoom:60%;" />

- 用户浏览他人留言:

  <img src="https://tva1.sinaimg.cn/large/008i3skNgy1gxp8z6e34fj30ku112ado.jpg" style="zoom:60%;" />

- 用户查看留言内容详情:

  <img src="https://tva1.sinaimg.cn/large/008i3skNgy1gxp8zh1hejj30ku112tat.jpg" style="zoom:60%;" />

#### 3.2.3 后端代码

  后端对用户留言的内容进行判断。如果标题为空或者内容为空，则返回`error`给用户，提醒用户输入为空。对用户留言的内容与从`github`搜集的违规词语料库进行匹配。若用户的留言内容违规，那么将调用`api`对用户的信用积分进行扣分处理。

```python
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
  #判断用户的留言内容是否违规,从github上搜集违规词存入keywords.txt文件中,如果用户留言内容在违规词内则判定为违规
  def checkContent(content):
    gfw = DFAFilter()
    gfw.parse("keywords.txt")
    number = len(content.split("*"))-1
    text = gfw.filter(content, "*")
    data = {"num": len(text.split("*"))-1-number, "text": text}
    return data
  #获取用户留言细息,展示到前端页面
  def returnSuggestList(request):
    obj = json.loads(request.body)
    pageSize = 10
    currentPage = obj['currentPage']
    startRow = (currentPage - 1) * pageSize
    endRow = currentPage * pageSize
    suggests = Suggest.objects.all().order_by('-id')[startRow:endRow]
    suggestList = []
    #遍历所有的留言记录,取出留言的Id号、留言标题、留言内容、是否违规、留言时间
    for s in suggests:
        obj = {"id": s.id, "userId": s.user.userLoginName, 'title': s.changeSuggestTitle,
               "content": s.changeSuggestContent,
               "isCompliance": s.isCompliance, "suggestTime": s.suggestTime.strftime("%Y.%m.%d")}
        suggestList.append(obj)
    return JsonResponse({"suggestList": suggestList})
  
```



### 3.3 巡检模块

​	该模块模拟了在实际生活中，政府部门经常会有一些任务，要求在什么时候去哪些 地方巡查，也就涉及到用户打卡，我们将用户打卡记录上链，避免了代打卡，甚至篡改数据库等问题。同时领导可以通过下属的用户 ID查看他的打卡记录信息。

#### 3.3.1 合约代码

**1.功能说明：**本合约实现功能主要为:1.用户打卡2.查看用户打卡信息记录

- `ClockIn(string memory _userid,string memory _location,string memory _time)`实现用户打卡功能:传入用户Id号,打卡地点,打卡时间

- `getUserClockInfo(string _userid)`查看用户打卡记录;传入用户Id

  ```solidity
  pragma solidity ^0.4.25;
  import "../utils/TimeUtil.sol";
  import "../utils/StringUtil.sol";
  import "./TableDefTools.sol";
  pragma experimental ABIEncoderV2;
  contract Track is TableDefTools{
      /*******   引入库  *******/
      using TimeUtil for *;
      using StringUtil for *;
  /*
  * Track实现用户打卡巡检合约
  * 主要包括：1.用户打卡2.查看用户打卡记录返回JSON数组
  *
  */
      /*
      * 构造函数，初始化使用到的表结构
      *
      * @param    无
      *
      * @return   无
      */
      constructor() public{
          //初始化需要用到的表。数据资源表
          initTableStruct(t_track_struct, TABLE_TRACK_NAME, TABLE_TRACK_PRIMARYKEY, TABLE_TRACK_FIELDS);
      }
        //定义事件日志信息
     event TRACK_EVENT(string user_id,string user_location,string time);//用户打卡记录日志。谁在哪里什么时间打的卡
      /*
      * 1.用户打卡
      *
      * @param _userid  用户id
      * @param _location 地点名   
      * @param _time      打卡时间
      * @return 执行状态码
      *
      * 测试举例  参数一："191867345212322"  
      * 参数二："江西省人民政府","2020年1月19日15点58分29秒"
      *注册成功返回SUCCESS否则返回错误码，错误码对应的问题请参考DB
      */
      function ClockIn(string memory _userid,string memory _location,string memory _time) public returns(int8){
          string memory storeFields=StringUtil.strConcat3(_location,',',_time);
          emit TRACK_EVENT(StringUtil.strConcat2("用户ID:",_userid),StringUtil.strConcat2("打卡地点:",_location),StringUtil.strConcat2("到达时间:",_time));
          return insertOneRecord(t_track_struct,_userid,storeFields,true);
      }
      /*
      * 2.查询用户打卡记录并以JSON方式输出
      *
      * @param _userid  用户id
      *
      * @return 执行状态码
      * @return 该用户去过的地方的JSON数组
      *
      * 测试举例  参数一："191867345212322"
      */
      function getUserClockInfo(string _userid) public view returns(int8, string){
          return selectOneRecordToJson(t_track_struct,_userid);
      }
  }
  ```

  **2 使用实例:**

  - 用户打卡:小程序自动获取用户的Id唯一主键、调用`wx.getLocation(Object object)`获取用户

  的打卡地点.

  ![](https://tva1.sinaimg.cn/large/008i3skNgy1gxpuwpcxrrj30fw0efdgm.jpg)

  用户成功打卡完成后返回信息如下:

  ![](https://tva1.sinaimg.cn/large/008i3skNgy1gxpuxsc61pj30ie0i53zk.jpg)

  - 通过输入用户的Id以json的形式返回用户的打卡信息：

    查询输入:

    ![](https://tva1.sinaimg.cn/large/008i3skNgy1gxpuzdsm2gj30fz0aywex.jpg)

    

  查询成功返回如下图所示，查询失败返回错误码

  ![](https://tva1.sinaimg.cn/large/008i3skNgy1gxpv03k1mjj30hw081t8y.jpg)

用户打卡信息日志记录:

![](https://tva1.sinaimg.cn/large/008i3skNgy1gxpvadudgpj31rq0ee41l.jpg)

#### 3.3.2 前端代码

​	用户打卡界面以两个按钮为主。点击授权获取地址按钮可以调用微信的获取用户地址的接口，得到当前所在位置的经纬度，查看无误后，点击打卡即可。

```html
<!--用户打卡的前端页面-->
<view class="zan-dialog zan-dialog--show">
  <view class="zan-dialog__mask" />
  <view class="zan-dialog__container">
    <view class="padding flex flex-direction">
      <view class="text-center text-xl text-bold text-cyan margin-bottom">当前地址</view>

      <view class="text-center text-bold">{{localText}}</view>

      <button class="cu-btn bg-cyan margin-top lg" style="width: 500rpx; height: 80rpx;"
        bindtap="postAddressOnChain"><text class="cuIcon-check" style="margin-right: 7rpx;"></text>打卡</button>

      <button class="cu-btn bg-cyan margin-top lg" style="width: 500rpx; height: 80rpx;" open-type="openSetting" bindtap="locationAuthorization"><text class="cuIcon-unlock" style="margin-right: 7rpx;"></text>授权获取地址</button>
    </view>
  </view>
</view>
```

- 用户打卡的前端界面图如下:

  <img src="https://tva1.sinaimg.cn/large/008i3skNgy1gxpv7dtq86j30ku112t9t.jpg" style="zoom:60%;" />

- 查询用户打卡信息:

  查询用户打卡页面在页面上方设置了一个搜索框，用户可以输入查询的用户Id账号，点击搜索后调用合约接口，返回用户的打卡记录，即用户的打卡地点和打卡时间。

  ```html
  <!--查询用户打卡信息的前端页面-->
  <view id="search">
  		<input id="input" placeholder="如：1611628666" placeholder-class="placeholderClass" value="{{searchValue}}" bindinput="getSearchValue"></input>
  		<view id="comfirm" bindtap="search">搜索</view>
  </view>
  <view class="cu-bar padding-top-sm" style="min-height: 80rpx; border-bottom: 2rpx solid #f1f1f1; margin-top: 100rpx;" wx:if="{{hadSearch}}">
    <view class="action">
      <text class="margin-left cuIcon-title text-cyan"></text>
      <text class="text-black text-bold">用户打卡记录</text>
    </view>
  </view>
  <view class="cu-card article" style="height: auto;" wx:for="{{trackList}}" wx:key='id' wx:if="{{hadSearch}}">
    <view class="cu-item shadow">
      <view class="title" style="line-height: 80rpx;">
        <view class="text-cut">{{item.fields.user_location}}</view>
      </view>
      <view class="content" style="height: auto;">
        <!-- <view class="desc"> -->
          <view class="cu-tag bg-white light sm round">{{item.fields.arrival_time}}</view>
        <!-- </view> -->
      </view>
    </view>
  </view>
  <view id="blankArea"
      style="width: 100%;position: absolute;top: 470rpx;display: flex;flex-direction: column;align-items: center;justify-content: center;"
      wx:if="{{trackList.length == 0 && hadSearch}}">
      <image id="blankImage" style="width: 114rpx;height: 100rpx;margin-bottom: 30rpx;" src="/images/blank.png"></image>
      <view id="blankText" style="font-size: 26rpx;color: #999999;text-align: center;white-space:pre-line;">该用户无打卡记录
      </view>
  </view>
  ```

  

<img src="https://tva1.sinaimg.cn/large/008i3skNgy1gxpv7i7rrcj30ku112my5.jpg" style="zoom:60%;" />

#### 3.3.3 后端代码

​	后端调用`wx.getLocation`获取用户当前定位的经纬度.将该信息以及用户的Id通过合约`api`接口调用，存入区块链上。若用户未授权获取定位点击了打卡将会通过`wx.showModel`弹窗的形式给用户提醒未能获得您的定位，请点击“授权获得地址”按钮以获得定位

```javascript
  //调用wx.getLocation获取用户当前定位的经纬度
  showLocal: function () {
    var that = this;
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        let latitude = res.latitude//经度
        let longitude = res.longitude//纬度
        that.setData({
          latitude,
          longitude
        })
        that.getMapCity(latitude, longitude)
      }
    })
  },
      postAddressOnChain: function(){ 
    var that = this
    if(!that.data.canClockIn){
      wx.showModal({
        title: '温馨提示',
        content: '未能获得您的定位，请点击“授权获得地址”按钮以获得定位',
        showCancel: false,
        success (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return
    } else {
      const app = getApp()
      //获取时间
      var date = new Date()
      var year = date.getFullYear() + '年'
      var month = date.getMonth() + 1 + '月'
      var day = date.getDate() + '日'
      var hour = date.getHours() + '点'
      var minute = date.getMinutes() + '分'
      var second = date.getSeconds() + '秒'
      var dateText = year + month + day + hour + minute + second
      //将信息上链
      var objToChain = {
        "groupId" :5,
        "signUserId": "fee97843cf0c45d683bade8fdebe724f",
        "contractAbi":[{"constant":true,"inputs":[{"name":"_userid","type":"string"}],"name":"getUserCityArray","outputs":[{"name":"","type":"int8"},{"name":"","type":"string[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_userid","type":"string"}],"name":"getUserCityJson","outputs":[{"name":"","type":"int8"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_fields","type":"string[]"},{"name":"index","type":"uint256"},{"name":"values","type":"string"}],"name":"getChangeFieldsString","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_userid","type":"string"},{"name":"_location","type":"string"},{"name":"_time","type":"string"}],"name":"ClockIn","outputs":[{"name":"","type":"int8"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"user_id","type":"string"},{"indexed":false,"name":"user_location","type":"string"},{"indexed":false,"name":"time","type":"string"}],"name":"TRACK_EVENT","type":"event"}],
        "contractAddress":"0x8546174c5fe38243e1dcfb65e1347919fe0f45ba",
         "funcName":"ClockIn",
        "funcParam":[app.globalData.idNumber,that.data.localText,dateText],
        "useCns":false
      }
      //通过http请求与链上数据进行交互
      http.httpToChain(objToChain, function (res) {
        if(res.message == 'success' || res.message == 'Success'){
          wx.showToast({
            title: '打卡成功',
            icon: 'success',
            duration: 2000
          })
        }
      })
    }
  },
```



### 3.4 政务合作模块

​	政府要发布某一条消息往往不是某一个人决定的，而是多级领导审核后同意才会通过，在文件传输过程中，如何保障数据不被篡改，区块链就可以起到很大的作用。但是区块链存储数据对资源消耗特别大，因此我们决定对数据**“轻装”上链**。 政府公文文件的 pdf 放链下本地数据库，文件的哈希值上链。需要验证的时候将 pdf 再做一次哈希运算与链上对比，一致则可以保证文件的未被篡改。

#### 3.4.1 合约代码

**1.功能说明：**本合约实现功能主要为:1.科员提交材料2.查询申请材料当前状态 并以Json字符串方式输出3.领导签字图片信息,审核结果信息上链。4.将审核结果决定是否公示

- `applyForDocument(string memory _applicationid,string memory _userid,string memory _informationhash)`:传入文件的Id号、申请人Id、文件的哈希值
- `getApplyJson(string memory _applicationid)`:传入文件的Id号,以Json形式返回文件信息
- `checkApplyResearch(string memory _applicationid,string memory checkhash)`:文件Id号、领导签字图片哈希值 
- `GiveResultToUser(string _checkerid,string memory _applicationid,string memory checkresult)`:审核人Id号、材料Id、审核结果

```solidity
pragma solidity ^0.4.25;
pragma experimental ABIEncoderV2;
import "../utils/TimeUtil.sol";
import "./TableDefTools.sol";
/*
* GovCooperation模拟政府办公协作的流程
* 首先科员提交材料申请。等待上级审批是否通过，通过后公示给大众
*
*/

contract GovCooperation is TableDefTools{
    /*******   引入库  *******/
     using TimeUtil for *;
   /*
    * 构造函数，初始化使用到的表结构
    *
    * @param    无
    *
    * @return   无
    */
    constructor() public{
        //初始化需要用到的表。文件材料申请审核
        //公示政府文件表
        initTableStruct(t_application_struct, TABLE_APPLICATION_NAME, TABLE_APPLICATION_PRIMARYKEY, TABLE_APPLICATION_FIELDS);
    }
    //
    event APPLY_DOCUMENT_EVENT(string userid,string application_id,string date);
    event Track_LeaderSignature(string applicationid,string signHash,string date);//记录领导签字
    event Tack_Final_Result(string applicationid,string checkerid,string result,string date);//记录最后校验部结果
   /*
    * 1.科员提交材料。具体材料放链下，链上存放申请材料哈希值。加密算法采用的sha256目前最安全的一种算法，暂时不可能逆推
    *
    * @param _applicationid  材料id唯一主键
    * @param _fields 用户信息表各字段值拼接成的字符串包括如下：
    *                   材料提交用户ID
    *                   申请材料哈希值  
    *                   申请时间 【调用轮子自动生成】  
    *   【后三个字段, 代表 领导签字哈希值 , 审核结束时间，审核结果。最初默认值为“审批中，审批中，审批中”】后面修改        
    *
    * @return 执行状态码
    *
    * 测试举例  参数一："1976945"  
    * 参数二："1611408890,f44e39c1fc14dc05143eeba2065a921bbbc1bba5"
    *注册成功返回SUCCESS否则返回错误码，错误码对应的问题请参考DB
    */
    function applyForDocument(string memory _applicationid,string memory _userid,string memory _informationhash) public returns(int8){
         // 获得当前的日期
        string memory nowDate = TimeUtil.getNowDate();
        string memory firstTwoFields=StringUtil.strConcat5(_userid,',',_informationhash,',',nowDate);
        string memory lastFourParams = ",审核中,审核中,审核中";
        string memory storeFields = StringUtil.strConcat2(firstTwoFields,lastFourParams);
        emit APPLY_DOCUMENT_EVENT(StringUtil.strConcat2("申请人的ID号为:",_userid),StringUtil.strConcat2("材料的ID为:",_applicationid),StringUtil.strConcat2("申请时间为:",nowDate)); 
        return insertOneRecord(t_application_struct,_applicationid,storeFields,false);//最后的false代表主键下记录不可重复
    }
    /*
    * 2.查询申请材料当前状态 并以Json字符串方式输出
    *
    * @param _applicationid  材料id唯一主键
    *
    * @return 执行状态码
    * @return 该用户信息的字符串数组
    *
    * 测试举例  参数一："1976945"
    */
      function getApplyJson(string memory _applicationid) public view returns(int8, string){
        return selectOneRecordToJson(t_application_struct,_applicationid);
    }
    /*
    * 3.领导签字图片信息,审核结果信息上链。具体材料放链下，链上存放申请材料哈希值。加密算法采用的sha256目前最安全的一种算法，暂时不可能逆推
    * 具体操作为修改申请表的check_hash字段
    * @param _applicationid  材料id唯一主键
    * @param checkhash 领导签字图片哈希值     
    *
    * @return 执行状态码
    *
    * 测试举例  参数一："1976945"  
    * 参数二："f88r46f6ki14dc05143eeba2065a921bbbc1bbqi5"
    *注册成功返回SUCCESS否则返回错误码，错误码对应的问题请参考DB
    */
    function checkApplyResearch(string memory _applicationid,string memory checkhash) public returns(int8){
        // 获得当前的日期
        string memory nowDate = TimeUtil.getNowDate();
          //查询用户申请信息返回状态
        int8 queryRetCode; 
        //更新用户申请保送表后返回状态
        int8 updateRetCode;
        // 数据表返回信息
        string[] memory retArray;
         // 查看该用户申请审核信息
        (queryRetCode, retArray) = selectOneRecordToArray(t_application_struct, _applicationid, ["application_id", _applicationid]);
          // 若存在该用户记录
        if(queryRetCode == SUCCESS_RETURN){
             string memory changedFieldsStr = getChangeFieldsString(retArray,3,checkhash);
             updateRetCode = (updateOneRecord(t_application_struct,_applicationid,changedFieldsStr));
            if(updateRetCode == SUCCESS_RETURN){
                //记录日志
              emit Track_LeaderSignature(StringUtil.strConcat2("材料Id为:",_applicationid),
              StringUtil.strConcat2("领导签字图片的哈希为:",checkhash),StringUtil.strConcat2("申请时间为:",nowDate)); 
               return SUCCESS_RETURN;
            }
            else{
                return FAIL_RETURN;
            }
        }else{
            return FAIL_RETURN;
        }
    }
    /*
    * 4.校验部验证完以后,把是否公开结果上链。
    * @param _checkerid 校验人员id
    * @param _applicationid  材料id唯一主键
    * @param checkresult 该文件是否通过审批，公示给大众。通过/不通过：      
    *
    * @return 执行状态码
    *
    * 测试举例  参数一："186789,1976945,"通过""  

    *注册成功返回SUCCESS否则返回错误码，错误码对应的问题请参考DB
    */
    function GiveResultToUser(string _checkerid,string memory _applicationid,string memory checkresult) public returns(int8){
        //查询文件信息返回状态
        int8 queryRetCode; 
        //更新文件后返回状态
        int8 updateRetCode;
        // 数据表返回信息
        string[] memory retArray;
        // 获得当前的日期
        string memory nowDate = TimeUtil.getNowDate();
        // 查看该科员申请审核信息
        (queryRetCode, retArray) = selectOneRecordToArray(t_application_struct, _applicationid, ["application_id", _applicationid]);
         // 若存在该用户记录
        if(queryRetCode == SUCCESS_RETURN){
            //修改科员申请表中的审核时间
             string memory changedFieldsStr = getChangeFieldsString(retArray, 5, nowDate);
            //修改
            updateRetCode = (updateOneRecord(t_application_struct, _applicationid,changedFieldsStr));
            if(updateRetCode == SUCCESS_RETURN){
            string memory changedFieldsStr2 = getChangeFieldsString(retArray, 4, checkresult);
            emit Tack_Final_Result(StringUtil.strConcat2("审核人Id为:",_checkerid),StringUtil.strConcat2("审核材料id为:",_applicationid),
            StringUtil.strConcat2("审核结果为:",checkresult),StringUtil.strConcat2("审核完成时间为:",nowDate)); 
            return (updateOneRecord(t_application_struct,_applicationid,changedFieldsStr2)); 
            }
        }
        else{
            // 若不存在该科员提交记录
            return FAIL_RETURN;
        }
    }
}
```

**2 使用实例:**

- 科员上传文件

  <img src="https://tva1.sinaimg.cn/large/008i3skNgy1gxpwn4jt1dj30hp0i6wfj.jpg" style="zoom:67%;" />

- 输入文件id号查询文件状态

  ![](https://tva1.sinaimg.cn/large/008i3skNgy1gxpwnif66xj30ic07tq36.jpg)

- 领导签字哈希上链：

​	![](https://tva1.sinaimg.cn/large/008i3skNgy1gxpws7ygl5j30fg0d474u.jpg)

成功回执信息:

![](https://tva1.sinaimg.cn/large/008i3skNgy1gxpwsncb6fj30hg0i0jsc.jpg)

- 审核员审批.校验文件没被篡改、且领导意见为通过、领导签名未被篡改后，提交最终审批结果如下:

  ![](https://tva1.sinaimg.cn/large/008i3skNgy1gxpwtnefe3j30fj0e5wf3.jpg)

  交易回执:

  ![](https://tva1.sinaimg.cn/large/008i3skNgy1gxpwtzu330j30u00vtmzk.jpg)

- 科员提交文件日志信息:

  ![](https://tva1.sinaimg.cn/large/008i3skNgy1gxpwvqcn5qj31wu06y3z9.jpg)

- 领导审批日志信息:

- ![](https://tva1.sinaimg.cn/large/008i3skNgy1gxpwvw3wgfj31wu06ywfd.jpg)

- 审核结果日志信息:

  ![](https://tva1.sinaimg.cn/large/008i3skNgy1gxpww2yjeuj31wu06yjs6.jpg)

  

#### 3.4.2 前端代码

​	前端以一个表单的形式让用户手工输入文件的名称和内容，另外选择文件（支持doc和pdf等格式）。选择完后点击上传即可。领导审核的时候，将下载下来该文件，并计算文件的哈希值与区块链上存储的文件哈希值作比对，一致则说明文件没发生篡改，才可以进行后面的步骤，否则将会报错。

```html
<!--pages/resourceView/resourceInfo/resourceInfo.wxml-->
<!--填写文件信息-->
<view class="cu-bar bg-white padding-top-sm" style="min-height: 80rpx; border-bottom: 2rpx solid #f1f1f1;">
  <view class="action">
    <text class="cuIcon-title text-cyan"></text>
    <text class="text-black text-bold">文件名称</text>
  </view>
</view>
<view class="cu-bar bg-white" style="min-height: 80rpx; border-bottom: 2rpx solid #f1f1f1;">
  <view class="action" style=" margin:0 67rpx 0 67rpx;">
    <text>{{title}}</text>
  </view>
</view>
<view class="cu-bar bg-white" style="min-height: 80rpx; border-bottom: 2rpx solid #f1f1f1;">
  <view class="action">
    <text class="cuIcon-title text-cyan"></text>
    <text class="text-black text-bold">文件介绍</text>
  </view>
</view>
<view class="cu-bar bg-white" style="min-height: 20rpx; border-bottom: 2rpx solid #f1f1f1;">
  <view class="action padding text-content" style=" margin:0 37rpx 0 37rpx;">
    <text>{{introduction}}</text>
  </view>
</view>
<view class="cu-bar bg-white" style="min-height: 80rpx; border-bottom: 2rpx solid #f1f1f1;">
  <view class="action">
    <text class="cuIcon-title text-cyan"></text>
    <text class="text-black text-bold">上传时间：</text><text>{{uploadTime}}</text>
  </view>
</view>
<view class="cu-bar bg-white" style="min-height: 80rpx; border-bottom: 2rpx solid #f1f1f1;">
  <view class="action">
    <text class="cuIcon-title text-cyan"></text>
    <text class="text-black text-bold">资料提供者ID：</text><text>{{userId}}</text>
  </view>
</view>
<view class="cu-bar bg-white" style="min-height: 80rpx; border-bottom: 2rpx solid #f1f1f1;">
  <view class="action">
    <text class="cuIcon-title text-cyan"></text>
    <text class="text-black text-bold">资料总下载次数：</text><text>{{downloadNum}}</text>
  </view>
</view>
<!--通过把文件的哈希值与该文件的id对应的区块链端的哈希值做对比保障文件未被篡改-->
<view class="text-center margin-top text-gray">校验可保证你下载的文件并未被他人修改</view>

<view class="btn-area padding-xl">
  <button class="cu-btn block {{buttonBg}} lg" style="width: 550rpx; height: 80rpx;" bindtap="downloadDataAndCheck"
    disabled="{{loading}}"><text class="{{buttonIcon}}" style="margin-right: 7rpx;"></text>{{buttonText}}</button>
</view>
```

- 科员提交文件界面图:

  <img src="https://tva1.sinaimg.cn/large/008i3skNgy1gxpx0u29gxj30ku1120u6.jpg" style="zoom:67%;" />

- 科员查看文件审核进度：

  <img src="https://tva1.sinaimg.cn/large/008i3skNgy1gxpx14seyoj30ku112mz3.jpg" style="zoom:67%;" />

- 科长签字审核:

  <img src="https://tva1.sinaimg.cn/large/008i3skNgy1gxpx1eofdkj30ku112wgc.jpg" style="zoom:67%;" />

- 处长审核：

  <img src="https://tva1.sinaimg.cn/large/008i3skNgy1gxpx1m9pbwj30ku112tak.jpg" style="zoom:67%;" />

- 文件公示:

  <img src="https://tva1.sinaimg.cn/large/008i3skNgy1gxpx1uyq16j30ku112wh4.jpg" style="zoom:67%;" />



#### 3.4.3 后端代码

​	后端代码分为这几个功能1.查看文件的状态；2.将领导审核的意见存储上链3.将领导审核的签名哈希上链；通过这些功能来保障信息是没有被篡改过的，做到协同办公，最后将文件审核结果公示给用户。

```python
# 查看文件当前状态
def returnApplyStatus(request):
    obj = json.loads(request.body)
    user = get_user(obj)
    if not user:
        return HttpResponse('false')  # token过期
    else:
      	#通过文件的id查询文件的当前状态
        a = OfficeFile.objects.get(id=obj['fileId'])
        data = {'uploadTime': a.uploadTime.strftime("%Y.%m.%d"),
                "informationLink": a.informationLink, "informationHash": a.informationHash,
                "boss1Opinion": a.boss1Opinion, "boss1SignLink": a.boss1SignLink, "boss1SignHash": a.boss1SignHash,
                "boss2Opinion": a.boss2Opinion, "boss2SignLink": a.boss2SignLink, "boss2SignHash": a.boss2SignHash,
                "checkHash": a.checkHash, "researchResult": a.researchResult, 'reviewResult': a.reviewResult
                }
        #以json形式返回结果
        return JsonResponse(data)

#领导审核
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
#将领导签字图片的哈希值上链
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
class OfficeFile(models.Model):
  	#
    dataTitle = models.CharField('文件标题', max_length=50)
    dataIntroduction = models.CharField('文件简介', max_length=255)
    informationLink = models.CharField('文件链接', max_length=255)
    informationHash = models.CharField('文件哈希值', max_length=64)
    uploadTime = models.DateTimeField(verbose_name='上传时间', auto_now_add=True)
    downloadsNum = models.IntegerField('下载次数', default=0)
    boss1SignLink = models.CharField('签字图片1下载链接', max_length=255, null=True)
    boss1SignHash = models.CharField('签字图片1哈希值', max_length=64, null=True)
    boss1Opinion = models.BooleanField('领导1意见', null=True)
    boss2SignLink = models.CharField('签字图片2下载链接', max_length=255, null=True)
    boss2SignHash = models.CharField('签字图片2哈希值', max_length=64, null=True)
    boss2Opinion = models.BooleanField('领导2意见', null=True)
    checkHash = models.CharField(verbose_name='审核结果哈希值', null=True, max_length=64)
    reviewResult = models.BooleanField(verbose_name='审核结果', null=True)
    researchResult = models.BooleanField(verbose_name='最终结果', null=True)  # 最终意见opinion
    workingStatus = models.BooleanField(verbose_name='工作已经完成', default=False, null=True)
    class Meta:
        verbose_name_plural = "办公流程"
    def __str__(self):
        return self.dataTitle
```



#### 

## 4.后记

- 该项目已获得2020-2021腾讯举办的高校微信小程序比赛**华中赛区三等奖**
- 2020-2021区块链服务(BSN)第三届开发者大赛高校组**全国最佳创意奖**
- 2020-2021年未来杯区块链大赛**全国最佳代码奖**
- 所有相关代码已经开源。运行有任何问题可以提issue。如项目对您有帮助，**欢迎star支持**！
- 本人关注前沿知识，热衷于开源。获得**Fisco Bcos 2021年度贡献MVP**


