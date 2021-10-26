// pages/mine/govermentAdmin/infoDisclosure/infoDisclosure.js
const http = require('../../../../utils/http.js')
const util = require('../../../../utils/util.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list0: [],
    list1: [],
    checkboxGroup0: [], // 披露哪些信息
    checkboxGroup1: [], // 披露给谁
    originList0: [],
    originList1: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    http.httpRequest(false, 'user/returnDisclosureInfo', 0, {}, 0, function (res) {
      that.setData({
        list0: res.list0,
        list1: res.list1,
        originList0: res.list0,
        originList1: res.list1,
      })
    })
  },
  checkboxChange0(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    this.setData({
      checkboxGroup0: e.detail.value
    })
  },

  checkboxChange1(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    this.setData({
      checkboxGroup1: e.detail.value
    })
  },

  postInfo(e) {
    var that = this
    if (!app.globalData.isLogin) {
      util.reminderRegister()
      return
    }
    if(that.data.checkboxGroup0.length == 0 || that.data.checkboxGroup1.length == 0){
      wx.showModal({
        title: '温馨提示',
        content: '披露数据和披露对象不能为空',
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
    }
    http.httpRequest(false, 'user/setDisclosureObject', 0, {
      'infoList': that.data.checkboxGroup0,
      'targetList': that.data.checkboxGroup1
    }, 0, function (res) {
      if (res == 'success') {
        wx.showToast({
          title: '提交成功',
          duration: 2000,
          icon: 'success'
        })
        that.setData({
          checkboxGroup0: [],
          checkboxGroup1: [],
          list0: that.data.originList0,
          list1: that.data.originList1,
        })
      }
    })
  },

  resetInfo(e) {
    this.setData({
      checkboxGroup0: [],
      checkboxGroup1: [],
      list0: that.data.originList0,
      list1: that.data.originList1,
    })
  }
})