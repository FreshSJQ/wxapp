var app = getApp();

var selfstures = require('../../articlesres/self_studyarts.js')
var experres = require('../../articlesres/experimentarts.js')
var newsres = require('../../articlesres/newsarts.js');
const newsarts = require('../../articlesres/newsarts.js');
var util = require('../../utils/util.js')

var DB = wx.cloud.database().collection("articles")


Page({
  data: {
    swiperart: [{
      "viewid": "5",
      "imgsrc": "../../images/navarticle/navarticle1.jpg",
      "name": "“你不必一开始就闪闪发光”，那你要什么时候发光？",
      "_id": "TMbVjnXGpOZ8Zj0E4NHEByhFgWYmLqLRkER9sn9eLgK4lGAD",
     }, {
       "viewid": "17",
      "imgsrc": "../../images/navarticle/navarticle2.jpg",
      "name": "肖战粉丝举报事件：不只是简单的亚文化之争",
      "_id": "cv7ZtwydqN3yxsuTCn0VugAjeKygCbqhiwmBH10R0s9tUO5F",

     }, {
       "viewid": "13",
      "imgsrc": "../../images/navarticle/navarticle3.jpg",
      "name": "信息时代在等，等一个“全民新闻素养”的时代",
      "_id": "RuD2NIsO1cUO8a7Sk5tnZV6Khz9s5CmeywjUvG2iAkFg9fDp",

     }, 

    ],
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
      "text": "新 闻",
    }],
    articles: [],
    selfstuarts: [],
    labarts: [],
    newsarts: [],
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

  onLoad: function () {
    var that = this
    var temp = []
    setTimeout(function(){
      temp.sort(function(obj1, obj2){
        var val1 = obj1.view
        var val2 = obj2.view
        if(val1 < val2) {
          return 1;
        } else if(val1 > val2){
          return -1;
        } else{
          return 0;
        }
      })
      that.setData({
        selfstuarts: temp,
        articles: temp
      })
    }, 3000)

    for(var i = 0; i < selfstures.articles.length; i++){
      DB.where({
        _id: selfstures.articles[i]._id
      }).get({
        success(res){
          temp.push(res.data[0])
        },
        fail(res){
          console.log("fail", res)
        }
      })
    }

    wx.showToast({
      title: 'Loading....',
      icon: 'loading',
      duration: 3000
    })
    that.data.labarts = []
    for(var i = 0; i < experres.articles.length; i++){
      DB.where({
        _id: experres.articles[i]._id
      }).get({
        success(res){
          that.data.labarts.push(res.data[0])
        },
        fail(res){
          console.log("fail", res)
        }
      })
    }
    setTimeout(function(){
        that.data.labarts.sort(function(obj1, obj2){
        var val1 = obj1.view
        var val2 = obj2.view
        if(val1 < val2) {
          return 1;
        } else if(val1 > val2){
          return -1;
        } else{
          return 0;
        }
      })
    }, 3000)
    that.data.newsarts = []
    for(var i = 0; i < newsres.articles.length; i++){
      DB.where({
        _id: newsres.articles[i]._id
      }).get({
        success(res){
          that.data.newsarts.push(res.data[0])
        },
        fail(res){
          console.log("fail", res)
        }
      })
    }
    setTimeout(function(){
      that.data.newsarts.sort(function(obj1, obj2){
      var val1 = obj1.view
      var val2 = obj2.view
      if(val1 < val2) {
        return 1;
      } else if(val1 > val2){
        return -1;
      } else{
        return 0;
      }
    })
  }, 3000)

  },
  onShow: function(){
    var that = this
    wx.stopPullDownRefresh()
    if(that.data._id !== ""){
      console.log("_id", that.data._id)
      DB.where({
        _id: that.data._id
      }).get({
        success(res){
          for(var i = 0; i < that.data.articles.length; i++){
            if(that.data.articles[i]._id == that.data._id){
              that.data.articles[i].view = res.data[0].view
              that.data.articles[i].good_num = res.data[0].good_num
              that.data.articles[i].comment = res.data[0].comment
              console.log("success refresh", res.data[0])
              break;
            }
          }
        },
      })
    }
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
        articles: this.data.newsarts
      })
    }
  },
  onPullDownRefresh(){
    console.log("fdsafsfasfsafdsafsafds")
    this.onShow()
    console.log("=================")
    for(var i = 0; i < this.data.articles.length; i++){
      console.log(i, " :", this.data.articles[i].view)
    }
  }
})