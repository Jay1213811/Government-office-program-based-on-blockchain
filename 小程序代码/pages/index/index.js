//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    PageCur: 'suggest'
  },
  NavChange(e) {
    var cur = e.currentTarget.dataset.cur
    var title = ''
    if(cur == 'suggest') title = '政务通'
    if(cur == 'resourceView') title = '政务公开'
    // if(cur == 'postAction') title = '发布上传'
    if(cur == 'informationDisclosure') title = '政府数据开放'
    if(cur == 'mine') title = '个人中心'
    wx.setNavigationBarTitle({
      title: title   
    }) 
    this.setData({
      PageCur: cur
    })
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '政务通'
    }) 
  },
  /*data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }*/
})
