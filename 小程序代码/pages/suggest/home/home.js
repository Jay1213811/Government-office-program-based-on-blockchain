// pages/suggest/home/home.js
const http = require('../../../utils/http.js')
const util = require('../../../utils/util.js')
const app = getApp()
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
    currentPage: 1,
    swiperList: [{
      id: 0,
      type: 'image',
      url: 'https://onestopimages.luckydraw.net.cn/%E6%AF%95%E4%B8%9A%E8%AE%BE%E8%AE%A11.png'
    }, {
      id: 1,
        type: 'image',
        url: 'https://onestopimages.luckydraw.net.cn/%E6%AF%95%E4%B8%9A%E8%AE%BE%E8%AE%A12.png',
    }, {
      id: 2,
      type: 'image',
      url: 'https://onestopimages.luckydraw.net.cn/%E6%AF%95%E4%B8%9A%E8%AE%BE%E8%AE%A13.png'
    }, {
      id: 3,
      type: 'image',
      url: 'https://onestopimages.luckydraw.net.cn/%E6%AF%95%E4%B8%9A%E8%AE%BE%E8%AE%A14.png'
    }],
    suggestList:[]
  },

  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
      var that = this
      var currentPage = that.data.currentPage
      http.httpRequest(false, 'user/returnSuggestList', 0, {'currentPage': currentPage}, 0, function (res) {
        console.log(res)
        if(res.suggestList.length != 0) currentPage++
        that.setData({
          currentPage: currentPage,
          suggestList: res.suggestList
        })
      })
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getSuggest: function(){
      var that = this
      var currentPage = that.data.currentPage
      var suggestList = that.data.suggestList
      console.log("触底触发函数执行")
      http.httpRequest(false, 'user/returnSuggestList', 0, {'currentPage': currentPage}, 0, function (res) {
        console.log(res)
        if(res.suggestList.length != 0) currentPage++
        that.setData({
          currentPage: currentPage,
          suggestList: suggestList.concat(res.suggestList)
        })
      })
    },
    toSuggestInfo: function (e) {
      var that = this
      var index = e.currentTarget.dataset.index
      console.log("index:")
      console.log(index)
      var obj = {
        "id": that.data.suggestList[index].id,
        "userId": that.data.suggestList[index].userId,
        "title": that.data.suggestList[index].title,
        "content": that.data.suggestList[index].content,
        "isCompliance": that.data.suggestList[index].isCompliance,
        'suggestTime': that.data.suggestList[index].suggestTime
      }
      wx.navigateTo({
        url: '/pages/suggest/suggestInfo/suggestInfo',
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
    },

    toPostAction: function(e){
      var that = this
      if(!app.globalData.isLogin){
        util.reminderRegister()
        return
      }
      wx.navigateTo({
        url: '/pages/suggest/addSuggest/addSuggest',
        events: {
          // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
          acceptDataFromPrePage: function(data) {
            console.log("前一页的事件执行")
            console.log(data)
          },
        },
        success: function(res) {
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('acceptDataFromPrePage', {})
        },
        fail: function(res){
          console.log(res)
        }
      })
    }
  }
})
