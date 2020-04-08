var app = getApp();

var selfstures = require('../../articlesres/self_studyarts.js')
var experres = require('../../articlesres/experimentarts.js')
var newsres = require('../../articlesres/newsarts.js');
const newsarts = require('../../articlesres/newsarts.js');
var util = require('../../utils/util.js')

var ArticlesDB = wx.cloud.database().collection("articles")

Page({
  data: {
    swiperart: [],
    //导航被点击索引
    currentIndexnav: 0,
    navlist: [{
      "id": 0,
      "text": "自 习",
    }, {
      "id": 1,
      "text": "实 验",
    }, {
      "id": 2,
      "text": "视 野",
    }],
    allarticles: [],
    articles: [],
    selfstuarts: [],
    labarts: [],
    horizonarts: [],
    swiperarts: [],
    _id: ""
  },

  showDetail: function(event) {
    wx.navigateTo({
      url: '../index/index'
    })
  },
  clickarticle(event){
    this.setData({
      _id: event.currentTarget.dataset.id
    })
  },

  compare: function(obj1, obj2){
    var val1 = obj1.view
    var val2 = obj2.view
    if(val1 < val2) {
      return 1;
    } else if(val1 > val2){
      return -1;
    } else{
      return 0;
    }
  },

  Loadarticles: function(){
    wx.stopPullDownRefresh()
    var that = this
    that.setData({
      selfstuarts: [],
      labarts: [],
      horizonarts: [],
    })
    ArticlesDB.get({
      success(res){
        console.log("success", res.data)
        for(var i = 0; i < res.data.length; i++){
          if(res.data[i].type === "self_study"){
            that.data.selfstuarts.push(res.data[i])
          }
          else if(res.data[i].type === "experiment"){
            that.data.labarts.push(res.data[i])
          }
          else if(res.data[i].type === "horizon"){
            that.data.horizonarts.push(res.data[i])
          }
          that.data.allarticles.push(res.data[i])
        }
      },
      fail(res){
        console.log("fail", res)
      }
    })
    wx.showToast({
      title: 'Loading....',
      icon: 'loading',
      duration: 4000
    })

    setTimeout(function(){
      that.data.selfstuarts.sort(that.compare)
      that.data.labarts.sort(that.compare)
      that.data.horizonarts.sort(that.compare)
      if(that.data.currentIndexnav === 0){
          that.setData({
          articles: that.data.selfstuarts
        })
      }
      else if(that.data.currentIndexnav === 0){
          that.setData({
          articles: that.data.labarts
        })
      }
      else if(that.data.currentIndexnav === 0){
          that.setData({
          articles: that.data.horizonarts
        })
      }
      
    }, 4000)

  },

  onLoad: function () {
    
    var that = this
    that.setData({
      swiperart: []
    })

    var swipertemp = []
    wx.cloud.callFunction({
      name: "getdatabase",
      data: {
        name: "swiperarticles",
      },
      success(res){
        for(var i = 0; i < res.result.data.length; i++){
          swipertemp.push(res.result.data[i])
        }
      },
    })
    that.Loadarticles()
    setTimeout(function(){
      that.setData({
        swiperart: swipertemp
      })
    }, 2000)
    
  },
  //点击首页导航
  activeNav: function(e){
    this.setData({
      currentIndexnav: e.target.dataset.index,
    })
    if(e.target.dataset.index === 0){
        this.setData({
        articles: this.data.selfstuarts
      })
    }
    else if(e.target.dataset.index === 1){
      this.setData({
        articles: this.data.labarts
      })
    }
    else if(e.target.dataset.index === 2){
      this.setData({
        articles: this.data.horizonarts
      })
    }
  },
  onPullDownRefresh(){
    this.Loadarticles()
  }
})