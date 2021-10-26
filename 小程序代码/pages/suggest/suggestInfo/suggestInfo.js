// pages/suggest/suggestInfo/suggestInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

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
      that.setData({
        id: data.id,
        userId: data.userId,
        title: data.title,
        content: data.content,
        isCompliance: data.isCompliance?'内容合规':'内容违规',
        suggestTime: data.suggestTime
      })
    })
  },

})