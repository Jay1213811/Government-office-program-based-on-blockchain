// pages/resourceView/home/home.js
const http = require('../../../utils/http.js')
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
    officeFileList:[],
    currentPage: 1
  },

  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
      var that = this
      http.httpRequest(false, 'user/postPublicityList', 0, {
        currentPage: that.data.currentPage,
        workingStatus: true
      }, 0, function (res) {
        var currentPage = that.data.currentPage
        var officeFileList = that.data.officeFileList
        if (res.officeFileList.length != 0) currentPage++
        console.log(res.officeFileList)
        that.setData({
          officeFileList: officeFileList.concat(res.officeFileList),
          currentPage: currentPage,
        })
      })
      /* var that = this
      var currentPage = that.data.currentPage
      var dataList = that.data.dataList
      http.httpRequest(false, 'user/returnResourceList', 0, {'currentPage': currentPage}, 0, function (res) {
        if(res.dataList.length != 0) currentPage++
        that.setData({
          currentPage: currentPage,
          dataList: dataList.concat(res.dataList)
        })
      }) */
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toFileInfo: function (e) {
      var that = this
      var index = e.currentTarget.dataset.index
      var obj = {
        "title": that.data.officeFileList[index].title,
        "introduction": that.data.officeFileList[index].introduction,
        "informationLink": that.data.officeFileList[index].informationLink,
        "fileId": that.data.officeFileList[index].fileId,
      }
      wx.navigateTo({
        url: '/pages/resourceView/resourceInfo/resourceInfo',
        events: {
          // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
          acceptDataFromPrePage: function (data) {
            console.log("前一页的事件执行")
            console.log(data)
          },
        },
        success: function (res) {
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('acceptDataFromPrePage', obj)
        },
        fail: function (res) {
          console.log(res)
        }
      })
    },
    /* toResourceInfo: function (e) {
      var that = this
      var index = e.currentTarget.dataset.index
      console.log("index:")
      console.log(index)
      var obj = {
        "id": that.data.dataList[index].id,
        "userId": that.data.dataList[index].userId,
        "title": that.data.dataList[index].title,
        "introduction": that.data.dataList[index].introduction,
        "dataLink": that.data.dataList[index].dataLink,
        "downloadNum": that.data.dataList[index].downloadNum,
        "dataValue": that.data.dataList[index].dataValue,
        "uploadTime": that.data.dataList[index].uploadTime,
        "dataHash": that.data.dataList[index].dataHash,
        "dataId": that.data.dataList[index].id,
      }
      wx.navigateTo({
        url: '/pages/resourceView/resourceInfo/resourceInfo',
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
    },*/
    getFiles:function(){
       var that = this
       console.log("触底函数执行")
      http.httpRequest(false, 'user/postPublicityList', 0, {
        currentPage: that.data.currentPage,
        workingStatus: true
      }, 0, function (res) {
        var currentPage = that.data.currentPage
        var officeFileList = that.data.officeFileList
        if (res.officeFileList.length != 0) currentPage++
        console.log(res.officeFileList)
        that.setData({
          officeFileList: officeFileList.concat(res.officeFileList),
          currentPage: currentPage,
        })
      })
    } 
  }
})
