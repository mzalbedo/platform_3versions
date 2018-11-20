import {
  random
} from '../../util/common.js'

var util = require('../../util/util.js');
var app = getApp();

Page({
  data: {

    img_url: '',
    img_name: '',
    task: {
      goods_name: '',
      introdution: '',
      fileid: '',
      createdAT: '2016-11-00',
      updatedAT: '2016-11-00',
      price: Number,
      ACL: 0,
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
      'task.goods_name': e.detail.value
    });
  },
  // 设置物品介绍
  bindKeyInput1: function (e) {
    this.setData({
      'task.introdution': e.detail.value
    });
  },
  //物品价格
  bindKeyInputPrice: function (e) {
    this.setData({
      'task.price': e.detail.value
    })
  },
  // // 设置物品地点
  // chooseLocation: function () {
  //   var that = this;

  //   wx.chooseLocation({
  //     success: function (res) {
  //       that.setData({
  //         'task.address': res.address,
  //         'task.latitude': res.latitude,
  //         'task.longitude': res.longitude
  //       })
  //     },
  //     fail: function () {
  //       // fail
  //     },
  //     complete: function () {
  //       // complete
  //     }
  //   })
  // },

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
  // 添加数据
  onAdd: function () {
    var data = new Date();
    const db = wx.cloud.database()
    db.collection('goods_table').add({
      data: {
        goods_name: this.data.task.goods_name,        //物品名称
        introdution: this.data.task.introdution,      //物品介绍
        fileid: this.data.task.fileid,                //物品照片
        createdAT: this.data.task.createdAT,          //发布时间
        updatedAT: this.data.task.updatedAT,          //更新时间
        price: this.data.task.price,                  //物品价格
        ACL: this.data.task.ACL,                      //物品状态
      },
      success: res => {
        wx.hideToast();
        // 在返回结果中会包含新创建的记录的 _id
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

  // 提交、检验
  bindSubmit: function (e) {
    var that = this;
    var task = this.data.task;
    var creating = this.data.creating;
    // console.log(this.data);
    if (task.name == '' || task.introdution == '' || !task.price) {
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


  // 创建任务
  createTask: function () {
    var that = this;
    var task = this.data.task;
    wx.showToast({
      title: '新建中',
      icon: 'loading',
      duration: 10000
    });
    this._getUpimage()
      .then(res => {
        this.setData({
          'task.fileid': res
        })
        //this.uploadImg()
        this.onAdd();
      })
  },

  //获取本地图片信息
  uploadImg: function () {
    // console.log("测试上传代码运行")
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        const tempFilePath = res.tempFilePaths[0]
        console.log('cloudPath')
        const cloudPath = 'goods/' + random(17) + tempFilePath.match(/\.[^.]+?$/)[0]
        console.log(cloudPath)
        this.setData({
          img_url: res.tempFilePaths[0],
          img_name: cloudPath
        })
      },
    })
  },

  //上传获取图片ID
  _getUpimage() {
    return new Promise((resolve, reject) => {
      this.upImage(resolve, reject)
    })
  },

  //上传图片
  upImage(resolve, reject) {
    var that = this;

    const filePath = that.data.img_url
    const cloudPath = that.data.img_name
    console.log('cloudPath', cloudPath)
    console.log('filePath', filePath)
    wx.cloud.uploadFile({
      cloudPath,
      filePath,
      success: res => {
        console.log('[上传文件] 成功：', res)
        app.globalData.fileID = res.fileID
        app.globalData.cloudPath = cloudPath
        app.globalData.imagePath = filePath
        resolve(res.fileID)  //promise成功测试
      },
      fail: e => {
        console.error('[上传文件] 失败：', e)
        wx.showToast({
          icon: 'none',
          title: '上传失败',
        })
        reject()  //promise失败测试
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },

  onShow: function () {
    // 恢复新建按钮状态
    this.setData({
      'creating': false
    });
  },

  onHide: function () { },

  // 初始化设置
  onLoad: function () {
    var that = this;
    var now = new Date();
    var openId = wx.getStorageSync('openId');

    // // 初始化打卡时间
    // that.setData({
    //   'task.signTime': util.getHM(now),
    //   'task.signEarlyTime': util.getHM(new Date(now.getTime() - 1000 * 3600 * 2))
    // });

    // 初始化日期
    that.setData({
      'task.createdAT': util.getYMD(now),
      'task.updatedAT': util.getYMD(now)
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
  },
})