App({
  onLaunch: function () {
   

      if (!wx.cloud) {
        console.error('请使用 2.2.3 或以上的基础库以使用云能力')
      } else {
        wx.cloud.init({
          traceUser: true,
        })
      }

      this.globalData = {}
    
  },

  getUserInfo: function (cb) {
    var that = this

    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function (r) {

          // 获取用户信息 
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })

          // 获取用户openid
          wx.request({
            url: 'https://www.cpcsign.com/api/login',
            data: {
              'js_code': r.code
            },
            method: 'GET',
            success: function (res) {
              console.log('---code 换取 openid---');
              wx.setStorageSync('openId', res.data.openid);
            }
          })

          
        }
      })
    }
  },

  globalData: {
    userInfo: null,
    openId: ''
  }
})