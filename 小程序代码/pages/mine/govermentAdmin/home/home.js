// pages/mine/govermentAdmin/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    adminTypeList: [],
    identity: null,
    memberId: null,
    departmentId: null,
    departmentName: null,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptDataFromPrePage', (data) => {
      console.log('新一页的data')
      console.log(data)
      that.setData({
        identity: data.identity,
        memberId: data.memberId,
        departmentId: data.departmentId,
        departmentName: data.departmentName,
        adminTypeList: data.adminTypeList,
      })
    })
  },

  toAddFile: function(e){
    var that = this
    var obj = {}
    console.log(that.data)
    obj.departmentId = that.data.departmentId
    obj.memberId = that.data.memberId
    wx.navigateTo({
      url: '/pages/mine/govermentAdmin/addFile/addFile',
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

  toCheckFileHistory: function(e){
    var that = this
    var obj = {}
    obj.departmentId = that.data.departmentId
    obj.memberId = that.data.memberId
    wx.navigateTo({
      url: '/pages/mine/govermentAdmin/checkFileHistory/checkFileHistory',
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
  
  toSearchUserTrack: function(e){
    var that = this
    var obj = {}
    obj.departmentId = that.data.departmentId
    obj.memberId = that.data.memberId
    wx.navigateTo({
      url: '/pages/mine/govermentAdmin/searchUserTrack/searchUserTrack',
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

  toInfoDisclosure: function(e){
    var that = this
    var obj = {}
    obj.departmentId = that.data.departmentId
    obj.memberId = that.data.memberId
    wx.navigateTo({
      url: '/pages/mine/govermentAdmin/infoDisclosure/infoDisclosure',
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

  toBossCheckList: function(e){
    var that = this
    var obj = {}
    obj.identity = that.data.identity
    obj.departmentId = that.data.departmentId
    obj.memberId = that.data.memberId

    wx.navigateTo({
      url: '/pages/mine/govermentAdmin/bossCheckList/bossCheckList',
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

  toCheckerList: function(e){
    var that = this
    var obj = {}
    obj.identity = that.data.identity
    obj.departmentId = that.data.departmentId
    obj.memberId = that.data.memberId

    wx.navigateTo({
      url: '/pages/mine/govermentAdmin/checkerList/checkerList',
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
})