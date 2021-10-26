// pages/mine/creditRecord/creditRecord.js
const http = require('../../../utils/http.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 0,
    scrollLeft: 0,
    suggestList: [],
    resourceUpList: [],
    resourceDownList: [],
    downloaderList: [],
    currentPage0: 1,
    currentPage1: 1,
    currentPage2: 1,
    showDialog: false,
    currentPage3: 1,  // 下载者列表页
    whichDataToShowDownloadList: null,
  },

  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },

  getList(e){
    var that = this
    var listType = e.currentTarget.dataset.listType
    var url = 'user/getOwnSuggestList'
    var target = 'suggestList'
    var currentPage = 'currentPage0'
    if(listType==1){
      url = 'user/getResourceUpList'
      target = 'resourceUpList'
      currentPage = 'currentPage1'
    }
    if(listType==2){
      url = 'user/getResourceDownList'
      target = 'resourceDownList'
      currentPage = 'currentPage2'
    }
    http.httpRequest(false, url, 0, {currentPage: that.data[currentPage]}, 0, function (res) {
      that.setData({
        [currentPage]: that.data[currentPage] + 1,
        target: that.data[target].concat(res[target])
      })
    })
  },

  getdownloaderList(){
    var that = this
    console.log('getdownloaderList执行')
    http.httpRequest(false, 'user/getDownloaderList', 0, {'dataId': that.data.resourceUpList[that.data.whichDataToShowDownloadList].id, currentPage: that.data.currentPage3}, 0, function (res) {
      console.log(res)
      that.setData({
        currentPage3: that.data.currentPage3 + 1,
        downloaderList: that.data.downloaderList.concat(res.downloaderList)
      })
    })
  },

  toggleDialog(e){
    var that = this
    if(that.data.showDialog){
      this.setData({
        showDialog: false,
      })
    } else {
      this.data.whichDataToShowDownloadList = e.currentTarget.dataset.index
      this.setData({
        showDialog: true,
        whichDataToShowDownloadList: e.currentTarget.dataset.index
      })
      that.getdownloaderList()
    }
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    http.httpRequest(false, 'user/getOwnSuggestList', 0, {currentPage: 1}, 0, function (res) {
      that.setData({
        currentPage0: 2,
        suggestList: res.suggestList,
      })
    })
    http.httpRequest(false, 'user/getResourceDownList', 0, {currentPage: 1}, 0, function (res) {
      that.setData({
        currentPage2: 2,
        resourceDownList: res.resourceDownList,
      })
    })
  },
})