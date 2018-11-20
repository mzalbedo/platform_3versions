var util = require('../../util/util.js');
var app = getApp();

Page({
  data: {
    tel: '请输入联系电话',
    address: '请选择地点',
    address1: '请输入详细地址',
    ACL: 0,
    createdAt: "2018-11-11",
    updatedAt: '',

    openid: '1',
    userInfo: {},
    creating: false,
    button: {
      txt: '新建',
      txt1:'更改',
    },
    _id:'',
    
    buttontype:false,  //用于更改button上显示的文字
    modalHidden: true, //用于隐藏button栏不能反复点击
    updatatype:false, //用于确定数据是否有用户表数据
    show: true
  },

  // 设置物品名称
  bindKeyInput: function(e) {
    this.setData({
      'tel': e.detail.value
    });
  },

  bindKeyInput2: function(e) {
    this.setData({
      'address1': e.detail.value
    })
  },

  // 设置物品地点
  chooseLocation: function() {
    var that = this;

    wx.chooseLocation({
      success: function(res) {
        that.setData({
          'address': res.address,
        })
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },

  _getOnQuery(DB, where) {
    return new Promise((resolve, reject) => {
      this._onQuery(DB, where, resolve, reject)
    })
  },


  // 隐藏提示弹层
  modalChange: function(e) {
    this.setData({
      modalHidden: true
    })
  },
  //更新用户表数据
  onCounterInc: function () {
    const db = wx.cloud.database()
    
    db.collection('user_table').doc(this.data._id).update({
      data: {
        tel: this.data.tel, //联系方式
        username: this.data.userInfo.nickName, //昵称
        address1: this.data.address1, //定位地址
        address: this.data.address, //详细地址
        ACL: this.data.ACL, //权限
       // createdAt: this.data.createdAt, //注册时间
        updatedAt: this.data.createdAt, //更新时间
      },
      success: res => {
        this.setData({
          tel: this.data.tel, //联系方式
          username: this.data.userInfo.nickName, //昵称
          address1: this.data.address1, //定位地址
          address: this.data.address, //详细地址
          ACL: this.data.ACL, //权限
          // createdAt: this.data.createdAt, //注册时间
          updatedAt: this.data.createdAt, //更新时间
        })
      },
      fail: err => {
        icon: 'none',
          console.error('[数据库] [更新记录] 失败：', err)
      }
    })
  },
  // add database data
  onAdd: function() {
    var data = new Date();
    const db = wx.cloud.database()
    db.collection('user_table').add({
      data: {
        tel: this.data.tel, //联系方式
        username: this.data.userInfo.nickName, //昵称
        address1: this.data.address1, //定位地址
        address: this.data.address, //详细地址
        ACL: this.data.ACL, //权限
        createdAt: this.data.createdAt, //注册时间
        updatedAt: this.data.updatedAt //更新时间
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        this.setData({
          tel: this.data.tel, //联系方式
          username: this.data.userInfo.nickName, //昵称
          address1: this.data.address1, //定位地址
          address: this.data.address, //详细地址
          ACL: this.data.ACL, //权限
          createdAt: this.data.createdAt, //注册时间
          updatedAt: this.data.updatedAt //更新时间
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
  createTask: function() {

    // console.log(this.data)
    wx.showToast({
      title: '新建中',
      icon: 'loading',
      duration: 10000
    });
    //如果没有注册那么会新建 注册了就更新数据
   if(!this.data.updatatype)
   {
     this.onAdd(); 
   }else
   {
     //
     this.onCounterInc();
   }
   console.log("cuntshislntonadiothjsnl-------")
    wx.hideToast();
    wx.switchTab({
      url: '/pages/my/my',
    })
  },

  // 提交、检验
  bindSubmit: function(e) {
    var that = this;

    // console.log(this.data);
    if (that.data.tel == '' || that.data.address == '' || that.data.address1 == '') {
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

  onShow: function() {
    // 恢复新建按钮状态
    
    this.setData({
      'creating': false,
    });
    console.log(this.data)
  },

  onHide: function() {},

  // 初始化设置
  onLoad: function() {
    wx.showLoading() //加载loading
    var that = this;
    var now = new Date();
    //对获取的openid判断 如何存在就setdata
    var appopenid =getApp().globalData.openid;
    console.log("this is opendid"+appopenid)
    if(appopenid=='')
    {
      appopenid="";
    }else
    {
      this.setData({
        openid: getApp().globalData.openid
      })
      wx.hideLoading()
    }
    const detail = this._getOnQuery('user_table', '')
    // 初始化打卡时间
    that.setData({
      'createdAt': util.getYMD(now),
    });

    // 初始化昵称
    app.getUserInfo(function(userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      });
    });

    that._getOnQuery('user_table', '')
      .then(res => {
        
        if(res=="")
        {
          //如果查询不到东西 按键显示字符“新建”
          this.setData({
            buttontype:false,
            updatatype: false, 
            
          })
          console.log("please register!!")
        }
        else{
          //console.log(res[0]._id)
          //按键显示字符“新建”
          this.setData({
            buttontype: true,
            updatatype: true, //用于确定数据是否有用户表数据
            
          })
          console.log('data:->', this.data)
          console.log('获取', res[0]._openid)
          console.log('用户', this.data.openid)

          if (res[0]._openid == this.data.openid) {
            that.setData({
              tel: res[0].tel,
              address: res[0].address,
              address1: res[0].address1,
              ACL: res[0].ACL,
              _id: res[0]._id,
              createdAt: res[0].createdAt,
              updatedAt: res[0].updatedAt
            })
          }
          wx.hideLoading()
        }
     
      })

  },

  observer: function () { 
    ob:true
  },

  //数据查询
  _onQuery: function(DB, where, resolve, reject) {
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection(DB).where({
      _openid: this.data.openid
    }).get({
      success: res => {
        this.setData({
          queryResult: JSON.stringify(res.data, null, 2)
        })
        console.log('[数据库] [查询记录] 成功: ', res.data)
        resolve(res.data) //promise成功测试
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
        reject() //promise失败测试
      }
    })
  },

})