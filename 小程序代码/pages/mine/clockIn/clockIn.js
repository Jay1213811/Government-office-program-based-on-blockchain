// pages/mine/clockIn/clockIn.js
const qqMap = require('../../../utils/qqmap-wx-jssdk.js')
const http = require('../../../utils/http.js')
const qqmapsdk = new qqMap({
  key: 'LK5BZ-KPTWF-RFLJE-JSGQS-W3U3K-RKFOD'
});
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLocal: true,
    longitude: '',
    latitude: '',
    // qqmapsdk: null,
    localText: '未获得您的定位',
    canClockIn: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.getLocal();
  },

  getLocal: function () {
    let that = this;
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success: (res) => {
              that.showLocal();
              that.setData({
                isLocal: true
              })
            },
            fail: (err) => {
              wx.showModal({
                title: '温馨提示',
                content: '因您没有提供获取位置的权限，无法进行打卡',
                showCancel: false,
                success(res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
            }
          })
        } else {
          that.showLocal();
        }
      }
    })
  },
  showLocal: function () {
    var that = this;
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        let latitude = res.latitude
        let longitude = res.longitude
        that.setData({
          latitude,
          longitude
        })
        that.getMapCity(latitude, longitude)
      }
    })

  },



  handleSetting: function () {
    var that = this;
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.userLocation']) {
          console.log(1)
          wx.showModal({
            title: '提示',
            content: '不授权将无法获得位置',
            showCancel: false
          })
          that.setData({
            isLocal: false
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '位置授权成功',
            showCancel: false
          })
          that.setData({
            isLocal: true
          })
        }
      }
    })
  },

  getMapCity: function (latitude, longitude) {
    var that = this;
    wx.showLoading({
      title: '正在获取地址',
      mask: true
    })
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: function (res) {
        console.log(res)
        let province = res.result.ad_info.province;
        let city = res.result.ad_info.city;
        let localText = province + city + res.result.formatted_addresses.recommend
        that.setData({
          localText: localText,
          canClockIn: true
        })
        wx.hideLoading({
          success: (res) => {},
        })
      },
      fail: function (err) {
        console.log(err)
        console.log(err.message)
      }
    })
  },

  locationAuthorization: function(e){
    wx.showModal({
      title: '温馨提示',
      content: '请在授权页打开“使用我的地理位置”开关，然后退出当前页面后重新进入',
      showCancel: false,
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  postAddressOnChain: function(){ 
    var that = this
    if(!that.data.canClockIn){
      wx.showModal({
        title: '温馨提示',
        content: '未能获得您的定位，请点击“授权获得地址”按钮以获得定位',
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
    } else {
      const app = getApp()
      var date = new Date()
      var year = date.getFullYear() + '年'
      var month = date.getMonth() + 1 + '月'
      var day = date.getDate() + '日'
      var hour = date.getHours() + '点'
      var minute = date.getMinutes() + '分'
      var second = date.getSeconds() + '秒'
      var dateText = year + month + day + hour + minute + second
      var objToChain = {
        "groupId" :5,
        "signUserId": "fee97843cf0c45d683bade8fdebe724f",
        "contractAbi":[{"constant":true,"inputs":[{"name":"_userid","type":"string"}],"name":"getUserCityArray","outputs":[{"name":"","type":"int8"},{"name":"","type":"string[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_userid","type":"string"}],"name":"getUserCityJson","outputs":[{"name":"","type":"int8"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_fields","type":"string[]"},{"name":"index","type":"uint256"},{"name":"values","type":"string"}],"name":"getChangeFieldsString","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_userid","type":"string"},{"name":"_location","type":"string"},{"name":"_time","type":"string"}],"name":"ClockIn","outputs":[{"name":"","type":"int8"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"user_id","type":"string"},{"indexed":false,"name":"user_location","type":"string"},{"indexed":false,"name":"time","type":"string"}],"name":"TRACK_EVENT","type":"event"}],
        "contractAddress":"0x8546174c5fe38243e1dcfb65e1347919fe0f45ba",
         "funcName":"ClockIn",
        "funcParam":[app.globalData.idNumber,that.data.localText,dateText],
        "useCns":false
      }
      http.httpToChain(objToChain, function (res) {
        if(res.message == 'success' || res.message == 'Success'){
          wx.showToast({
            title: '打卡成功',
            icon: 'success',
            duration: 2000
          })
        }
      })
    }
  },
})