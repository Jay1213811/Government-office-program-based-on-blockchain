// pages/resourceView/resourceInfo/resourceInfo.js
const qiniuUploader = require("../../../utils/qiniuUploader.js");
const sha256 = require("../../../utils/sha256.js");
const http = require('../../../utils/http.js')
const util = require('../../../utils/util.js')

const app = getApp()

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
    id: '',
    userId: '',
    title: '',
    introduction: '',
    dataLink: '',
    downloadNum: '',
    dataValue: '',
    uploadTime: '',
    dataHash: '',
    filePath: '',
    buttonBg: 'bg-cyan',
    buttonIcon: 'cuIcon-down',
    buttonText: '下载并验证文件',
    downloadFileProgress: {},
    progressBg: 'bg-cyan',
    loading: false,
    isSame: null
  },
  downloadDataAndCheck: function (e) {
    var that = this
    if (!app.globalData.isLogin) {
      util.reminderRegister()
      return
    }
    if (that.data.isSame) {
      console.log('dataId:')
      console.log(that.data.dataId)
      http.httpRequest(false, 'user/dataDownload', 0, {
        'dataId': that.data.dataId
      }, 0, function (res) {
        if (res == 'success') {
          that.setData({
            downloadNum: parseInt(that.data.downloadNum) + 1
          })
          wx.openDocument({
            filePath: that.data.filePath,
            success: function (res) {
              console.log('打开文档成功');
            },
            fail: function (res) {
              console.log(res);
            }
          });
        }
      })
      return
    }
    that.setData({
      buttonBg: 'bg-cyan',
      buttonIcon: 'cuIcon-loading2',
      buttonText: '下载校验中',
      loading: true,
    })
    const downloadTask = wx.downloadFile({
      url: that.data.dataLink.slice(0, 4) + 's' + that.data.dataLink.slice(4),
      success: function (res) {
        console.log(res);
        var filePath = res.tempFilePath;
        var fileManager = wx.getFileSystemManager()
        fileManager.readFile({
          filePath: filePath,
          success(res) {
            var fileSha256Hash = sha256.sha256(res.data)
            console.log('hash1:')
            console.log(that.data.dataHash)
            console.log('hash2:')
            console.log(fileSha256Hash)
            if (fileSha256Hash == that.data.dataHash) {
              that.setData({
                filePath: filePath,
                isSame: true,
                progressBg: 'bg-green',
                loading: false,
                buttonIcon: 'cuIcon-roundcheck',
                buttonText: '通过校验，点击打开文件',
                buttonBg: 'bg-green',
              })
            } else {
              that.setData({
                isSame: false,
                progressBg: 'bg-red',
                loading: false,
                buttonIcon: 'cuIcon-roundclose',
                buttonBg: 'bg-red',
                buttonText: '未通过校验，点击重新下载',
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
        downloadFileProgress: res
      });
      console.log('下载进度', res.progress);
      console.log('已经下载的数据长度', res.totalBytesWritten);
      console.log('预期需要下载的数据总长度', res.totalBytesExpectedToWrite);
    });
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
        var objRes =  JSON.parse(res[1])[0]
        console.log('objRes: ')
        console.log(objRes)
        that.setData({
          dataId: data.fileId,
          "title": data.title,
          "introduction": data.introduction,
          dataLink: data.informationLink,
          userId: objRes.fields.user_id,
          dataHash: objRes.fields.documen_hash,
          uploadTime: objRes.fields.upload_time,
          downloadNum: objRes.fields.downloadnum,
        })
      })
    })
    
    /* const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptDataFromPrePage', (data) => {
      console.log('新一页的data')
      console.log(data)
      
      that.setData({
        dataId: data.dataId,
        id: data.id,
        userId: data.userId,
        title: data.title,
        introduction: data.introduction,
        dataLink: data.dataLink,
        downloadNum: data.downloadNum,
        dataValue: data.dataValue,
        uploadTime: data.uploadTime,
        dataHash: data.dataHash,
      })
      var objToGetDataHash = {
        "groupId": 1,
        "signUserId": "b2a64f3a13e442b889c722e440040d09",
        "contractAbi": [{
          "constant": true,
          "inputs": [{
            "name": "_data_id",
            "type": "string"
          }],
          "name": "getUserUploadDateHashToString",
          "outputs": [{
            "name": "",
            "type": "string"
          }],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        }, {
          "constant": false,
          "inputs": [{
            "name": "_data_id",
            "type": "string"
          }, {
            "name": "_fields",
            "type": "string"
          }],
          "name": "uploadDateResource",
          "outputs": [{
            "name": "",
            "type": "int8"
          }],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        }, {
          "constant": false,
          "inputs": [{
            "name": "_ownid",
            "type": "string"
          }, {
            "name": "_downloadid",
            "type": "string"
          }, {
            "name": "_data_id",
            "type": "string"
          }],
          "name": "updateUpLoadsNum",
          "outputs": [{
            "name": "",
            "type": "int8"
          }],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        }, {
          "constant": true,
          "inputs": [{
            "name": "_data_id",
            "type": "string"
          }],
          "name": "getUserUploadDateHashToBytes",
          "outputs": [{
            "name": "",
            "type": "bytes32"
          }],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        }, {
          "constant": false,
          "inputs": [{
            "name": "_fields",
            "type": "string[]"
          }, {
            "name": "index",
            "type": "uint256"
          }, {
            "name": "values",
            "type": "string"
          }],
          "name": "getChangeFieldsString",
          "outputs": [{
            "name": "",
            "type": "string"
          }],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        }, {
          "constant": true,
          "inputs": [{
            "name": "_data_id",
            "type": "string"
          }],
          "name": "getDataResourceRecordArray",
          "outputs": [{
            "name": "",
            "type": "int8"
          }, {
            "name": "",
            "type": "string[]"
          }],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        }, {
          "constant": true,
          "inputs": [{
            "name": "_data_id",
            "type": "string"
          }],
          "name": "getNeedCreditNum",
          "outputs": [{
            "name": "",
            "type": "uint256"
          }],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        }, {
          "constant": true,
          "inputs": [{
            "name": "_data_id",
            "type": "string"
          }],
          "name": "getOwnerId",
          "outputs": [{
            "name": "",
            "type": "uint256"
          }],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        }, {
          "inputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "constructor"
        }, {
          "anonymous": false,
          "inputs": [{
            "indexed": false,
            "name": "userid",
            "type": "string"
          }, {
            "indexed": false,
            "name": "activatetime",
            "type": "string"
          }],
          "name": "REGISTER_USER_EVENT",
          "type": "event"
        }, {
          "anonymous": false,
          "inputs": [{
            "indexed": false,
            "name": "userid",
            "type": "string"
          }, {
            "indexed": false,
            "name": "suggestcontent",
            "type": "string"
          }, {
            "indexed": false,
            "name": "suggesttime",
            "type": "string"
          }],
          "name": "SUGGEST_EVENT",
          "type": "event"
        }, {
          "anonymous": false,
          "inputs": [{
            "indexed": false,
            "name": "userid",
            "type": "string"
          }, {
            "indexed": false,
            "name": "applyhash",
            "type": "string"
          }, {
            "indexed": false,
            "name": "applytime",
            "type": "string"
          }],
          "name": "APPLY_RESEARCH_EVENT",
          "type": "event"
        }, {
          "anonymous": false,
          "inputs": [{
            "indexed": false,
            "name": "user_id",
            "type": "string"
          }, {
            "indexed": false,
            "name": "points",
            "type": "uint256"
          }, {
            "indexed": false,
            "name": "time",
            "type": "string"
          }],
          "name": "ADD_CREDITPOINT_EVENT",
          "type": "event"
        }, {
          "anonymous": false,
          "inputs": [{
            "indexed": false,
            "name": "user_id",
            "type": "string"
          }, {
            "indexed": false,
            "name": "points",
            "type": "uint256"
          }, {
            "indexed": false,
            "name": "time",
            "type": "string"
          }],
          "name": "DEL_CREDITPOINT_EVENT",
          "type": "event"
        }, {
          "anonymous": false,
          "inputs": [{
            "indexed": false,
            "name": "data_id",
            "type": "string"
          }, {
            "indexed": false,
            "name": "time",
            "type": "string"
          }],
          "name": "UPLOAD_DATARESOURCE_EVENT",
          "type": "event"
        }, {
          "anonymous": false,
          "inputs": [{
            "indexed": false,
            "name": "owner_id",
            "type": "string"
          }, {
            "indexed": false,
            "name": "uploadid",
            "type": "string"
          }, {
            "indexed": false,
            "name": "dataid",
            "type": "string"
          }, {
            "indexed": false,
            "name": "time",
            "type": "string"
          }],
          "name": "DOWNLOAD_DATARESOURCE_EVENT",
          "type": "event"
        }, {
          "anonymous": false,
          "inputs": [{
            "indexed": false,
            "name": "user_id",
            "type": "string"
          }, {
            "indexed": false,
            "name": "user_city",
            "type": "string"
          }, {
            "indexed": false,
            "name": "time",
            "type": "string"
          }],
          "name": "TRACK_EVENT",
          "type": "event"
        }],
        "contractAddress": "0x4682dd02504cedfcf86c4131d45a6aaedfdc15cd",
        "funcName": "getUserUploadDateHashToString",
        "funcParam": [data.dataId]
      }
      http.httpToChain(objToGetDataHash, function (res) {
        console.log(res)
        that.setData({
          dataHash: res[0],
        })
      })
    }) */


  },
})