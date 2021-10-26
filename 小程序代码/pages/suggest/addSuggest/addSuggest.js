// pages/suggest/addSuggest/addSuggest.js
const app = getApp()
const http = require('../../../utils/http.js')
const util = require('../../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    suggestTitle: '',
    suggestContent: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  getSuggestTitle(e) {
    this.setData({
      suggestTitle: e.detail.value,
    })
  },

  getSuggestContent(e) {
    this.setData({
      suggestContent: e.detail.value,
    })
  },

  postSuggest(e) {
    var that = this
    if(!app.globalData.isLogin){
      util.reminderRegister()
      return
    }
    console.log(that.data.suggestTitle)
    console.log(that.data.suggestContent)
    if (that.data.suggestTitle == '' || that.data.suggestContent == '') {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请补充完整数据',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    } else {
      http.httpRequest(false, 'user/addSuggest', 0, {
        id: app.globalData.userId,
        suggestTitle: that.data.suggestTitle,
        suggestContent: that.data.suggestContent
      }, 0, function (res) {
        if (res == 'success') {
          that.setData({
            suggestTitle: '',
            suggestContent: '',
          })
          wx.showToast({
            title: '提交成功',
            duration: 2000,
            icon: 'success'
          })
        }
      })
    }
  },

  resetSuggest(e) {
    this.setData({
      suggestTitle: '',
      suggestContent: '',
    })
  },
})