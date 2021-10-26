// pages/mine/govermentAdmin/searchUserTrack/searchUserTrack.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchValue: '',
    trackList: [],
    hadSearch: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  getSearchValue: function(e){
    var that = this
    that.setData({
      searchValue: e.detail.value
    })
  },

  search: function(){
    var that = this
    var searchValue = ''
    if(that.data.searchValue == '') searchValue = '1611628666'
    else searchValue = that.data.searchValue
    console.log('value: ', searchValue)
    const http = require('../../../../utils/http.js')
    var objToChain = {
      "groupId" :5,
      "signUserId": "fee97843cf0c45d683bade8fdebe724f",
      "contractAbi":[{"constant":true,"inputs":[{"name":"_userid","type":"string"}],"name":"getUserCityArray","outputs":[{"name":"","type":"int8"},{"name":"","type":"string[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_userid","type":"string"}],"name":"getUserCityJson","outputs":[{"name":"","type":"int8"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_fields","type":"string[]"},{"name":"index","type":"uint256"},{"name":"values","type":"string"}],"name":"getChangeFieldsString","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_userid","type":"string"},{"name":"_location","type":"string"},{"name":"_time","type":"string"}],"name":"ClockIn","outputs":[{"name":"","type":"int8"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"user_id","type":"string"},{"indexed":false,"name":"user_location","type":"string"},{"indexed":false,"name":"time","type":"string"}],"name":"TRACK_EVENT","type":"event"}],
      "contractAddress":"0x8546174c5fe38243e1dcfb65e1347919fe0f45ba",
       "funcName":"getUserCityJson",
      "funcParam":[searchValue],
      "useCns":false
    }
    http.httpToChain(objToChain, function (res) {
      console.log(res)
      if(res[0] == 1){
        var objRes =  JSON.parse(res[1])
        that.setData({
          trackList: objRes.reverse(),
          hadSearch: true
        })
      } else {
        that.setData({
          trackList: [],
          hadSearch: false
        })
        wx.showModal({
          title: '温馨提示',
          content: '该用户不存在或该用户无打卡记录，请根据需要重新输入用户ID',
          showCancel: false,
          success (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
      
    })
  },

})