# 政务通——区块链助力政府办公

## 项目简介

​	区块链具有不可篡改性以及可追溯性，因此对于一些重要信息区块链更能够保障信息的安全。基于区块链的这两大特点，我们决定做一个基于区块链的政府办公小程序。可以在这款小程序上实现**协同办公**，**数据脱敏上链**，以及**数据溯源**打破数据孤岛等功能。以小程序为载体，体现了区块链在实际生活中的具体作用。总体设计分为五个模块。具体如下：

| 功能模块                                 | 技术特点                                                     |
| ---------------------------------------- | ------------------------------------------------------------ |
| 1. **用户管理模块**                      | 注册时候对用户信息进行**资产数字化处理**，用户密码等关键信息脱敏上链。存储的是通过sha256运算后的哈希值，保障了用户的安全。用户登录时，输入密码进行一次哈希运算，与链上比对，即完成“**确权**”，验证一致才可登陆。 |
| 2. **建言献策模块**                      | 用户留言内容记录上链，同时对留言内容**调用外部api**，如果留言内容涉及敏感词，则扣除用户信用积分。**打造一个好的社会信用生态** |
| **3巡检模块**                            | 用户打卡记录上链，涉及“数据溯源”                             |
| **4.政务合作模块**                       | 体现联盟链的**“多方协作”**特点，同时涉及到**“确权”。**       |
| **5.政府选择性开放数据以及数据追溯模块** | 政府选择性对特定用户公开指定信息，**打破数据孤岛**，同时对用户查看的信息进行追踪，实现**数据可追溯**，谁在什么时间查看了什么内容都将记录上链。 |

## 功能模块图及小程序体验图

- 功能模块图

  ![image](https://github.com/Jay1213811/Government-office-program-based-on-blockchain/blob/master/img/%E5%BE%AE%E4%BF%A1%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%8A%9F%E8%83%BD%E6%A8%A1%E5%9D%97%E5%9B%BE.png)

- 小程序体验图

  ![image](https://github.com/Jay1213811/Government-office-program-based-on-blockchain/blob/master/img/%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%9B%BE.png)

## 系统实现
1. ##### 注册登录：

   ##### 注册登录模块可使用户在区块链上生成一个账号，进而为用户提供设置数字指纹和确权登录的操作手段，以此实现用户的操作安全性，确保用户的账号数据安全为用户本人操作。

##### 1.1用户注册：注册即用户输入6-20位的字符串作为密码，然后在微信小程序端进行哈希值加密后再进行网络传输保存到云端服务器和区块链上，由于区块链具有公开透明性，因此对于用户的密码这些私密信息我们采用数据脱敏上链，用户密码通过sha256加密处理后，将密码哈希上链。如此一来保障了用户密码的安全。

- 小程序端界面展示图：

  ![](https://github.com/Jay1213811/Government-office-program-based-on-blockchain/blob/master/img/%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%9B%BE/%E6%B3%A8%E5%86%8C.png)

- 区块链端数据展示图：

  ![](https://github.com/Jay1213811/Government-office-program-based-on-blockchain/blob/master/img/%E5%8C%BA%E5%9D%97%E9%93%BE%E9%83%A8%E5%88%86%E7%9A%84%E5%9B%BE/%E7%94%A8%E6%88%B7%E6%B3%A8%E5%86%8C/%E7%94%A8%E6%88%B7%E6%B3%A8%E5%86%8C%E4%BA%8B%E4%BB%B6.png)

##### 1.2.登录：确权登录的操作手段，以此实现用户的操作安全性，确保用户的账号数据安全为用户本人操作。用户密码后小程序端将做一次哈希运算。利用这个哈希值和区块链端链上这个用户id对应的密码哈希值比较，进行一次”确权“操作，校验一致后，通过则读取用户的信息展示到前端。读数据不会产生新的区块，因此区块链端没有新的信息产生：

- 小程序端界面图：

  ![](https://github.com/Jay1213811/Government-office-program-based-on-blockchain/blob/master/img/%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%9B%BE/%E7%99%BB%E5%BD%95.png)

##### 2.建言献策：

​	我们模拟了普通用户可以在小程序上向政府提交一些意见，留言内容上链的同时会使用外部api对用户所发布的内容进行违规词检测，如果监测到违规词会将违规词用*符号替换，以保证软件内容文明友善。同时会对违规留言用户扣分，如果分数低于60分将无法留言。用户可输入建言标题和建言内容，确保内容无误后点击“提交建议”后数据将上传到云端服务器和区块链，在云端服务器中会调用api对用户所发布的内容进行违规词检测替换，若内容有不文明用词将扣除用户1点信用值，且将建言标题内容和信用扣除记录上传到区块链上，否则就只将建言标题内容上传到区块链上。

- 小程序界面展示图：

  ![](https://github.com/Jay1213811/Government-office-program-based-on-blockchain/blob/master/img/%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%9B%BE/%E7%94%A8%E6%88%B7%E7%95%99%E8%A8%80.png)

- 区块链端用户留言事件图：

  ![](https://github.com/Jay1213811/Government-office-program-based-on-blockchain/blob/master/img/%E5%8C%BA%E5%9D%97%E9%93%BE%E9%83%A8%E5%88%86%E7%9A%84%E5%9B%BE/%E5%BB%BA%E8%A8%80%E7%8C%AE%E7%AD%96/%E7%94%A8%E6%88%B7%E7%95%99%E8%A8%80%E4%BA%8B%E4%BB%B6.png)

- 区块链端用户违规留言事件图：

  ![](https://github.com/Jay1213811/Government-office-program-based-on-blockchain/blob/master/img/%E5%8C%BA%E5%9D%97%E9%93%BE%E9%83%A8%E5%88%86%E7%9A%84%E5%9B%BE/%E5%BB%BA%E8%A8%80%E7%8C%AE%E7%AD%96/%E4%B8%8D%E8%89%AF%E7%95%99%E8%A8%80%E6%89%A3%E5%88%86%E4%BA%8B%E4%BB%B6.png)
  
  

##### 3.建言浏览:

用户可在小程序首页浏览所有用户提交的建议，且每条建议会显示建议提交者ID、提交时间以及是否违规。

- 小程序端界面展示图:

  ![](https://github.com/Jay1213811/Government-office-program-based-on-blockchain/blob/master/img/%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%9B%BE/%E6%B5%8F%E8%A7%88%E5%88%AB%E4%BA%BA%E7%95%99%E8%A8%80.png)

  

##### 4.建言记录:

用户可在个人中心的信用值记录查看自己提交的建言的详细记录.

- 小程序界面图:

  ![](https://github.com/Jay1213811/Government-office-program-based-on-blockchain/blob/master/img/%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%9B%BE/%E6%9F%A5%E7%9C%8B%E7%95%99%E8%A8%80%E8%AF%A6%E6%83%85.png)

##### 5.巡检:

​	我们模拟了在实际生活中，政府部门经常会有一些任务，要求在什么时候去哪些地方巡查，也就涉及到用户打卡，我们将用户打卡记录上链。同时领导可以通过下属的用户ID查看他的打卡记录信息

- 小程序界面图:

  1. 打卡

     ![](https://github.com/Jay1213811/Government-office-program-based-on-blockchain/blob/master/img/%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%9B%BE/%E6%89%93%E5%8D%A1.png)

  2. 查看个人打卡记录

     ![](https://github.com/Jay1213811/Government-office-program-based-on-blockchain/blob/master/img/%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%9B%BE/%E6%9F%A5%E7%9C%8B%E4%B8%AA%E4%BA%BA%E6%89%93%E5%8D%A1%E8%AE%B0%E5%BD%95.png)

  3. 领导查看下属打卡记录

     ![](https://github.com/Jay1213811/Government-office-program-based-on-blockchain/blob/master/img/%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%9B%BE/%E9%A2%86%E5%AF%BC%E6%9F%A5%E7%9C%8B%E4%B8%8B%E5%B1%9E%E6%89%93%E5%8D%A1%E8%AE%B0%E5%BD%95.png)

- 区块链端界面图:

  ![](https://github.com/Jay1213811/Government-office-program-based-on-blockchain/blob/master/img/%E5%8C%BA%E5%9D%97%E9%93%BE%E9%83%A8%E5%88%86%E7%9A%84%E5%9B%BE/%E5%B7%A1%E6%A3%80/%E5%B7%A1%E6%A3%80%E7%94%A8%E6%88%B7%E6%89%93%E5%8D%A1.png)

##### 6.政务合作

##### 6.1科员上传文件

​	政府要发布某一条消息往往不是某一个人决定的，而是多级领导审核后同意才会通过，在文件传输过程中，如何保障数据不被篡改，区块链就可以起到很大的作用。但是区块链存储数据对资源消耗特别大，因此我们决定对数据“轻装”上链。政府公文文件的pdf放链下本地数据库，文件的哈希值上链。需要验证的时候将pdf再做一次哈希运算与链上对比，一致则可以保证文件的未被篡改。

- 科员上传文件小程序界面图:

  ![](https://github.com/Jay1213811/Government-office-program-based-on-blockchain/blob/master/img/%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%9B%BE/%E7%A7%91%E5%91%98%E4%B8%8A%E4%BC%A0%E6%96%87%E4%BB%B6%E7%AD%89%E5%BE%85%E5%AE%A1%E6%A0%B8.png)

- 科员查看申请进度

  ![](https://github.com/Jay1213811/Government-office-program-based-on-blockchain/blob/master/img/%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%9B%BE/%E7%A7%91%E5%91%98%E6%9F%A5%E7%9C%8B%E6%96%87%E4%BB%B6%E5%AE%A1%E6%A0%B8%E8%BF%9B%E5%BA%A6.png)

##### 6.2领导审核文件

​	科长和处长审核，提交意见以及签字照片，审核后意见以及签名照片哈希值上链。首先领导要校验文件是否未被篡改，将下载该文件进行一次哈希运算，通过文件ID去与链上该文件当初上链的哈希值做比对，保障文件没有被篡改过，保障安全性。两个领导审核流程是一样的，过程不上链，只将最后领导审核的意见，以及两个领导签字照片的哈希值上链。

- 科长审核界面图

  ![](https://github.com/Jay1213811/Government-office-program-based-on-blockchain/blob/master/img/%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%9B%BE/%E7%A7%91%E9%95%BF%E7%AD%BE%E5%90%8D%E5%AE%A1%E6%A0%B8.png)

- 处长审核界面图

  ![](https://github.com/Jay1213811/Government-office-program-based-on-blockchain/blob/master/img/%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%9B%BE/%E5%A4%84%E9%95%BF%E5%AE%A1%E6%A0%B8.png)

- 审核部门审核界面图

  ![](https://github.com/Jay1213811/Government-office-program-based-on-blockchain/blob/master/img/%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%9B%BE/%E6%A0%A1%E9%AA%8C%E5%91%98%E5%AE%A1%E6%A0%B8.png)

- 审核事件数据区块链端记录

  ![](https://github.com/Jay1213811/Government-office-program-based-on-blockchain/blob/master/img/%E5%8C%BA%E5%9D%97%E9%93%BE%E9%83%A8%E5%88%86%E7%9A%84%E5%9B%BE/%E5%8D%8F%E5%90%8C%E5%8A%9E%E5%85%AC/%E5%AE%A1%E6%A0%B8%E4%BA%BA%E5%91%98%E5%AE%A1%E6%A0%B8%E4%BA%8B%E4%BB%B6.png)
  
  ![](https://github.com/Jay1213811/Government-office-program-based-on-blockchain/blob/master/img/%E5%8C%BA%E5%9D%97%E9%93%BE%E9%83%A8%E5%88%86%E7%9A%84%E5%9B%BE/%E5%8D%8F%E5%90%8C%E5%8A%9E%E5%85%AC/%E7%A7%91%E5%91%98%E6%8F%90%E4%BA%A4%E6%96%87%E4%BB%B6%E8%AF%B7%E6%B1%82%E5%85%AC%E7%A4%BA.png)
  
  ![](https://github.com/Jay1213811/Government-office-program-based-on-blockchain/blob/master/img/%E5%8C%BA%E5%9D%97%E9%93%BE%E9%83%A8%E5%88%86%E7%9A%84%E5%9B%BE/%E5%8D%8F%E5%90%8C%E5%8A%9E%E5%85%AC/%E9%A2%86%E5%AF%BC%E5%AE%A1%E6%A0%B8%E7%AD%BE%E5%AD%97%E7%85%A7%E7%89%87%E5%93%88%E5%B8%8C%E4%B8%8A%E9%93%BE.png)



##### 7政府选择性开放数据以及数据追溯

政府人员选择性公开某些数据给特定人看并对谁在什么时间查看了进行追踪，记录上链。打破了数据孤岛，实现了数据的可追溯性。

- 政府选择性公开数据界面图

  ![](https://github.com/Jay1213811/Government-office-program-based-on-blockchain/blob/master/img/%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%9B%BE/%E6%9F%A5%E7%9C%8B%E6%94%BF%E5%BA%9C%E5%85%AC%E5%BC%80%E7%9A%84%E6%95%B0%E6%8D%AE.png)

- 选择性公开信息事件记录图

  ![](https://github.com/Jay1213811/Government-office-program-based-on-blockchain/blob/master/img/%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%9B%BE/%E6%94%BF%E5%BA%9C%E4%BA%BA%E5%91%98%E6%95%B0%E6%8D%AE%E9%80%89%E6%8B%A9%E6%80%A7%E5%85%AC%E5%BC%80.jpeg)

数据追溯：用户查看了数据后，区块链端将会留有记录，谁在什么时间查阅了什么数据将会被记录到区块链日志中

- 用户查看数据界面区块链端图

  ![](https://github.com/Jay1213811/Government-office-program-based-on-blockchain/blob/master/img/%E5%8C%BA%E5%9D%97%E9%93%BE%E9%83%A8%E5%88%86%E7%9A%84%E5%9B%BE/%E6%95%B0%E6%8D%AE%E8%BF%BD%E8%B8%AA/%E6%95%B0%E6%8D%AE%E8%BF%BD%E8%B8%AA%EF%BC%8C%E8%B0%81%E6%9F%A5%E7%9C%8B%E4%BA%86%E6%94%BF%E5%BA%9C%E5%85%AC%E5%BC%80%E7%9A%84XX%E4%BF%A1%E6%81%AF.png)

- 领导选择性公开数据区块链端图

  ![](https://github.com/Jay1213811/Government-office-program-based-on-blockchain/blob/master/img/%E5%8C%BA%E5%9D%97%E9%93%BE%E9%83%A8%E5%88%86%E7%9A%84%E5%9B%BE/%E6%95%B0%E6%8D%AE%E8%BF%BD%E8%B8%AA/%E9%A2%86%E5%AF%BC%E9%80%89%E6%8B%A9%E6%80%A7%E5%85%AC%E5%BC%80%E6%95%B0%E6%8D%AE%E4%BA%8B%E4%BB%B6.png)

## 

## 	后记

- 该项目已获得2020-2021腾讯举办的高校微信小程序比赛**华中赛区三等奖**
- 所有相关代码已经开源。运行有任何问题可以提issue。如项目对您有帮助，**欢迎star支持**！
- 本人关注前沿知识，热衷于开源。获得**Fisco Bcos 2021年度贡献MVP**
- 目前在准备找**Golong后端开发/区块链开发**相关实习，有一起的小伙伴可以滴滴.

