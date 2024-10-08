// pages/mine/mine.js
const app = getApp()
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isHide: false,
    authorpage: false,
    authorization: false,
    userInfo: null,
    exitpage: false
  },
  onLoad: function (options) {
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              app.globalData.userInfo = res.userInfo
              app.globalData.authorization = true
              that.setData({
                userInfo: res.userInfo,
                authorization: true
              });
              // 用户已经授权过,不需要显示授权页面,所以不需要改变 isHide 的值
              // 根据自己的需求有其他操作再补充
              // 我这里实现的是在用户授权成功后，调用微信的 wx.login 接口，从而获取code
              wx.login({
                success: res => {
                  // 获取到用户的 code 之后：res.code
                  // console.log("用户的code:" + res.code);
                }
              });
            }
          });
        } else {
          // 用户没有授权
          // 改变 isHide 的值，显示授权页面
          that.setData({
            isHide: true
          });
        }
      }
    });
  },

  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      // 获取到用户的信息了，打印到控制台上看下
      console.log("用户的信息如下：");
      console.log(e.detail.userInfo);
      //授权成功后,通过改变 isHide 的值，让实现页面显示出来，把授权页面隐藏起来
      that.setData({
        isHide: false,
        userInfo: e.detail.userInfo,
        authorization: true,
      });
      app.globalData.authorization = true
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
        // 用户没有授权成功，不需要改变 isHide 的值
        if (res.confirm) {
          console.log('用户点击了“返回授权”');
        }
        }
      });
    }
  },
  authorizeUser: function(){
    this.setData({
      authorpage: true,
      authorization: true
    })
    app.globalData.authorization = false
  },
  confirmexitUser: function() {
    this.setData({
      isHide: true,
      authorpage: false,
      exitpage: false,
      authorization: false
    })
    app.globalData.authorization = false
  },
  cancleexitUser: function() {
    this.setData({
      exitpage: false
    })
  },

  exitUser: function(){
    this.setData({
      exitpage: true
    })
  },

  onPullDownRefresh(){
    wx.stopPullDownRefresh()
  }
})

