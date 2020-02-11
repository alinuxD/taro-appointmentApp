// 云函数入口文件
const cloud = require("wx-server-sdk");
cloud.init();
const db = cloud.database();
const collection = db.collection("appointment");
const userCollection = db.collection("user");
const adminCollection = db.collection("admin");

// 云函数入口函数
exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext();
  const { current, pageSize, appointDate } = event;

  const currentNum = Number(current);
  const pageSizeNum = Number(pageSize);

  let param = {};
  let orderParam = "";
  let orderParam2 = "";

  if (!appointDate) {
    param = { openId: OPENID };
    orderParam = "appointDate";
    orderParam2 = "desc";
  } else {
    //还得增加个查询管理员表的，做对比
    const managerData = await adminCollection
      .where({ openId: OPENID, isAdmin: true })
      .get();
    if (managerData.data.length) {
      param = { appointDate: new Date(appointDate) };
      orderParam = "selectedTime";
      orderParam2 = "asc";
    }
  }

  //获取记录总数
  const total = (await collection.where(param).count()).total;
  const returnData = [];

  const appointRecords = await collection
    .where(param)
    .orderBy(orderParam, orderParam2)
    .skip((currentNum - 1) * pageSizeNum)
    .limit(pageSizeNum)
    .get();

  for (let i = 0; i < appointRecords.data.length; i++) {
    let appointRecord = appointRecords.data[i];
    let openId = appointRecord.openId;
    const userInfo = await userCollection.where({ openId: openId }).get();
    if (userInfo.data.length > 0) {
      appointRecord.userInfo = userInfo.data[0];
    }
    returnData.push(appointRecord);
  }

  return {
    total: total,
    data: returnData
  };
};
