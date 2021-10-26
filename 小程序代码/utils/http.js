module.exports = {
  httpRequest: httpRequest,
  checkToken: checkToken,
  qiniuFileUpload: qiniuFileUpload,
  httpToChain: httpToChain,
}

//const baseUrl = "http://127.0.0.1:8000/";//测试环境
const baseUrl = "https://www.blockchain.jhw66.cn/"; //正式环境
//const baseUrl = "https://blockchain.luckydraw.net.cn/"; //正式环境

/**
 * loading:是否显示loading，参数为true/false
 * url:变化的url后缀
 * sessionChoose:headerType,0为json，1为x-www-form-urlencoded
 * data:传输的数据
 * method:'POST'/'GET'，0为POST,1为GET
 * callBack:回调函数,传入的参数格式为function(res)
 */
function httpRequest(loading, url, sessionChoose, params, method, callBack_success) {
  var headerType = [{
    'content-type': 'application/json'
  }, {
    'content-type': 'application/x-www-form-urlencoded'
  }]
  var methodType = ['POST', 'GET']
  if (loading == true) {
    wx.showToast({
      title: '数据加载中',
      icon: 'loading'
    })
  }
  wx.request({
    url: baseUrl + url,
    data: Object.assign(params, {
      token: wx.getStorageSync('token')
    }),
    dataType: "json",
    header: headerType[sessionChoose],
    method: methodType[method],
    success: function (res) {
      //console.log(typeof(res))
      if (res == false) { //token过期，重新获得新的token
        console.log("此次网络请求中token已过期，现重新获得token")
        wx.login({
          success: res => {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            if (res.code) {
              //发起网络请求
              httpRequest(false, 'user/get_openid_session_key', 0, {
                code: res.code
              }, 0, function (res) {
                //console.log('token:' + res)
                //console.log(typeof (res)
                try {
                  wx.setStorageSync("token", res.token)
                } catch (e) {
                  console.log("存储token数据出错")
                }
                console.log('重新获得token成功')
              })
            }
            httpRequest(loading, url, sessionChoose, params, method, callBack_success); //再次进行请求
          }
        })
      } else callBack_success(res.data);
      //console.log('调用/utils/util.js/httpRequest函数成功')
    },
    fail: function (res) {
      console.log(res);
      wx.showModal({
        title: '提示',
        content: '请求失败！由于网络请求时间过长或网络无法连接的原因，请确认网络畅通，点击"重新请求"进行再次请求！',
        confirmText: "重新请求",
        success: function (res) {
          if (res.confirm) {
            httpRequest(loading, url, sessionChoose, params, method, callBack_success); //再次进行请求
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        }
      })
    },
    complete: function () {
      if (loading == true) {
        wx.hideToast(); //隐藏提示框
      }
    }
  })
}

function httpToChain(params, callBack_success) {
  var headerType = [{
    'content-type': 'application/json'
  }, {
    'content-type': 'application/x-www-form-urlencoded'
  }]
  var methodType = ['POST', 'GET']
  wx.showToast({
    title: '数据加载中',
    icon: 'loading'
  })
  wx.request({
    url: 'https://frontjhw.jhw66.cn/WeBASE-Front/trans/handleWithSign',
    data: params,
    dataType: "json",
    header: headerType[0],
    method: methodType[0],
    success: function (res) {
      //console.log(typeof(res))
      callBack_success(res.data);
      //console.log('调用/utils/util.js/httpRequest函数成功')
    },
    fail: function (res) {
      console.log(res);
      wx.showModal({
        title: '提示',
        content: '请求失败！由于网络请求时间过长或网络无法连接的原因，请确认网络畅通，点击"重新请求"进行再次请求！',
        confirmText: "重新请求",
        success: function (res) {
          if (res.confirm) {
            httpToChain(params, callBack_success); //再次进行请求
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        }
      })
    },
    complete: function () {
      // wx.hideToast(); //隐藏提示框
    }
  })
}


function checkToken(that) {
  console.log('checkToken函数执行')
  var haveToken = wx.getStorageSync('token') || []
  // 向链上查询用户是否注册的参数对象
  var obj = {
    "groupId" :5,
    "signUserId": "fee97843cf0c45d683bade8fdebe724f",
    "contractAbi":[{"constant":true,"inputs":[{"name":"_userid","type":"string"}],"name":"isUserActivated","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_userid","type":"string"}],"name":"getUserType","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_userid","type":"string"},{"name":"_integral","type":"uint256"},{"name":"_opcode","type":"int8"}],"name":"updateUserIntegral","outputs":[{"name":"","type":"int8"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_userid","type":"string"},{"name":"_username","type":"string"},{"name":"_userpassword","type":"string"},{"name":"_usertype","type":"string"}],"name":"activateUser","outputs":[{"name":"","type":"int8"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_fields","type":"string[]"},{"name":"index","type":"uint256"},{"name":"values","type":"string"}],"name":"getChangeFieldsString","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_userid","type":"string"},{"name":"_userpassword","type":"string"}],"name":"Login","outputs":[{"name":"","type":"int8"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_userid","type":"string"}],"name":"getUserCreditNum","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"userid","type":"string"}],"name":"getUserRecordArray","outputs":[{"name":"","type":"int8"},{"name":"","type":"string[]"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"userid","type":"string"},{"indexed":false,"name":"usertype","type":"string"},{"indexed":false,"name":"activatetime","type":"string"}],"name":"REGISTER_USER_EVENT","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"user_id","type":"string"},{"indexed":false,"name":"grade","type":"string"},{"indexed":false,"name":"time","type":"string"}],"name":"DEL_CREDITPOINT_EVENT","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"user_id","type":"string"},{"indexed":false,"name":"grade","type":"string"},{"indexed":false,"name":"time","type":"string"}],"name":"ADD_CREDITPOINT_EVENT","type":"event"}],
    "contractAddress":"0xaa2d2ae8c0be3c025ec87233eb68d7f7a9ad8012",
    "funcName":"isUserActivated",
    "funcParam":["1611541715"],
    "useCns":false
}
  // 向链上查询用户信用值的参数对象
  var objToGetCredit = {
    "groupId" :5,
    "signUserId": "fee97843cf0c45d683bade8fdebe724f",
    "contractAbi":[{"constant":true,"inputs":[{"name":"_userid","type":"string"}],"name":"isUserActivated","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_userid","type":"string"}],"name":"getUserType","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_userid","type":"string"},{"name":"_integral","type":"uint256"},{"name":"_opcode","type":"int8"}],"name":"updateUserIntegral","outputs":[{"name":"","type":"int8"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_userid","type":"string"},{"name":"_username","type":"string"},{"name":"_userpassword","type":"string"},{"name":"_usertype","type":"string"}],"name":"activateUser","outputs":[{"name":"","type":"int8"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_fields","type":"string[]"},{"name":"index","type":"uint256"},{"name":"values","type":"string"}],"name":"getChangeFieldsString","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_userid","type":"string"},{"name":"_userpassword","type":"string"}],"name":"Login","outputs":[{"name":"","type":"int8"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_userid","type":"string"}],"name":"getUserCreditNum","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"userid","type":"string"}],"name":"getUserRecordArray","outputs":[{"name":"","type":"int8"},{"name":"","type":"string[]"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"userid","type":"string"},{"indexed":false,"name":"usertype","type":"string"},{"indexed":false,"name":"activatetime","type":"string"}],"name":"REGISTER_USER_EVENT","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"user_id","type":"string"},{"indexed":false,"name":"grade","type":"string"},{"indexed":false,"name":"time","type":"string"}],"name":"DEL_CREDITPOINT_EVENT","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"user_id","type":"string"},{"indexed":false,"name":"grade","type":"string"},{"indexed":false,"name":"time","type":"string"}],"name":"ADD_CREDITPOINT_EVENT","type":"event"}],
    "contractAddress":"0xaa2d2ae8c0be3c025ec87233eb68d7f7a9ad8012",
    "funcName":"getUserCreditNum",
    "funcParam":[],
    "useCns":false
  }
  if (haveToken == '') { //本地没有存储token
    console.log("本地没有存储token,将调用wx.login")
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code.length >= 0) {
          httpRequest(false, 'user/get_openid_session_key', 0, {
            code: res.code
          }, 0, function (res) {
            console.log("res:")
            console.log(res)
            obj.funcParam[0] = res.idNumber
            httpToChain(obj, function (res) {
              console.log(res)
              that.globalData.registeredStatus = res[0]?true:false
              console.log('用户是否注册：')
              console.log(that.globalData.registeredStatus)
            })
            objToGetCredit.funcParam[0] = res.idNumber
            httpToChain(objToGetCredit, function (res) {
              console.log(res)
              console.log(typeof(res))
              that.globalData.creditPoint = res[0] > 2000000 ?0:res[0]
              console.log('用户信用值：')
              console.log(that.globalData.creditPoint)
            })
            try {
              that.globalData.token = res.token
              that.globalData.userId = res.userId
              that.globalData.idNumber = res.idNumber
              /* app.globalData.registeredStatus = res.registeredStatus
              app.globalData.creditPoint = res.creditPoint */
              that.globalData.addressToCopy = res.addressToCopy
              that.globalData.publicKeyToCopy = res.publicKeyToCopy
              that.globalData.privateKeyToCopy = res.privateKeyToCopy
              // that.globalData.hadApply = res.hadApply
              that.globalData.userType = res.userType
              wx.setStorageSync("token", res.token)
              console.log("存储token数据成功")
            } catch (e) {
              console.log(e)
              console.log("存储token数据出错")
            }
          })
        }
      }
    })
  } else { //本地存储token了
    console.log('本地存储token了')
    httpRequest(false, 'user/check_token', 0, {}, 0, function (res) {
      console.log("本地存储token了:", res)
      //const app = getApp()
      obj.funcParam[0] = res.idNumber
      httpToChain(obj, function (res) {
        console.log("是否注册")
        console.log(res)
        that.globalData.registeredStatus = res[0]?true:false
      })
      objToGetCredit.funcParam[0] = res.idNumber
      console.log("idNumber：")
      console.log(res.idNumber)
      httpToChain(objToGetCredit, function (res) {
        console.log("当前信用值")
        console.log(res)
        that.globalData.creditPoint = res[0] > 2000000 ?0:res[0]
      })
      if (res.tokenActivate == "true") {
        that.globalData.idNumber = res.idNumber
        that.globalData.userId = res.userId
        /* app.globalData.registeredStatus = res.registeredStatus
        app.globalData.creditPoint = res.creditPoint */
        that.globalData.addressToCopy = res.addressToCopy
        that.globalData.publicKeyToCopy = res.publicKeyToCopy
        that.globalData.privateKeyToCopy = res.privateKeyToCopy
        // that.globalData.hadApply = res.hadApply
        that.globalData.userType = res.userType
        //console.log("app11: ", app)
        console.log("token没过期")
      } else {
        console.log("token已过期")
        wx.showLoading({
          title: '加载中',
        })
        wx.login({
          success: res => {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            if (res.code) {
              //发起网络请求
              httpRequest(false, 'user/get_openid_session_key', 0, {
                code: res.code
              }, 0, function (res) {
                obj.funcParam[0] = res.idNumber
                httpToChain(obj, function (res) {
                  console.log(res)
                  that.globalData.registeredStatus = res[0]?true:false
                
                })
                objToGetCredit.funcParam[0] = res.idNumber
                httpToChain(objToGetCredit, function (res) {
                  console.log(res)
                  console.log(typeof(res))
                  that.globalData.creditPoint = res[0] > 2000000 ?0:res[0]
                })
                try {
                  that.globalData.idNumber = res.idNumber
                  that.globalData.token = res.token
                  that.globalData.userId = res.userId
                  /* app.globalData.registeredStatus = res.registeredStatus
                  app.globalData.creditPoint = res.creditPoint */
                  that.globalData.addressToCopy = res.addressToCopy
                  that.globalData.publicKeyToCopy = res.publicKeyToCopy
                  that.globalData.privateKeyToCopy = res.privateKeyToCopy
                  // that.globalData.hadApply = res.hadApply
                  that.globalData.userType = res.userType
                  //console.log("app: ", app)
                  wx.setStorageSync("token", res.token)
                  //wx.setStorageSync( "token",res.token)
                } catch (e) {
                  console.log("存储token数据出错")
                }
                console.log('重新获得token成功')
              })
            }
          }
        })
        wx.hideLoading()
      }
    })
  }
}

function qiniuFileUpload(tempFilePath, callBack_success = function () {
  console.log('匿名函数作为参数')
}) {
  var qiniuUploader = require('qiniuUploader.js')
  // 交给七牛上传
  qiniuUploader.upload(tempFilePath, (res) => {
    // 每个文件上传成功后,处理相关的事情
    // 其中 info 是文件上传成功后，服务端返回的json，形式如
    // {
    //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
    //    "key": "gogopher.jpg"
    //  }
    // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html
    console.log("上传图片成功返回的res||")
    console.log('file url is: ', res.fileUrl); //res.fileUrl为上传图片返回的url
    callBack_success(res.fileUrl)
    return res.fileUrl
  }, (error) => {
    console.log('error: ' + error);
  }, {
    region: 'SCN',
    domain: 'onestopimages.luckydraw.net.cn', // // bucket 域名，下载资源时用到。如果设置，会在 success callback 的 res 参数加上可以直接使用的 ImageURL 字段。否则需要自己拼接 'q15nuskn6.bkt.clouddn.com'为测试域名 
    //key: '', // [非必须]自定义文件 key。如果不设置，默认为使用微信小程序 API 的临时文件名
    // 以下方法三选一即可，优先级为：uptoken > uptokenURL > uptokenFunc
    //uptoken: app.globalData.qiniuToken, // 由其他程序生成七牛 uptoken
    uptokenURL: baseUrl + 'user/return_qiniu_upload_token', // 从指定 url 通过 HTTP GET 获取 uptoken，返回的格式必须是 json 且包含 uptoken 字段，例如： {"uptoken": "[yourTokenString]"}
    //uptokenFunc: function () { return '[yourTokenString]'; }
  }, (res) => {
    //console.log('上传进度', res.progress)
    //console.log('已经上传的数据长度', res.totalBytesSent)
    //console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
  }, () => {
    // 取消上传
  }, () => {
    // `before` 上传前执行的操作
  }, (err) => {
    // `complete` 上传接受后执行的操作(无论成功还是失败都执行)
  });
  // domain 为七牛空间（bucket)对应的域名，选择某个空间后，可通过"空间设置->基本设置->域名设置"查看获取
  // key：通过微信小程序 Api 获得的图片文件的 URL 已经是处理过的临时地址，可以作为唯一文件 key 来使用。
}

