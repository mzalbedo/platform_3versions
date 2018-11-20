var icons=require("../../models/index-data.js");

//index.js
const app = getApp()

Page({


data:{

},
onLoad:function()
{
  this.setData({
    icons:icons.icons
  })
  // 调用云函数
  wx.cloud.callFunction({
    name: 'login',
    data: {},
    success: res => {
      console.log('[云函数] [login] user openid: ', res.result.openid)
      if (res.result.openid=="")
      {
        res.result.openid='没有注册'
      }
      app.globalData.openid = res.result.openid
    },
    fail: err => {

      console.error('[云函数] [login] 调用失败', err)
    }
  })
},
  onSwiperItemTap:function(event)
  {
    var postId = event.target.dataset.postid;
    console.log(postId);
  }

  })