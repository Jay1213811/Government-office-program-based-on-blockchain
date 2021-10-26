// pages/mine/govermentAdmin/fileInfo/fileInfo.js
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
    fileId: null,
    identity: null, // 0是科员查看自己的情况，1是领导1签名，2是领导2签名，3是人事处检查，4是公示
    informationLink: '',
    informationHash: '',
    boss1Opinion: null,
    boss1SignLink: '',
    boss1SignHash: '',
    boss1Text: '未审核',
    boss2Opinion: null,
    boss2SignLink: '',
    boss2SignHash: '',
    boss2Text: '未审核',
    checkHash: '',
    researchResult: '',
    reviewResult: null, // 人事处审核结果
    reviewText: '未审核',
    index: null,

    signPicker: ['未审核', '同意', '否决'],
    boss1Picker: 0,
    boss2Picker: 0,
    reviewPicker: 0,

    posting: false,
    chooseTits: "选择签名照片（仅限一个）",
    hadDownload1: false,
    hadDownload2: false,
    hadDownload3: false,
    hadOpen1: false,
    hadOpen2: false,
    hadOpen3: false,
    uploadFilePath: '',
    imageObject: {},
    imageProgress: {},

    buttonBg1: 'bg-cyan',
    buttonIcon1: 'cuIcon-down',
    buttonText1: '下载并验证证明材料',
    downloadFileProgress1: {},
    filePath1: '', //通过网络下载后的本地连接
    loading1: false,
    isSame1: null,

    buttonBg2: 'bg-cyan',
    buttonIcon2: 'cuIcon-down',
    buttonText2: '下载并验证教务主任意见签字',
    downloadFileProgress2: {},
    filePath2: '', //通过网络下载后的本地连接
    loading2: false,
    isSame2: null,

    buttonBg3: 'bg-cyan',
    buttonIcon3: 'cuIcon-down',
    buttonText3: '下载并验证院长意见签字',
    downloadFileProgress3: {},
    filePath3: '', //通过网络下载后的本地连接
    loading3: false,
    isSame3: null,

    // 三个文件总校验
    buttonBg5: 'bg-cyan',
    buttonIcon5: 'cuIcon-search',
    buttonText5: '校验已下载的三个文件',
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
        identity: data.identity, // 0是个人查看自己的情况，1是领导1签名，2是领导2签名，3是人事处检查，4是公示
      })
      var objToGetDataInfo = {
        "groupId" :5,
        "signUserId": "fee97843cf0c45d683bade8fdebe724f",
        "contractAbi":[{"constant":true,"inputs":[{"name":"_applicationid","type":"string"}],"name":"getApplyHash","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_applicationid","type":"string"},{"name":"_userid","type":"string"},{"name":"_informationhash","type":"string"}],"name":"applyForDocument","outputs":[{"name":"","type":"int8"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_applicationid","type":"string"}],"name":"getLeaderSignHash","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_fields","type":"string[]"},{"name":"index","type":"uint256"},{"name":"values","type":"string"}],"name":"getChangeFieldsString","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_applicationid","type":"string"}],"name":"getApplyJson","outputs":[{"name":"","type":"int8"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_checkerid","type":"string"},{"name":"_applicationid","type":"string"},{"name":"checkresult","type":"string"}],"name":"GiveResultToUser","outputs":[{"name":"","type":"int8"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_applicationid","type":"string"},{"name":"checkhash","type":"string"}],"name":"checkApplyResearch","outputs":[{"name":"","type":"int8"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_applicationid","type":"string"}],"name":"getUserApplyArray","outputs":[{"name":"","type":"int8"},{"name":"","type":"string[]"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"userid","type":"string"},{"indexed":false,"name":"application_id","type":"string"},{"indexed":false,"name":"date","type":"string"}],"name":"APPLY_DOCUMENT_EVENT","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"applicationid","type":"string"},{"indexed":false,"name":"signHash","type":"string"},{"indexed":false,"name":"date","type":"string"}],"name":"Track_LeaderSignature","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"applicationid","type":"string"},{"indexed":false,"name":"checkerid","type":"string"},{"indexed":false,"name":"result","type":"string"},{"indexed":false,"name":"date","type":"string"}],"name":"Tack_Final_Result","type":"event"}],
        "contractAddress":"0x98b9db3f2db6df5d912551b6672a87ae0e9202d7",
        "funcName":"getUserApplyArray",
        "funcParam":[data.fileId+''],
        "useCns":false
    }
    console.log("objToGetDataInfo:")
    console.log(objToGetDataInfo)
    http.httpToChain(objToGetDataInfo, function(res){
      console.log(res)
      console.log(res[1][0])
      that.setData({
        informationHash: res[1][1],
      })
      if(data.identity == 3){
        that.setData({
          checkHash: res[1][3],
        })
      }
      if(data.identity == 4){
        that.setData({
          checkHash: res[1][1],
          uploadTime: res[1][5],
        })
      }
    })
      if (data.identity == 0) {
        var boss1Picker = 0
        var boss2Picker = 0
        var reviewPicker = 0
        var researchResultText = '待定'
        if (data.boss1Opinion == true) boss1Picker = 1
        if (data.boss1Opinion == false) boss1Picker = 2
        if (data.boss2Opinion == true) boss2Picker = 1
        if (data.boss2Opinion == false) boss2Picker = 2
        if (data.reviewResult == true) reviewPicker = 1
        if (data.reviewResult == false) reviewPicker = 2
        if (data.researchResult == true) researchResultText = '成功'
        if (data.researchResult == false) researchResultText = '失败'
      
        that.setData({
          "userId": data.userId,
          "title": data.title,
          "introduction": data.introduction,
          "fileId": data.fileId,
          "downloadNum": data.downloadNum,
          uploadTime: data.uploadTime,
          informationLink: data.informationLink,
          boss1Opinion: data.boss1Opinion,
          boss1SignLink: data.boss1SignLink,
          boss1SignHash: data.boss1SignHash,
          boss2Opinion: data.boss2Opinion,
          boss2SignLink: data.boss2SignLink,
          boss2SignHash: data.boss2SignHash,
          researchResult: data.researchResult,
          reviewResult: data.reviewResult,
          boss1Picker: boss1Picker,
          boss2Picker: boss2Picker,
          reviewPicker: reviewPicker,
          researchResultText: researchResultText,
        })
      }
      if (data.identity == 1 || data.identity == 2) {
        that.setData({
          "userId": data.userId,
          "title": data.title,
          "introduction": data.introduction,
          "fileId": data.fileId,
          uploadTime: data.uploadTime,
          informationLink: data.informationLink,
          index: data.index

        })
      }
      if (data.identity == 3 || data.identity == 4) {
        console.log(data)
        console.log(data.applyTime)
        var reviewPicker = 0
        var researchResultText = '待定'
        if(data.reviewResult != null) reviewPicker = data.reviewResult?1:2
        if(data.researchResult != null) researchResultText = data.researchResult?'成功':'失败'
        that.setData({
          identity: data.identity,
          workingStatus: data.workingStatus,
          fileId: data.fileId,
          informationLink: data.informationLink,
          uploadTime: data.uploadTime,
          boss1Picker: data.boss1Opinion?1:2,
          boss2Picker: data.boss2Opinion?1:2,
          boss1Opinion: data.boss1Opinion,
          boss1SignHash: data.boss1SignHash,
          boss1SignLink: data.boss1SignLink,
          boss2Opinion: data.boss2Opinion,
          boss2SignHash: data.boss2SignHash,
          boss2SignLink: data.boss2SignLink,
          researchResultText: researchResultText,
          "userId": data.userId,
          "title": data.title,
          "introduction": data.introduction,
          "downloadNum": data.downloadNum,
          index: data.index
        })
        if(data.identity == 4){
          var objToGetFileInfoFromChain = {
            "groupId" :5,
            "signUserId": "fee97843cf0c45d683bade8fdebe724f",
            "contractAbi":[{"constant":true,"inputs":[{"name":"_applicationid","type":"string"}],"name":"getDocumentJson","outputs":[{"name":"","type":"int8"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_leaderid","type":"string"},{"name":"_usertype","type":"string"},{"name":"_datatype","type":"string"}],"name":"SetLogForDatePublic","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_documentid","type":"string"}],"name":"getDownloadsNum","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_applicationid","type":"string"}],"name":"getDocumentArray","outputs":[{"name":"","type":"int8"},{"name":"","type":"string[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_fields","type":"string[]"},{"name":"index","type":"uint256"},{"name":"values","type":"string"}],"name":"getChangeFieldsString","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"downloadsid","type":"string"},{"name":"_documentid","type":"string"}],"name":"UpdateDownloadsNum","outputs":[{"name":"","type":"int8"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_applicationid","type":"string"},{"name":"_fields","type":"string"}],"name":"PublicDocument","outputs":[{"name":"","type":"int8"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_downloadsid","type":"string"},{"name":"_datatype","type":"string"}],"name":"SetLogForDateDownload","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"downloadid","type":"string"},{"indexed":false,"name":"applicationid","type":"string"},{"indexed":false,"name":"date","type":"string"},{"indexed":false,"name":"downloadsnum","type":"string"}],"name":"DownLoads_Document_EVENT","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"downloadid","type":"string"},{"indexed":false,"name":"_datatype","type":"string"},{"indexed":false,"name":"date","type":"string"}],"name":"DateLog_Track_Event","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"leaderid","type":"string"},{"indexed":false,"name":"usertype","type":"string"},{"indexed":false,"name":"datetype","type":"string"},{"indexed":false,"name":"date","type":"string"}],"name":"Track_DatePublish","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"applicationid","type":"string"},{"indexed":false,"name":"fields","type":"string"}],"name":"Public_Document","type":"event"}],
            "contractAddress":"0x4ff98862186ada02effaba06bdc891cb9b037c01",
            "funcName":"getDocumentJson",
            "funcParam":[data.fileId + ''],
            "useCns":false
          }
          http.httpToChain(objToGetFileInfoFromChain, function(res){
            console.log(res)
            var objRes =  JSON.parse(res[1])
            console.log('objRes: ')
            console.log(objRes)
            that.setData({
              identity: data.identity,
              workingStatus: data.workingStatus,
              fileId: data.fileId,
              informationLink: data.informationLink,
              informationHash: objRes.documen_hash,
              uploadTime: objRes.upload_time,
              boss1Picker: data.boss1Opinion?1:2,
              boss2Picker: data.boss2Opinion?1:2,
              boss1Opinion: data.boss1Opinion,
              boss1SignHash: data.boss1SignHash,
              boss1SignLink: data.boss1SignLink,
              boss2Opinion: data.boss2Opinion,
              boss2SignHash: data.boss2SignHash,
              boss2SignLink: data.boss2SignLink,
              researchResultText: researchResultText,
              "userId": objRes.user_id,
              "title": data.title,
              "introduction": data.introduction,
              "downloadNum": objRes.downloadnum,
              reviewPicker: reviewPicker
            })
          })
          
        }
      }
    })
  },

  changeBoss1Picker(e) {
    console.log(e);
    var boss1Opinion = null
    if (e.detail.value == 0) boss1Opinion = null
    if (e.detail.value == 1) boss1Opinion = true
    if (e.detail.value == 2) boss1Opinion = false
    this.setData({
      boss1Picker: e.detail.value,
      boss1Opinion: boss1Opinion
    })
  },

  changeBoss2Picker(e) {
    console.log(e);
    var boss2Opinion = null
    if (e.detail.value == 0) boss2Opinion = null
    if (e.detail.value == 1) boss2Opinion = true
    if (e.detail.value == 2) boss2Opinion = false
    this.setData({
      boss2Picker: e.detail.value,
      boss2Opinion: boss2Opinion
    })
  },

  changeReviewPicker(e) {
    console.log(e);
    var reviewResult = null
    if (e.detail.value == 1) reviewResult = true
    if (e.detail.value == 2) reviewResult = false
    this.setData({
      reviewPicker: e.detail.value,
      reviewResult: reviewResult
    })
  },

  choosePhoto(e) {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          uploadFilePath: res.tempFilePaths[0],
          chooseTits: '已选择文件'
        })
      }
    })
  },

  postData(e) {
    var that = this
    if (that.data['boss' + that.data.identity + 'Opinion'] == null || that.data.uploadFilePath == '' || that.data.hadDownload1 == false || that.datahadOpen1 == false) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请选择申请意见、图片、下载材料并打开检查。',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '该意见只能提交一次，且提交后不能修改，请确认您的信息正确。',
        showCancel: true,
        cancelText: '检查材料',
        confirmText: '确认提交',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            setTimeout(function () {
              that.setData({
                loading: true
              })
            }, 500)
            // 初始化七牛云相关参数
            initQiniu();
            // 置空messageFileObject和messageFileProgress，否则在第二次上传过程中，wxml界面会存留上次上传的信息
            that.setData({
              imageObject: {},
              imageProgress: {
                'progress': 0
              },
              posting: true
            });
            var fileManager = wx.getFileSystemManager()
            var filePath = that.data.uploadFilePath
            var randomNum = Math.floor(Math.random() * (100 - 1)) + 1
            fileManager.readFile({
              filePath: filePath,
              success(res) {
                that.setData({
                  ['boss' + that.data.identity + 'SignHash']: sha256.sha256(res.data)
                })
              },
              fail(res) {
                console.log(res)
              }
            })
            // 向七牛云上传
            qiniuUploader.upload(filePath, (res) => {
                that.setData({
                  imageObject: res,
                  ['boss' + that.data.identity + 'SignLink']: res.fileURL
                });
                var dataObj = {
                  id: that.data.fileId,
                  whichBoss: that.data.identity,
                  ['boss' + that.data.identity + 'Opinion']: that.data['boss' + that.data.identity + 'Opinion'],
                  ['boss' + that.data.identity + 'SignLink']: res.fileURL,
                  ['boss' + that.data.identity + 'SignHash']: that.data['boss' + that.data.identity + 'SignHash'],
                }
                http.httpRequest(false, 'user/bossSign', 0, dataObj, 0, function (res) {
                  console.log(res)
                  if (res == 'success') {
                    wx.showToast({
                      title: '上传成功',
                      duration: 2000,
                      icon: 'success',
                      complete(res) {
                        let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
                        let prevPage = pages[ pages.length - 2 ]
                        var officeFileList = prevPage.data.officeFileList
                        officeFileList.splice(that.data.index, 1)
                      //prevPage 是获取上一个页面的js里面的pages的所有信息。 -2 是上一个页面，-3是上上个页面以此类推。
                      prevPage.setData({  // 将我们想要传递的参数在这里直接setData。上个页面就会执行这里的操作。
                        officeFileList: officeFileList
                      })
                        wx.navigateBack({
                          delta: 1,
                          fail(res) {
                            console.log(res)
                          }
                        })
                      }
                    })
                  }
                })
                console.log('file url is: ' + res.fileURL);
              }, (error) => {
                console.error('error: ' + JSON.stringify(error));
              }, {
                region: 'SCN',
                uptokenURL: 'https://blockchain.luckydraw.net.cn/user/return_qiniu_upload_token',
                domain: 'http://onestopimages.luckydraw.net.cn',
                shouldUseQiniuFileName: false,
                key: app.globalData.userId + '_' + that.data.id + '_' + randomNum + '_领导意见' + that.data.identity + '签名照片',
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
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },

  isDownloadAll() {
    var that = this
    if (that.data.hadDownload1 == false || that.datahadOpen1 == false || that.data.hadDownload2 == false || that.datahadOpen2 == false || that.data.hadDownload3 == false || that.data.hadOpen3 == false || that.data.isSame1 != true || that.data.isSame3 != true || that.data.isSame3 != true) {
      return false
    }
    return true
  },

  checkFileHash() {
    var that = this
    if (!that.isDownloadAll()) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请事先下载所有材料并打开检查，并确保三个文件均通过校验。',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    } else {
      that.setData({
        buttonBg5: 'bg-cyan',
        buttonIcon5: 'cuIcon-loading2',
        buttonText5: '校验中',
        loading5: true,
      })
      
      var finalHash = that.data.checkHash
      var tempFinalHash = sha256.sha256(that.data.boss1SignHash + that.data.boss2SignHash)
      console.log("两个HASH对比：")
      console.log(finalHash)
      console.log(tempFinalHash)
      var isMatch = tempFinalHash == finalHash
      if (!isMatch) {
        that.setData({
          isSame5: false,
          progressBg5: 'bg-red',
          loading5: false,
          buttonIcon5: 'cuIcon-roundclose',
          buttonBg5: 'bg-red',
          buttonText5: '未通过校验',
          passCheck: false
        })
        wx.showModal({
          title: '提示',
          content: '您当前下载的信息未能通过校验',
          showCancel: false,
          success(res) {
            that.setData({
              passCheck: false
            })
            if (res.confirm) {
              console.log('用户点击确定')
            }
          }
        })
      } else {
        that.setData({
          isSame5: true,
          progressBg5: 'bg-green',
          loading5: false,
          buttonIcon5: 'cuIcon-roundcheck',
          buttonBg5: 'bg-green',
          buttonText5: '通过校验',
        })
      }
    }
  },

  bossCheck(e) {
    var that = this
    if (!that.isDownloadAll() || that.data.reviewResult == null || that.data.isSame5 != true) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请选择审核意见、下载所有材料并打开检查。文件未能通过校验则不能进行审核确认。',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '该意见只能提交一次，且提交后不能修改，请确认您的信息正确。',
        showCancel: true,
        cancelText: '检查材料',
        confirmText: '确认提交',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            var dataObj = {
              id: that.data.fileId,
              reviewResult: that.data.reviewResult,
            }
            http.httpRequest(false, 'user/bossCheck', 0, dataObj, 0, function (res) {
              console.log(res)
              if(res == 'success'){
                wx.showToast({
                  title: '提交成功',
                  icon: 'success',
                  duration: 2000,
                  success(res){
                    let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
                    let prevPage = pages[ pages.length - 2 ];  
                    var officeFileList = prevPage.data.officeFileList
                    officeFileList.splice(that.data.index, 1)
                    //prevPage 是获取上一个页面的js里面的pages的所有信息。 -2 是上一个页面，-3是上上个页面以此类推。
                    prevPage.setData({  // 将我们想要传递的参数在这里直接setData。上个页面就会执行这里的操作。
                      officeFileList: officeFileList
                    })
                    wx.navigateBack({
                      delta: 1,
                    })
                  }
                })
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        },
        fail(res){console.log(res)}
      })
    }
  },

  downloadDataAndCheck: function (e) {
    var button = e.currentTarget.dataset.button
    if (!app.globalData.registeredStatus) {
      util.reminderRegister()
      return
    }
    var that = this
    var isSame = that.data['isSame' + button]
    console.log(that.data.loading2 && that.data.boss1SignLink!= null && that.data.boss1SignLink!= '')
    console.log(that.data.loading2)
    console.log(that.data.boss1SignLink)
    if (isSame) {
      if(button == 1){
        wx.openDocument({
          filePath: that.data['filePath' + button],
          success: function (res) {
            that.setData({
              ['hadOpen' + button]: true
            })
            console.log('打开文档成功');
          },
          fail: function (res) {
            console.log(res);
          }
        });
      } else {
        wx.previewImage({
          current: that.data['filePath' + button], // 当前显示图片的http链接
          urls: [that.data['filePath' + button]],
          success(res){
            that.setData({
              ['hadOpen' + button]: true
            })
            console.log('打开图片成功');
          }
        })
      }
      return
    } else {
      var fileLink = ''
      var fileHash = ''
      if (button == '1') {
        fileLink = that.data.informationLink
        fileHash = that.data.informationHash
      }
      if (button == '2') {
        fileLink = that.data.boss1SignLink
        fileHash = that.data.boss1SignHash
      }
      if (button == '3') {
        fileLink = that.data.boss2SignLink
        fileHash = that.data.boss2SignHash
      }
      //if(fileLink == null || fileLink == ''){}
      that.setData({
        ['buttonBg' + button]: 'bg-cyan',
        ['buttonIcon' + button]: 'cuIcon-loading2',
        ['buttonText' + button]: '下载校验中',
        ['loading' + button]: true,
      })
      const downloadTask = wx.downloadFile({
        url: fileLink.slice(0, 4) + 's' + fileLink.slice(4),
        success: function (res) {
          console.log(res);
          var downFilePath = res.tempFilePath;
          var fileManager = wx.getFileSystemManager()
          fileManager.readFile({
            filePath: downFilePath,
            success(res) {
              var fileSha256Hash = sha256.sha256(res.data)
              console.log('hash1:')
              console.log(fileHash)
              console.log('hash2:')
              console.log(fileSha256Hash)
              if (fileSha256Hash == fileHash) {
                that.setData({
                  ['filePath' + button]: downFilePath,
                  ['isSame' + button]: true,
                  ['progressBg' + button]: 'bg-green',
                  ['loading' + button]: false,
                  ['buttonIcon' + button]: 'cuIcon-roundcheck',
                  ['buttonText' + button]: '通过校验，点击打开文件',
                  ['buttonBg' + button]: 'bg-green',
                  ['hadDownload' + button]: true
                })
              } else {
                that.setData({
                  ['isSame' + button]: false,
                  ['progressBg' + button]: 'bg-red',
                  ['loading' + button]: false,
                  ['buttonIcon' + button]: 'cuIcon-roundclose',
                  ['buttonBg' + button]: 'bg-red',
                  ['buttonText' + button]: '未通过校验，点击重新下载',
                })
              }
            },
            fail(res) {
              console.log(res)
            }
          })
        },
        fail: function (res) {
          console.log(res);
        }
      });
      downloadTask.onProgressUpdate((res) => {
        that.setData({
          ['downloadFileProgress' + button]: res
        });
      });
    }
  },
})