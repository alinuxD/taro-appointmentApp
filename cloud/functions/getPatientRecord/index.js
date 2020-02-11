// 云函数入口文件
const cloud = require("wx-server-sdk");
cloud.init();
const db = cloud.database();
const userCollection = db.collection("user");
const adminCollection = db.collection("admin");

// 云函数入口函数
exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext();
  const { current, pageSize, searchBarValue } = event;

  const currentNum = Number(current);
  const pageSizeNum = Number(pageSize);

  // //还得增加个查询管理员表的，做对比
  //
  // const managerData = await adminCollection
  //   .where({ openId: OPENID, isAdmin: true })
  //   .get();
  // if (managerData.data.length) {
  // }

  //获取记录总数
  const total = (
    await userCollection
      .where({
        name: {
          $regex: ".*" + searchBarValue + ".*",
          $options: "i"
        }
      })
      .count()
  ).total;

  let returnData = [];

  const userInfoRecords = await userCollection
    .where({
      name: {
        $regex: ".*" + searchBarValue + ".*",
        $options: "i"
      }
    })
    .orderBy("name", "asc")
    .skip((currentNum - 1) * pageSizeNum)
    .limit(pageSizeNum)
    .get();

  returnData = userInfoRecords.data;
  // for (let i = 0; i < appointRecords.data.length; i++) {
  //   let appointRecord = appointRecords.data[i];
  //   let openId = appointRecord.openId;
  //   const userInfo = await userCollection.where({ openId: openId }).get();
  //   if (userInfo.data.length > 0) {
  //     appointRecord.userInfo = userInfo.data[0];
  //   }
  //   returnData.push(appointRecord);
  // }

  return {
    total: total,
    data: returnData
  };
};
