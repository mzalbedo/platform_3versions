

var util = require('../../util/util.js');
var app = getApp();

Page({
  data: {
  
    img_url:'',
    task: {
      name: '',
      price:'',
      introdution:'',
      address: '点击选择地点',
      address1:'',
      signTime: '00:00',
      signEarlyTime: '00:00',
      startDay: '2016-11-00',
      endDay: '2016-11-00',
      repeat: {
        'monday': 1,
        'tuesday': 1,
        'wednesday': 1,
        'thursday': 1,
        'friday': 1,
        'saturday': 0,
        'sunday': 0
      }
    },
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
      'task.name': e.detail.value
    });
  },
  // 设置物品介绍
  bindKeyInput1: function (e) {
    this.setData({
      'task.introdution': e.detail.value
    });
  },
  bindKeyInput2:function(e)
  {
    this.setData({
      'task.address1': e.detail.value
    })
  },
  bindKeyInputPrice:function(e)
  {
    this.setData({
      'task.price': e.detail.value
    })
  },
  // 设置物品地点
  chooseLocation: function () {
    var that = this;

    wx.chooseLocation({
      success: function (res) {
        that.setData({
          'task.address': res.address,
          'task.latitude': res.latitude,
          'task.longitude': res.longitude
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

  // 设置打卡时间
  setSignTime: function (e) {
    var that = this;
    var hour = ((+e.detail.value.slice(0, 2) + 24 - 2) % 24).toString();
    that.setData({
      'task.signTime': e.detail.value,
      'task.signEarlyTime': (hour[1] ? hour : '0' + hour) + ':' + e.detail.value.slice(3, 5)
    });
  },

  // 设置开始日期
  startDateChange: function (e) {
    this.setData({
      'task.startDay': e.detail.value
    })
  },

  // 设置结束日期
  endDateChange: function (e) {
    this.setData({
      'task.endDay': e.detail.value
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
    var data=new Date();
    const db = wx.cloud.database()
    db.collection('username').add({
      data: {
        price: this.data.task.price,  //价格
        name: this.data.task.name,     // //物品名字
        introdution: this.data.task.introdution,   //物品介绍
        address: this.data.task.address,    //地址
        address1: this.data.task.address1, //详情地址
        nickName:this.data.userInfo.nickName,  //用户名字
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
    var that = this;
    var task = this.data.task;
    var openId = this.data.openId;
    var userInfo = this.data.userInfo;
    console.log(this.data)
    wx.showToast({
      title: '新建中',
      icon: 'loading',
      duration: 10000
    });

    this.onAdd();


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

  uploadImg:function()
{
    // new AV.initialize();
    console.log("测试上传代码运行")
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: data => {
        const tempFilePath = data.tempFilePaths[0];
        console.log(tempFilePath)
      
        this.setData({
          img_url: data.tempFilePaths[0]
        })


      },
    })
},

  // 提交、检验
  bindSubmit: function (e) {
    var that = this;
    var task = this.data.task;
    var creating = this.data.creating;
  // console.log(this.data);
    if (task.name == '' || task.address == '点击选择地点') {
      this.setData({
        modalHidden: false
      });
    } else {
      if (!creating) {
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
    var openId = wx.getStorageSync('openId');

    // 初始化打卡时间
    that.setData({
      'task.signTime': util.getHM(now),
      'task.signEarlyTime': util.getHM(new Date(now.getTime() - 1000 * 3600 * 2))
    });

    // 初始化日期
    that.setData({
      'task.startDay': util.getYMD(now),
      'task.endDay': util.getYMD(now)
    });


    // 初始化昵称
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      });

      that.setData({
        openId: openId
      })
    });

  }
})