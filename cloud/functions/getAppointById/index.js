// 云函数入口文件
const cloud = require("wx-server-sdk");
cloud.init();
const db = cloud.database();
const collection = db.collection("appointment");

// 云函数入口函数
exports.main = async (event, context) => {
  const { openId } = event;

  //根据OPENID查最近10次预约记录
  const userRecord = await collection
    .where({
      openId: openId
    })
    .orderBy("appointDate", "desc")
    .limit(10)
    .get();

  return {
    data: userRecord.data
  };
};
