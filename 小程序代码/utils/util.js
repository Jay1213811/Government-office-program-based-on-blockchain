const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function reminderRegister() {
  wx.showModal({
    title: '提示',
    content: '您还未完善个人信息或登录，无法获得相关信息。请点击底栏”我的“的相关界面进行个人信息完善或登录',
    showCancel: false,
    success (res) {
      if (res.confirm) {
        console.log('用户点击确定')
      }
    }
  })
}

module.exports = {
  formatTime: formatTime,
  reminderRegister: reminderRegister,
}
