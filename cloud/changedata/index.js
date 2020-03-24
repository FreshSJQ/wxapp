// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  name = event.name
  _id = event._id
  tdata = event.tdata
  return cloud.database().collection(name).doc(_id).update({
    data: tdata
  })
}