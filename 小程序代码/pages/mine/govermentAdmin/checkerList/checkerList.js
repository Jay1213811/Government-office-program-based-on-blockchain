// pages/mine/govermentAdmin/checkerList/checkerList.js
const http = require('../../../../utils/http.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    officeFileList: [],
    currentPage: 1
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
      http.httpRequest(false, 'user/postPublicityList', 0, {
        identity: data.identity,
        departmentId: data.departmentId,
        memberId: data.memberId,
        currentPage: that.data.currentPage,
        workingStatus: false
      }, 0, function (res) {
        var currentPage = that.data.currentPage
        var officeFileList = that.data.officeFileList
        if (res.officeFileList.length != 0) currentPage++
        console.log(res.officeFileList)
        that.setData({
          officeFileList: officeFileList.concat(res.officeFileList),
          currentPage: currentPage,
          memberId: data.memberId,
          departmentId: data.departmentId,
          identity: data.identity,
        })
      })
    })
  },

  toFileInfo: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var obj = {
      "userId": that.data.officeFileList[index].userId,
      "title": that.data.officeFileList[index].title,
      "introduction": that.data.officeFileList[index].introduction,
      "informationLink": that.data.officeFileList[index].informationLink,
      "uploadTime": that.data.officeFileList[index].uploadTime,
      "informationHash": that.data.officeFileList[index].informationHash,
      "fileId": that.data.officeFileList[index].fileId,
      identity: that.data.identity,

      'workingStatus': that.data.workingStatus,
      boss1Opinion: that.data.officeFileList[index].boss1Opinion,
      boss1SignHash: that.data.officeFileList[index].boss1SignHash,
      boss1SignLink: that.data.officeFileList[index].boss1SignLink,
      boss2Opinion: that.data.officeFileList[index].boss2Opinion,
      boss2SignHash: that.data.officeFileList[index].boss2SignHash,
      boss2SignLink: that.data.officeFileList[index].boss2SignLink,
      checkHash: that.data.officeFileList[index].checkHash,
      reviewResult: that.data.officeFileList[index].reviewResult,
      researchResult: that.data.officeFileList[index].researchResult,
      index: index
    }
    wx.navigateTo({
      url: '/pages/mine/govermentAdmin/fileInfo/fileInfo',
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

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    http.httpRequest(false, 'user/postPublicityList', 0, {
      identity: that.data.identity,
      departmentId: that.data.departmentId,
      memberId: that.data.memberId,
      currentPage: that.data.currentPage,
      workingStatus: false
    }, 0, function (res) {
      var currentPage = that.data.currentPage
      var officeFileList = that.data.officeFileList
      if (res.officeFileList.length != 0) currentPage++
      console.log(res.officeFileList)
      that.setData({
        officeFileList: officeFileList.concat(res.officeFileList),
        currentPage: currentPage,
        memberId: that.data.memberId,
        departmentId: that.data.departmentId,
        identity: that.data.identity,
      })
    })
  },

})