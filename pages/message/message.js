// pages/message/message.js
var util = require('../../utils/util.js')
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    viewid: "",
    _id: "",
    view: 0,
    good_num: 0,
    comment: 0,
    name: "",
    url: "",
    imgsrc: "",
    showInput: false,
    comments: [],
    inputMessage: "",
    userInfo: {},
    hearttype: "heart.png"
  },

  changeParentData: function () {
    var pages = getCurrentPages();//当前页面栈    
    if (pages.length > 1) {    
      var beforePage = pages[pages.length - 2];//获取上一个页面实例对象
      beforePage.onLoad();//触发父页面中的方法
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this
    console.log(options._id)
    this.setData({
      _id: options._id,
    });
    var DB = wx.cloud.database().collection("articles");
    DB.where({
      _id: that.data._id
    }).get({
      success(res){
        that.setData({
          viewid: res.data[0].viewid,
          name: res.data[0].name,
          url: res.data[0].url,
          imgsrc: res.data[0].imgsrc,
          view: res.data[0].view,
          good_num: res.data[0].good_num,
          comment: res.data[0].comment
        })
      },
      fail(res){
        console.log("fail", res)
      }
    })
    wx.getUserInfo({
      success: function (res) {
          console.log(res);
          that.setData({
              userInfo: res.userInfo
          })
          wx.cloud.callFunction({
            name: "getopenid",
            success(res){
              that.data.userInfo["openid"]=res.result.openid
            }
          })
          console.log("current userInfo:", that.data.userInfo)
      }
  })
  setTimeout(function(){
    that.freshpage()
  }, 1000)
    wx.cloud.callFunction({
      name: "getcomment",
      data: {
        name: that.data.viewid
      },
      success(res){
        that.setData({
          comments: res.result.data
        })
      },
    })
    setTimeout(function(){
      that.data.view = that.data.view + 1
      wx.cloud.callFunction({
        name: "changedata",
        data: {
          name: "articles",
          _id: that.data._id,
          tdata: {
            view: that.data.view
          }
        },
        success(res){
          console.log("success view", res)
        },
        fail(res){
          console.log("fail view", res)
        }
      })
      that.changeParentData()
    }, 2000)
  },

  freshpage: function(){
    wx.stopPullDownRefresh()
    var that = this
    wx.cloud.callFunction({
      name: "getcomment",
      data: {
        name: that.data.viewid
      },
      success(res){
        console.log(res.result.data);
        that.setData({
          comments: res.result.data
        })
      },
    })
    setTimeout(function(){
      console.log("comment length", that.data.comments.length)
      wx.cloud.callFunction({
        name: "changedata",
        data: {
          name: "articles",
          _id: that.data._id,
          tdata: {
            comment: that.data.comments.length
          }
        },
        success(res){
          console.log("update comment success", res)
        },
        fail(res){
          console.log("update comment fail", res)
        }
      })
    },2000)
  },

  clickheart(){
    this.setData({
      hearttype: "heart_solid.png"
    })
    var that = this
    that.data.good_num = that.data.good_num + 1

    wx.cloud.callFunction({
      name: "changedata",
      data: {
        name: "articles",
        _id: that.data._id,
        tdata: {
          good_num: that.data.good_num
        }
      },
      success(res){
        console.log("update like success", res)
      },
      fail(res){
        console.log("update like fail", res)
      }
    })
    this.freshpage()
  },

  bindInputMsg: function(e){
    this.setData({
      inputMessage: e.detail.value
    })
  },

  showInput: function() {
    console.log("authorization", app.globalData.authorization)
    if(app.globalData.authorization === true){
      this.setData({
        showInput: true
      })
    }
    else{
      wx.showModal({
        title: '提示',
        content: '您还未登录，请登录后再评论，谢谢~',
        confirmText: '登录',
        cancelText: '取消',
        success(res){
          if(res.confirm){
            wx.switchTab({
              url: "../user/user"
            })
          }
          else if(res.cancel){
          }
        }
      })
    }
  },
  onHideInput: function() {
    this.setData({
      showInput: false
    })
  },

  sendTextMsg(){
    if(this.data.inputMessage !== ''){
      console.log("sendmsg")
      var that = this
      var DB = wx.cloud.database().collection("commentarticle" + this.data.viewid)
      var time = util.formatDate(new Date())

      DB.add({
        data: {
          userInfo: that.data.userInfo,
          content: that.data.inputMessage,
          time: time
        },
        success(res){
          console.log("添加评论成功", res)
          wx.cloud.callFunction({
            name: "changedata",
            data: {
              name: "articles",
              _id: that.data._id,
              tdata: {
                comment: that.data.comment + 1
              }
            },
            success(res){
              console.log("update comment success", res)
            },
            fail(res){
              console.log("update comment fail", res)
            }
          })
          that.freshpage()
        }
      })
      that.setData({
        inputMessage: ''
      })
    }
  },
  
  clickcomment(event){
    var that = this
    console.log("clickcomment", event.currentTarget.dataset.comment)
    var curcomment = event.currentTarget.dataset.comment
    if(curcomment.userInfo.openid === that.data.userInfo.openid){
      wx.showActionSheet({
        itemList: ['删除', '评论'],
        success(res){
          console.log("success",res)
          if(res.tapIndex === 0){
            that.deletecomment(curcomment._id)
          }
          else{
            wx.showModal({
              title: '提示',
              content: '敬请期待该功能~',
              success(res){
                if(res.confirm){
                }
                else if(res.cancel){
                }
              }
            })
          }
        },
        fail(res){
          console.log("fail", res)
        }
      })
    }
    else{
      wx.showActionSheet({
        itemList: ['评论'],
        success(res){
          if(res.tapIndex == 0){
            wx.showModal({
              title: '提示',
              content: '敬请期待该功能~',
              success(res){
                if(res.confirm){
                }
                else if(res.cancel){
                }
              }
            })
          }
        },
        fail(res){
          console.log("fail", res)
        }
      })
    }
    
    
  },

  deletecomment(id){
    var that = this
    wx.showModal({
      title: '提示',
      content: '删除后不可恢复哦~',
      success(res){
        if(res.confirm){
          var DB = wx.cloud.database().collection("commentarticle" + that.data.viewid)
          DB.doc(id).remove({
            success(res){
              console.log("delete success")
              that.freshpage()
            }
          })
        }
        else if(res.cancel){
          console.log('cancel')
        }
      }
    })
  },

  onPullDownRefresh(){
    this.freshpage()
  }
})