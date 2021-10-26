// pages/mine/govermentAdmin/addFile/addFile.js

const http = require('../../../../utils/http.js')
const qiniuUploader = require("../../../../utils/qiniuUploader.js");
const sha256 = require("../../../../utils/sha256.js");
const app = getApp()
const util = require('../../../../utils/util.js')


function initQiniu() {
  var options = {
    region: 'SCN',
    uptoken: '',
    uptokenURL: 'https://www.blockchain.jhw66.cn/user/return_qiniu_upload_token',
    uptokenFunc: function () {},
    domain: 'http://onestopimages.luckydraw.net.cn',
    shouldUseQiniuFileName: false,
  };
  // 将七牛云相关配置初始化进本sdk
  qiniuUploader.init(options);
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    memberId: '',  // 部门成员id
    departmentId: '', // 部门id
    dataTitle: '',
    dataIntroduction: '',
    dataValue: '',
    chooseTits: '仅限选择单个文件',
    posting: false,
    fileTempPath: '',
    fileName: '',
    fileSha256Hash: '',
    fileUrl: '',
    // 文件上传（从客户端会话）返回对象。上传完成后，此属性被赋值
    messageFileObject: {},
    // 文件上传（从客户端会话）进度对象。开始上传后，此属性被赋值
    messageFileProgress: {
      'progress': 0
    },
    // 此属性在qiniuUploader.upload()中被赋值，用于中断上传
    cancelTask: function () {},
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
        memberId: data.memberId,
        departmentId: data.departmentId
      })
    })
  },

  getDataTitle(e) {
    this.setData({
      dataTitle: e.detail.value,
    })
  },
  getDataIntroduction(e) {
    this.setData({
      dataIntroduction: e.detail.value,
    })
  },
  chooseFile(e) {
    var that = this
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        // const tempFilePaths = res.tempFiles
        that.setData({
          fileTempPath: res.tempFiles[0].path,
          fileName: res.tempFiles[0].name,
          chooseTits: '已选择文件'
        })
      }
    })
  },
  postData(e) {
    var that = this
    if(!app.globalData.isLogin){
      util.reminderRegister()
      return
    }
    console.log(that.data.dataTitle)
    console.log(that.data.dataIntroduction)
    console.log(that.data.fileTempPath)
    if (that.data.dataTitle == '' || that.data.dataIntroduction == '' || that.data.fileTempPath == '') {
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
      setTimeout(function () {
        that.setData({
          loading: true
        })
      }, 500)
      // 初始化七牛云相关参数
      initQiniu();
      // 置空messageFileObject和messageFileProgress，否则在第二次上传过程中，wxml界面会存留上次上传的信息
      that.setData({
        messageFileObject: {},
        messageFileProgress: {
          'progress': 0
        },
        posting: true
      });
      var fileManager = wx.getFileSystemManager()
      var fileName = that.data.fileName
      var filePath = that.data.fileTempPath
      var randomNum = Math.floor(Math.random() * (100 - 1)) + 1
      fileManager.readFile({
        filePath: filePath,
        success(res) {
          that.setData({
            fileSha256Hash: sha256.sha256(res.data)
          })
        },
        fail(res) {
          console.log(res)
        }
      })
      // 向七牛云上传
      qiniuUploader.upload(filePath, (res) => {
          res.fileName = fileName;
          that.setData({
            messageFileObject: res,
            fileUrl: res.fileURL
          });
          var dataObj = {
            dataTitle: that.data.dataTitle,
            dataIntroduction: that.data.dataIntroduction,
            informationLink: that.data.fileUrl,
            informationHash: that.data.fileSha256Hash,
            officeMemberId: that.data.memberId
          }
          http.httpRequest(false, 'user/getApplyData', 0, dataObj, 0, function (res) {
            console.log(res)
            if(res == 'success'){
              that.setData({
                dataTitle: '',
                dataIntroduction: '',
                dataValue: '',
                chooseTits: '仅限选择单个文件',
                posting: false,
                fileTempPath: '',
                fileName: '',
                fileSha256Hash: '',
                fileUrl: '',
                // 文件上传（从客户端会话）返回对象。上传完成后，此属性被赋值
                messageFileObject: {},
                // 文件上传（从客户端会话）进度对象。开始上传后，此属性被赋值
                messageFileProgress: {
                  'progress': 0
                },
              })
              wx.showToast({
                title: '上传成功',
                duration: 2000,
                icon: 'success'
              })
            }
          })
          console.log('file name is: ' + fileName);
          console.log('file url is: ' + res.fileURL);
        }, (error) => {
          console.error('error: ' + JSON.stringify(error));
        }, {
          region: 'SCN',
          uptokenURL: 'https://blockchain.luckydraw.net.cn/user/return_qiniu_upload_token',
          domain: 'http://onestopimages.luckydraw.net.cn',
          shouldUseQiniuFileName: false,
          key: app.globalData.userId + '_' + randomNum + '_' + fileName,
          uptokenURL: ''
        },
        (progress) => {
          that.setData({
            messageFileProgress: progress,
          });
          if (progress.progress == 100) {
            that.setData({
              messageFileProgress: progress,
              posting: false
            });

          }
          /* console.log('上传进度', progress.progress);
          console.log('已经上传的数据长度', progress.totalBytesSent);
          console.log('预期需要上传的数据总长度', progress.totalBytesExpectedToSend); */
        }, cancelTask => that.setData({
          cancelTask
        })
      );
    }
  },
  // 中断上传方法
  didCancelTask: function () {
    var that = this
    if (that.data.posting) {
      wx.showModal({
        title: '提示',
        content: '是否取消上传？',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            that.data.cancelTask();
          }
        }
      })
    }
  },

  resetData(e) {
    this.setData({
      dataTitle: '',
      dataIntroduction: '',
      dataValue: '',
      fileTempPath: '',
      fileName: '',
      chooseTits: '仅限选择单个文件',
      hadPosted: false,
    })
  },
})