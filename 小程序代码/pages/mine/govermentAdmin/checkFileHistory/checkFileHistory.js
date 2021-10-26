// pages/mine/govermentAdmin/checkFileHistory/checkFileHistory.js
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
      http.httpRequest(false, 'user/returnFileListToStaff', 0, {
        memberId: data.memberId,
        currentPage: that.data.currentPage
      }, 0, function (res) {
        var currentPage = that.data.currentPage
        var officeFileList = that.data.officeFileList
        if (res.officeFileList.length != 0) currentPage++
        console.log(res.officeFileList)
        that.setData({
          officeFileList: officeFileList.concat(res.officeFileList),
          currentPage: currentPage,
          memberId: data.memberId,
          departmentId: data.departmentId
        })
      })
    })
  },

  toFileInfo: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index
    console.log("index:")
    console.log(index)
    var obj = {
      "userId": that.data.officeFileList[index].userId,
      "title": that.data.officeFileList[index].title,
      "introduction": that.data.officeFileList[index].introduction,
      "informationLink": that.data.officeFileList[index].informationLink,
      "downloadNum": that.data.officeFileList[index].downloadNum,
      "uploadTime": that.data.officeFileList[index].uploadTime,
      "informationHash": that.data.officeFileList[index].informationHash,
      "fileId": that.data.officeFileList[index].fileId,
      'workingStatus': that.data.officeFileList[index].workingStatus,
      'researchResult': that.data.officeFileList[index].researchResult,
      boss1Opinion: that.data.officeFileList[index].boss1Opinion,
      boss1SignLink: that.data.officeFileList[index].boss1SignLink,
      boss1SignHash: that.data.officeFileList[index].boss1SignHash,
      boss2Opinion: that.data.officeFileList[index].boss2Opinion,
      boss2SignLink: that.data.officeFileList[index].boss2SignLink,
      boss2SignHash: that.data.officeFileList[index].boss2SignHash,
      checkHash: that.data.officeFileList[index].checkHash,
      'reviewResult': that.data.officeFileList[index].reviewResult,
      identity: 0
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

  onReachBottom: function () {
    var that = this
    http.httpRequest(false, 'user/returnFileListToStaff', 0, {
      memberId: that.data.memberId,
      currentPage: that.data.currentPage
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
  },
})