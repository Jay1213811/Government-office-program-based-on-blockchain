// pages/informationDisclosure/home/home.js
const app = getApp()
const http = require('../../../utils/http.js')
const util = require('../../../utils/util.js')
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
    userType: app.globalData.userType?-1:app.globalData.userType,
    isLogin: app.globalData.isLogin,
    /* currentPage: 1,
    informationDisclosureList: [],
    userTypeList: [] */
    dataLinkArray: [],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /* getInformationDisclosure: function(){
      var that = this
      var currentPage = that.data.currentPage
      var informationDisclosureList = that.data.informationDisclosureList
      console.log("触底触发函数执行")
      http.httpRequest(false, 'user/returnInformationDisclosure', 0, {'userType': app.globalData.userType,'currentPage': currentPage}, 0, function (res) {
        console.log(res)
        if(res.informationDisclosureList.length != 0) currentPage++
        that.setData({
          currentPage: currentPage,
          informationDisclosureList: informationDisclosureList.concat(res.informationDisclosureList),
        })
      })
    },
    toInfoDisclosure: function (e) {
      var that = this
      var index = e.currentTarget.dataset.index
      console.log("index:")
      console.log(index)
      var obj = {
        "id": that.data.informationDisclosureList[index].id,
        "userWxName": that.data.informationDisclosureList[index].userWxName,
        "userIdNumber": that.data.informationDisclosureList[index].userIdNumber,
        "userAvatar": that.data.informationDisclosureList[index].userAvatar,
        "userType": that.data.informationDisclosureList[index].userType,
        "address": that.data.informationDisclosureList[index].address,
        "publicKey": that.data.informationDisclosureList[index].publicKey,
        "privateKey": that.data.informationDisclosureList[index].privateKey,
        'userTypeList': that.data.userTypeList,
      }
      wx.navigateTo({
        url: '/pages/informationDisclosure/infoDisclosureDetails/infoDisclosureDetails',
        events: {
          // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
          acceptDataFromPrePage: function(data) {
            console.log("前一页的事件执行")
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
    }, */
    showPhoto: function(e){
      var that = this
      var index = e.currentTarget.dataset.index
      console.log('index')
      console.log(index)
      var link = that.data.dataLinkArray[index].link
      if( link != null){
        if(that.data.dataLinkArray[index].hadCheck == false){
          var objToChain = {
            "groupId" :5,
            "signUserId": "fee97843cf0c45d683bade8fdebe724f",
            "contractAbi":[{"constant":true,"inputs":[{"name":"_applicationid","type":"string"}],"name":"getDocumentJson","outputs":[{"name":"","type":"int8"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_leaderid","type":"string"},{"name":"_usertype","type":"string"},{"name":"_datatype","type":"string"}],"name":"SetLogForDatePublic","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_documentid","type":"string"}],"name":"getDownloadsNum","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_applicationid","type":"string"}],"name":"getDocumentArray","outputs":[{"name":"","type":"int8"},{"name":"","type":"string[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_fields","type":"string[]"},{"name":"index","type":"uint256"},{"name":"values","type":"string"}],"name":"getChangeFieldsString","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"downloadsid","type":"string"},{"name":"_documentid","type":"string"}],"name":"UpdateDownloadsNum","outputs":[{"name":"","type":"int8"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_applicationid","type":"string"},{"name":"_fields","type":"string"}],"name":"PublicDocument","outputs":[{"name":"","type":"int8"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_downloadsid","type":"string"},{"name":"_datatype","type":"string"}],"name":"SetLogForDateDownload","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"downloadid","type":"string"},{"indexed":false,"name":"applicationid","type":"string"},{"indexed":false,"name":"date","type":"string"},{"indexed":false,"name":"downloadsnum","type":"string"}],"name":"DownLoads_Document_EVENT","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"downloadid","type":"string"},{"indexed":false,"name":"_datatype","type":"string"},{"indexed":false,"name":"date","type":"string"}],"name":"DateLog_Track_Event","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"leaderid","type":"string"},{"indexed":false,"name":"usertype","type":"string"},{"indexed":false,"name":"datetype","type":"string"},{"indexed":false,"name":"date","type":"string"}],"name":"Track_DatePublish","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"applicationid","type":"string"},{"indexed":false,"name":"fields","type":"string"}],"name":"Public_Document","type":"event"}],
            "contractAddress":"0x4ff98862186ada02effaba06bdc891cb9b037c01",
             "funcName":"SetLogForDateDownload",
            "funcParam":[app.globalData.idNumber,that.data.dataLinkArray[index].name],
            "useCns":false
          }
          http.httpToChain(objToChain, function(res){
            console.log(res)
            if(res.message) console.log('上传成功')
          })
        }
        wx.previewImage({
          current: link, // 当前显示图片的http链接
          urls: [link] // 需要预览的图片http链接列表
        })
      } 
    }
  },
  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
      var that = this
      if(!app.globalData.isLogin){
        util.reminderRegister()
        return
      }
      that.setData({
        userType: app.globalData.userType?-1:app.globalData.userType,
        isLogin: app.globalData.isLogin
      })
      http.httpRequest(false, 'user/returnDataDisclosure', 0, {}, 0, function (res) {
        console.log(res.dataLinkArray)
        that.setData({
          dataLinkArray: res.dataLinkArray
        })
      })
      /* that.setData({
        userType: app.globalData.userType?-1:app.globalData.userType,
        isLogin: app.globalData.isLogin
      })
      console.log("组件初始化")
      console.log(app.globalData.userType)
      http.httpRequest(false, 'user/returnInformationDisclosure', 0, {'userType': app.globalData.userType,'currentPage': 1}, 0, function (res) {
        console.log(res)
        if(res.informationDisclosureList.length!=0){
          that.setData({
            currentPage: that.data.currentPage + 1,
            informationDisclosureList: res.informationDisclosureList,
            userTypeList: res.userTypeList
          })
        }
      }) */
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
})
