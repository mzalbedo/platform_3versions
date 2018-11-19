

var util = require('../../util/util.js');
var app = getApp();

Page({
  data: {
    tel:'',
    address:'',
    address1:'',
    ACL:0,
    createdAt:"2018-11-11",
    updatedAt:'',
  
    
    openid: '',
    userInfo: {},
    creating: false,
    button: {
      txt: '新建'
    },
    modalHidden: true
  },

  onLoad: function (options) {
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
      console.log(app.globalData)
    }
  },

  // 设置物品名称
  bindKeyInput: function (e) {
    this.setData({
      'tel': e.detail.value
    });
  },
  
  bindKeyInput2: function (e) {
    this.setData({
      'address1': e.detail.value
    })
  },

  // 设置物品地点
  chooseLocation: function () {
    var that = this;

    wx.chooseLocation({
      success: function (res) {
        that.setData({
          'address': res.address,
        })
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },


  // 隐藏提示弹层
  modalChange: function (e) {
    this.setData({
      modalHidden: true
    })
  },
  // add database data
  onAdd: function () {
    var data = new Date();
    const db = wx.cloud.database()
    db.collection('username').add({
      data: {
        price: this.data.task.price,  //价格
        name: this.data.task.name,     // //物品名字
        introdution: this.data.task.introdution,   //物品介绍
        address: this.data.task.address,    //地址
        address1: this.data.task.address1, //详情地址
        nickName: this.data.userInfo.nickName,  //用户名字
        date: data,                    //时间
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        this.setData({
          counterId: res._id,
          count: 11324646,

          price: 104569815
        })
        wx.showToast({
          title: '新增记录成功',
        })
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },

  // 创建任务
  createTask: function () {

    console.log(this.data)
    wx.showToast({
      title: '新建中',
      icon: 'loading',
      duration: 10000
    });

    //this.onAdd();


    wx.hideToast();
    wx.navigateTo({
      url: '/pages/my/my',
      success: function (res) {
        // success
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })


  },

  // 提交、检验
  bindSubmit: function (e) {
    var that = this;
    
    // console.log(this.data);
    if (that.data.tel == '' || that.data. address == '点击选择地点') {
      this.setData({
        modalHidden: false
      });
    } else {
      if (!this.data.creating) {
        this.setData({
          'creating': true
        });
        that.createTask();
      }
    }
  },

  onShow: function () {
    // 恢复新建按钮状态
    this.setData({
      'creating': false
    });
  },

  onHide: function () {
  },

  // 初始化设置
  onLoad: function () {
    var that = this;
    var now = new Date();
    var openid = wx.getStorageSync('openid');

    // 初始化打卡时间
    that.setData({
      'createdAt': util.getHM(now),
    });

  

    // 初始化昵称
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      });

      that.setData({
        openid: openid
      })
    });

  }
})