// pages/mine/home/home.js
const app = getApp()
const http = require('../../../utils/http.js')
const util = require('../../../utils/util.js')
const sha256 = require("../../../utils/sha256.js");

Component({
  /**
   * 组件的属性列表
   */
  options: {
    addGlobalClass: true,
  },
  properties: {
  },

  /**
   * 组件的初始数据
   */
  data: {
    userAvatar: "",
    userNickName: "",
    idNumber: '',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userTypeList: [],
    userType: 0,
    userTypeText: '',
    haveInfo: false,
    showDialog: false,
    showDialog2: false,
    showDialog3: false,

    // 部分一的变量
    creditPoint: '',
    addressToCopy: '',
    publicKeyToCopy: '',
    privateKeyToCopy: '',
    registeredStatus: false, //注册状态
    isLogin: false,
    loginText: '数字指纹上链（注册）',

    //部分二的有关变量
    password: '', // 注册密码
    passwordToCheck: '', // 确认注册密码
    adminAccount: '', // 审核员账号
    adminPassword: '', // 审核员密码
    toAdminPageStatus: 0, // 根据管理员密码不同跳转不同页面的标记

  },
  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
      var that = this
      that.setData({
        addressToCopy: app.globalData.addressToCopy,
        publicKeyToCopy: app.globalData.publicKeyToCopy,
        privateKeyToCopy: app.globalData.privateKeyToCopy,
      })
      var objToGetCredit = {
        "groupId" :5,
        "signUserId": "fee97843cf0c45d683bade8fdebe724f",
        "contractAbi":[{"constant":true,"inputs":[{"name":"_userid","type":"string"}],"name":"isUserActivated","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_userid","type":"string"}],"name":"getUserType","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_userid","type":"string"},{"name":"_integral","type":"uint256"},{"name":"_opcode","type":"int8"}],"name":"updateUserIntegral","outputs":[{"name":"","type":"int8"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_userid","type":"string"},{"name":"_username","type":"string"},{"name":"_userpassword","type":"string"},{"name":"_usertype","type":"string"}],"name":"activateUser","outputs":[{"name":"","type":"int8"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_fields","type":"string[]"},{"name":"index","type":"uint256"},{"name":"values","type":"string"}],"name":"getChangeFieldsString","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_userid","type":"string"},{"name":"_userpassword","type":"string"}],"name":"Login","outputs":[{"name":"","type":"int8"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_userid","type":"string"}],"name":"getUserCreditNum","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"userid","type":"string"}],"name":"getUserRecordArray","outputs":[{"name":"","type":"int8"},{"name":"","type":"string[]"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"userid","type":"string"},{"indexed":false,"name":"usertype","type":"string"},{"indexed":false,"name":"activatetime","type":"string"}],"name":"REGISTER_USER_EVENT","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"user_id","type":"string"},{"indexed":false,"name":"grade","type":"string"},{"indexed":false,"name":"time","type":"string"}],"name":"DEL_CREDITPOINT_EVENT","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"user_id","type":"string"},{"indexed":false,"name":"grade","type":"string"},{"indexed":false,"name":"time","type":"string"}],"name":"ADD_CREDITPOINT_EVENT","type":"event"}],
        "contractAddress":"0xaa2d2ae8c0be3c025ec87233eb68d7f7a9ad8012",
        "funcName":"getUserCreditNum",
        "funcParam":[app.globalData.idNumber],
        "useCns":false
      }
      http.httpToChain(objToGetCredit, function (res) {
        console.log(res)
        that.setData({
          creditPoint: res[0] > 2000000 ?0:res[0]
        })
      })
      if(app.globalData.registeredStatus){
        if(app.globalData.isLogin){
          that.setData({
            loginText: '您已登录',
          })
        } else {
          that.setData({
            loginText: '确权（登录）'
          })
        }
      } else{
        that.setData({
          loginText: '数字指纹上链（注册）'
        })
      }
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      console.log("wx.getUserProfile")
      console.log(wx.getUserProfile)
      if (wx.getUserProfile) { //有权限
        wx.getUserProfile({
          desc: '用于完善用户资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
          success: (res) => {
            console.log(res)
            var userInfo = res.userInfo
            this.setData({
              userInfo: res.userInfo,
              hasUserInfo: true
            })
            http.httpRequest(false, 'user/getUserInfo', 0, {name: userInfo.nickName, avatarUrl: userInfo.avatarUrl, funType: 0}, 0, function (res) {
              console.log("res.userTypeList:")
              console.log(res.userTypeList)
              var userType = res.userType
              var userTypeText = res.userTypeList[res.userType]
              if(userType==null){
                userType = 0
                userTypeText = ''
              }
              console.log("获取用户头像和昵称成功")
              that.setData({
                userAvatar: userInfo.avatarUrl,
                userNickName: userInfo.nickName,
                userType: userType,
                userTypeList: res.userTypeList,
                userTypeText: userTypeText,
                haveInfo: true,
                idNumber: app.globalData.idNumber,
                registeredStatus: app.globalData.registeredStatus,
                isLogin: app.globalData.isLogin,
                addressToCopy: app.globalData.addressToCopy,
                publicKeyToCopy: app.globalData.publicKeyToCopy,
                privateKeyToCopy: app.globalData.privateKeyToCopy,
              })
            })
            console.log("用户点击按钮，获得微信用户信息")
          },
          fail(res){
            http.httpRequest(false, 'user/getUserInfo', 0, {funType: 1}, 0, function (res) {
              console.log("res.userType:")
              console.log(res.userType)
              var userType = res.userType
              var userTypeText = res.userTypeList[res.userType]
              if(userType==null){
                userType = 0
                userTypeText = ''
              }
              console.log("获取用户头像和昵称成功")
              that.setData({
                userAvatar: res.avatarUrl,
                userNickName: res.nickName,
                haveInfo: true,
                userType: userType,
                userTypeList: res.userTypeList,
                userTypeText: userTypeText,
                idNumber: app.globalData.idNumber,
                registeredStatus: app.globalData.registeredStatus,
                isLogin: app.globalData.isLogin,
                addressToCopy: app.globalData.addressToCopy,
                publicKeyToCopy: app.globalData.publicKeyToCopy,
                privateKeyToCopy: app.globalData.privateKeyToCopy,
              })
              wx.hideLoading({
                success: (res) => {},
              })
            })
          },
          complete(res) {
            wx.hideLoading({
              success: (res) => {},
            })
          }
        })
      }else{
        http.httpRequest(false, 'user/getUserInfo', 0, {funType: 1}, 0, function (res) {
          console.log("res.userType:")
          console.log(res.userType)
          var userType = res.userType
          var userTypeText = res.userTypeList[res.userType]
          if(userType==null){
            userType = 0
            userTypeText = ''
          }
          console.log("获取用户头像和昵称成功")
          that.setData({
            userType: userType,
            userTypeList: res.userTypeList,
            userTypeText: userTypeText,
            idNumber: app.globalData.idNumber,
            registeredStatus: app.globalData.registeredStatus,
            isLogin: app.globalData.isLogin,
            addressToCopy: app.globalData.addressToCopy,
            publicKeyToCopy: app.globalData.publicKeyToCopy,
            privateKeyToCopy: app.globalData.privateKeyToCopy,
          })
          wx.hideLoading({
            success: (res) => {},
          })
        })
      }
      /*
      wx.getSetting({
        success(res) {
          console.log(res.authSetting)
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称
            wx.getUserInfo({
              success: function (res) {
                var userInfo = res.userInfo
                http.httpRequest(false, 'user/getUserInfo', 0, {name: userInfo.nickName, avatarUrl: userInfo.avatarUrl, funType: 0}, 0, function (res) {
                  console.log("res.userTypeList:")
                  console.log(res.userTypeList)
                  var userType = res.userType
                  var userTypeText = res.userTypeList[res.userType]
                  if(userType==null){
                    userType = 0
                    userTypeText = ''
                  }
                  console.log("获取用户头像和昵称成功")
                  that.setData({
                    userAvatar: res.avatarUrl,
                    userNickName: res.nickName,
                    userType: userType,
                    userTypeList: res.userTypeList,
                    userTypeText: userTypeText,
                    haveInfo: true,
                    idNumber: app.globalData.idNumber,
                    registeredStatus: app.globalData.registeredStatus,
                    isLogin: app.globalData.isLogin,
                    addressToCopy: app.globalData.addressToCopy,
                    publicKeyToCopy: app.globalData.publicKeyToCopy,
                    privateKeyToCopy: app.globalData.privateKeyToCopy,
                  })
                })
                console.log(userInfo)
              },
            })
          }else{
            http.httpRequest(false, 'user/getUserInfo', 0, {funType: 1}, 0, function (res) {
              console.log("res.userType:")
              console.log(res.userType)
              var userType = res.userType
              var userTypeText = res.userTypeList[res.userType]
              if(userType==null){
                userType = 0
                userTypeText = ''
              }
              console.log("获取用户头像和昵称成功")
              that.setData({
                userType: userType,
                userTypeList: res.userTypeList,
                userTypeText: userTypeText,
                idNumber: app.globalData.idNumber,
                registeredStatus: app.globalData.registeredStatus,
                isLogin: app.globalData.isLogin,
                addressToCopy: app.globalData.addressToCopy,
                publicKeyToCopy: app.globalData.publicKeyToCopy,
                privateKeyToCopy: app.globalData.privateKeyToCopy,
              })
            })
          }
        },
        complete(res) {
          wx.hideLoading({
            success: (res) => {},
          })
        }
      })
    */
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindGetUserInfo: function (e) {
      // const app = getApp()
      var that = this
      wx.getUserProfile({
        desc: '用于完善用户资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          var userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          http.httpRequest(false, 'user/getUserInfo', 0, {name: userInfo.nickName, avatarUrl: userInfo.avatarUrl, funType: 0}, 0, function (res) {
            console.log(res)
            console.log("获取用户头像和昵称成功")
            that.setData({
              userAvatar: userInfo.avatarUrl,
              userNickName: userInfo.nickName,
              haveInfo: true,
              idNumber: app.globalData.idNumber,
            })
          })
          console.log("用户点击按钮，获得微信用户信息")
        },
        fail(res){
          console.log(res)
        }
      })
    },

    copyIdNumber: function(e){
      if(!app.globalData.isLogin){
        util.reminderRegister()
      }else{
        wx.setClipboardData({
          data: app.globalData.idNumber,
          success (res) {
            wx.getClipboardData({
              success (res) {
                wx.showToast({
                  title: '复制成功',
                  icon: 'success',
                  duration: 2000
                }) // data
              }
            })
          }, 
          fail(res){
            console.log(res)
          }
        })
      }
    },


    getAddress: function(e){
      var that = this
      if(!app.globalData.isLogin){
        util.reminderRegister()
      }else{
        wx.setClipboardData({
          data: app.globalData.addressToCopy,
          success (res) {
            wx.getClipboardData({
              success (res) {
                wx.showToast({
                  title: '复制成功',
                  icon: 'success',
                  duration: 2000
                }) // data
              }
            })
          }, 
          fail(res){
            console.log(res)
          }
        })
      }
    },

    getPublicKey: function(e){
      var that = this
      if(!app.globalData.isLogin){
        util.reminderRegister()
      }else{
        wx.setClipboardData({
          data: app.globalData.publicKeyToCopy,
          success (res) {
            wx.getClipboardData({
              success (res) {
                wx.showToast({
                  title: '复制成功',
                  icon: 'success',
                  duration: 2000
                }) // data
              }
            })
          }, 
          fail(res){
            console.log(res)
          }
        })
      }
    },

    getPrivateKey: function(e){
      var that = this
      if(!app.globalData.registeredStatus){
        util.reminderRegister()
      }else{
        wx.setClipboardData({
          data: app.globalData.privateKeyToCopy,
          success (res) {
            wx.getClipboardData({
              success (res) {
                wx.showToast({
                  title: '复制成功',
                  icon: 'success',
                  duration: 2000
                }) // data
              }
            })
          }, 
          fail(res){
            console.log(res)
          }
        })
      }
    },

    toCreditRecord: function(e){
      var that = this
      if(!app.globalData.isLogin){
        util.reminderRegister()
        return
      }
      wx.navigateTo({
        url: '/pages/mine/creditRecord/creditRecord',
        events: {
          // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
          acceptDataFromOpenedPage: function(data) {
            console.log(data)
          },
          someEvent: function(data) {
            console.log(data)
          }
        },
        success: function(res) {
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('acceptDataFromOpenerPage', { data: 'test' })
        }
      })
    },

    toApply: function(e){
      if(!app.globalData.isLogin){
        util.reminderRegister()
        return
      }
      var url = ''
      if(app.globalData.hadApply) url = '/pages/mine/applyInfo/applyInfo'
      else url = '/pages/mine/apply/apply'
      wx.navigateTo({
        url: url,
        events: {
          // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
          acceptDataFromPrePage: function(data) {
            console.log(data)
          },
        },
        success: function(res) {
          res.eventChannel.emit('acceptDataFromPrePage', {"pageStatus": 0})
          console.log(res)
        },
        fail: function(res){
          console.log(res)
        }
      })
    }, 

    toggleDialog2: function () {
      var that = this
      if(!app.globalData.isLogin){
        util.reminderRegister()
        return
      }
        this.setData({
          showDialog2: !this.data.showDialog2
        })
      
    },

    getAdminAccount: function(e) {
      this.setData({
        adminAccount: e.detail.value
      })
    },

    getAdminPassword: function(e) {
      this.setData({
        adminPassword: e.detail.value
      })
    },

    toCheckApply: function(e){
      var that = this
      var obj = {}
      console.log({account: that.data.adminAccount, password: that.data.adminPassword})
      if(that.data.adminAccount == '' || that.data.adminAccount == null || that.data.adminPassword == '' || that.data.adminPassword == null){
        wx.showModal({
          title: '提示',
          content: '账号和密码不能为空，请重新输入',
          showCancel: false,
          success (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            }
          }
        })
      }
      http.httpRequest(false, 'user/getAdminPassword', 0, {account: that.data.adminAccount, password: that.data.adminPassword}, 0, function (res) {
        if (res.status == "failed") {
          obj = {toAdminPageStatus: 0}
          wx.showModal({
            title: '提示',
            content: '密码错误，请重新输入',
            showCancel: false,
            success (res) {
              if (res.confirm) {
                console.log('用户点击确定')
                that.setData({
                  adminPassword: '',
                })
              }
            }
          })
        } else {
          that.setData({
            showDialog2: !that.data.showDialog2,
            adminAccount: '',
            adminPassword: '',
          })
          obj.identity = res.identity
          obj.memberId = res.id
          obj.departmentId = res.departmentId
          obj.departmentName = res.departmentName
          obj.adminTypeList = res.adminTypeList
          wx.navigateTo({
            url: '/pages/mine/govermentAdmin/home/home',
            events: {
              // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
              acceptDataFromPrePage: function(data) {
                console.log(data)
              },
            },
            success: function(res) {
              // 通过eventChannel向被打开页面传送数据
              res.eventChannel.emit('acceptDataFromPrePage', obj)
            },
            fail: function(res){
              console.log(res)
            }
          })
        }
        /* if (res.identity == "0") obj = {pageStatus: 0} //科员
        if (res.identity == "1") obj = {pageStatus: 1} //
        if (res.identity == "2") obj = {pageStatus: 2}
        if (res.identity == "3") obj = {pageStatus: 3}
        if (res.identity == "4") obj = {pageStatus: -1}
        console.log("obj.pageStatus:   ")
        console.log(obj.pageStatus)
        if(obj.pageStatus!=0){
          that.setData({
            showDialog2: !that.data.showDialog2,
            adminPassword: '',
          })
          if(obj.pageStatus==1 || obj.pageStatus == 2){
            wx.navigateTo({
              url: '/pages/mine/applyCheck/applyCheck',
              events: {
                // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
                acceptDataFromPrePage: function(data) {
                  console.log(data)
                },
              },
              success: function(res) {
                // 通过eventChannel向被打开页面传送数据
                res.eventChannel.emit('acceptDataFromPrePage', obj)
              },
              fail: function(res){
                console.log(res)
              }
            })
          }
            if(obj.pageStatus==3){
              obj = {pageStatus: 3, workingStatus: false}
              wx.navigateTo({
                url: '/pages/mine/publicity/publicity',
                events: {
                  // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
                  acceptDataFromPrePage: function(data) {
                    console.log(data)
                  },
                },
                success: function(res) {
                  // 通过eventChannel向被打开页面传送数据
                  res.eventChannel.emit('acceptDataFromPrePage', obj)
                },
                fail: function(res){
                  console.log(res)
                }
              })
            } 
            if(obj.pageStatus==-1){
              wx.navigateTo({
                url: '/pages/mine/setCity/setCity',
                events: {
                  // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
                  acceptDataFromPrePage: function(data) {
                    console.log(data)
                  },
                },
                success: function(res) {
                  // 通过eventChannel向被打开页面传送数据
                  //res.eventChannel.emit('acceptDataFromPrePage', obj)
                },
                fail: function(res){
                  console.log(res)
                }
              })
            } 
        }*/
      })
      
    }, 

    toClockIn: function(e){
      if(!app.globalData.isLogin){
        util.reminderRegister()
        return
      }
      wx.showModal({
        title: '温馨提示',
        content: '请确认已打开手机GPS定位，否则进入页面后无法获取您的定位',
        confirmText: '进入页面',
        success (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.navigateTo({
              url: '/pages/mine/clockIn/clockIn',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      
    },
    
    toShowUserTrack: function(e){
      if(!app.globalData.isLogin){
        util.reminderRegister()
        return
      }
      wx.navigateTo({
        url: '/pages/mine/showUserTrack/showUserTrack',
      })
    },

    toPublicity: function(e){
      var that = this
      if(!app.globalData.isLogin){
        util.reminderRegister()
        return
      }
      var obj = {workingStatus: true, pageStatus: 4}
      wx.navigateTo({
        url: '/pages/mine/publicity/publicity',
        events: {
          // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
          acceptDataFromPrePage: function(data) {
            console.log(data)
          },
        },
        success: function(res) {
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('acceptDataFromPrePage', obj)
        },
        fail: function(res){
          console.log(res)
        }
      })
    }, 

    toHealthCode: function(e){
      if(!app.globalData.isLogin){
        util.reminderRegister()
        return
      }
      wx.navigateTo({
        url: '/pages/mine/healthCode/healthCode',
      })
    },

    toInfoDisclosureRecord: function(e){
      if(!app.globalData.isLogin){
        util.reminderRegister()
        return
      }
      wx.navigateTo({
        url: '/pages/mine/infoDisclosureRecord/infoDisclosureRecord',
      })
    },

    toggleDialog: function () {
      var that = this
      var isLogin = that.data.isLogin
      if(isLogin){
        wx.showModal({
          title: '提示',
          content: '您已经登陆，无需重新登陆。',
          showCancel: false,
          success (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            }
          }
        })
      } else {
        if(!that.data.haveInfo){
          wx.showModal({
            title: '提示',
            content: '请先授权获得微信头像和昵称方可注册',
            showCancel: false,
            success (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              }
            }
          })
        } else {
          this.setData({
            showDialog: !this.data.showDialog
          })
        }
      }
    },

    getPassword: function(e){
      this.setData({
        password: e.detail.value
      })
    },

    getPasswordToCheck: function(e){
      this.setData({
        passwordToCheck: e.detail.value
      })
    },

    changeUserType(e) {
      console.log(e);
      this.setData({
        userType: e.detail.value
      })
    },

    checkPasswordAndPost: function(e){
      var that = this
      if(this.data.password.length < 6 || this.data.password.length>20){
        wx.showModal({
          title: '提示',
          content: '密码须为6~20位，请重新输入。',
          showCancel: false,
          success (res) {
            if (res.confirm) {
              console.log('用户点击确定')
              that.setData({
                password: '',
                passwordToCheck: ''
              })
            }
          }
        })
      } else{
          if(this.data.password == this.data.passwordToCheck){
          // var hash = sha256.sha256(app.globalData.idNumber + '' + that.data.password)
          // var hash = that.data.password
          http.httpRequest(false, 'user/setPassword', 0, {id: app.globalData.userId, password: that.data.password, userType: that.data.userType}, 0, function (res) {
            console.log(res)
            console.log(typeof(res))
            if(res){
              app.globalData.registeredStatus = true
              app.globalData.isLogin = true
              app.globalData.creditPoint = 100
              wx.showToast({
                title: '操作成功',
                icon: 'success',
                duration: 2000
              })
              that.setData({
                showDialog: !that.data.showDialog,
                registeredStatus: true,
                isLogin:true,
                creditPoint: 100,
                loginText: '您已登录',
                userTypeText: that.data.userTypeList[that.data.userType]
              })
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '您两次输入的密码不一致，请重新输入。',
            showCancel: false,
            success (res) {
              if (res.confirm) {
                console.log('用户点击确定')
                that.setData({
                  password: '',
                  passwordToCheck: ''
                })
              }
            }
          })
        }
      }
    },

    login: function(e){
      var that = this
      if(this.data.password.length < 6 || this.data.password.length>20){
        wx.showModal({
          title: '提示',
          content: '密码须为6~20位，请重新输入。',
          showCancel: false,
          success (res) {
            if (res.confirm) {
              console.log('用户点击确定')
              that.setData({
                password: '',
                passwordToCheck: ''
              })
            }
          }
        })
      } else{
        var objToLogin = {
          "groupId" :5,
          "signUserId": "fee97843cf0c45d683bade8fdebe724f",
          "contractAbi":[{"constant":true,"inputs":[{"name":"_userid","type":"string"}],"name":"isUserActivated","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_userid","type":"string"}],"name":"getUserType","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_userid","type":"string"},{"name":"_integral","type":"uint256"},{"name":"_opcode","type":"int8"}],"name":"updateUserIntegral","outputs":[{"name":"","type":"int8"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_userid","type":"string"},{"name":"_username","type":"string"},{"name":"_userpassword","type":"string"},{"name":"_usertype","type":"string"}],"name":"activateUser","outputs":[{"name":"","type":"int8"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_fields","type":"string[]"},{"name":"index","type":"uint256"},{"name":"values","type":"string"}],"name":"getChangeFieldsString","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_userid","type":"string"},{"name":"_userpassword","type":"string"}],"name":"Login","outputs":[{"name":"","type":"int8"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_userid","type":"string"}],"name":"getUserCreditNum","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"userid","type":"string"}],"name":"getUserRecordArray","outputs":[{"name":"","type":"int8"},{"name":"","type":"string[]"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"userid","type":"string"},{"indexed":false,"name":"usertype","type":"string"},{"indexed":false,"name":"activatetime","type":"string"}],"name":"REGISTER_USER_EVENT","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"user_id","type":"string"},{"indexed":false,"name":"grade","type":"string"},{"indexed":false,"name":"time","type":"string"}],"name":"DEL_CREDITPOINT_EVENT","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"user_id","type":"string"},{"indexed":false,"name":"grade","type":"string"},{"indexed":false,"name":"time","type":"string"}],"name":"ADD_CREDITPOINT_EVENT","type":"event"}],
          "contractAddress":"0xaa2d2ae8c0be3c025ec87233eb68d7f7a9ad8012",
          "funcName":"Login",
          "funcParam":[app.globalData.idNumber, that.data.password],
          "useCns":false
        }
        http.httpToChain(objToLogin, function (res) {
          console.log(res)
          console.log(res[0] == 1)
          if(res[0] == 1){
            wx.showToast({
              title: '登陆成功',
              icon: 'success',
              duration: 2000,
            })
            that.setData({
              showDialog: !that.data.showDialog,
              isLogin: true,
              loginText: '您已登录',
              userTypeText: that.data.userTypeList[that.data.userType]
            })
            app.globalData.isLogin = true
          } else {
            wx.showModal({
              title: '登录失败',
              content: '密码错误，请重新输入密码',
              showCancel: false,
              success (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                  that.setData({
                    password: ''
                  })
                }
              }
            })
          }
        })
      }
    },



    toggleDialog3: function () {
      var that = this
      if(!app.globalData.isLogin){
        util.reminderRegister()
        return
      }
        this.setData({
          showDialog3: !this.data.showDialog3
        })
    },
  },
})
