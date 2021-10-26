// pages/mine/showUserTrack/showUserTrack.js
const http = require('../../../utils/http.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    trackList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const app = getApp()
    var that = this
    var objToChain =     {
      "groupId" :5,
    "signUserId": "fee97843cf0c45d683bade8fdebe724f",
    "contractAbi":[{"constant":true,"inputs":[{"name":"_userid","type":"string"}],"name":"getUserCityArray","outputs":[{"name":"","type":"int8"},{"name":"","type":"string[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_userid","type":"string"}],"name":"getUserCityJson","outputs":[{"name":"","type":"int8"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_fields","type":"string[]"},{"name":"index","type":"uint256"},{"name":"values","type":"string"}],"name":"getChangeFieldsString","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_userid","type":"string"},{"name":"_location","type":"string"},{"name":"_time","type":"string"}],"name":"ClockIn","outputs":[{"name":"","type":"int8"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"user_id","type":"string"},{"indexed":false,"name":"user_location","type":"string"},{"indexed":false,"name":"time","type":"string"}],"name":"TRACK_EVENT","type":"event"}],
    "contractAddress":"0x8546174c5fe38243e1dcfb65e1347919fe0f45ba",
    "funcName":"getUserCityJson",
      "funcParam":[app.globalData.idNumber],
      "useCns":false
    }
    http.httpToChain(objToChain, function (res) {
      console.log(res)
      var objRes =  JSON.parse(res[1])
      that.setData({
        trackList: objRes.reverse()
      })
    })
  },
})