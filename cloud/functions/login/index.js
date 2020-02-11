const cloud = require("wx-server-sdk");
cloud.init();
const db = cloud.database();
const userCollection = db.collection("user");

exports.main = async () => {
  const { OPENID } = cloud.getWXContext();
  const wxContext = cloud.getWXContext();
  try {
    //根据openId查找数据库是否存在用户信息
    const [userRecord] = (
      await userCollection
        .where({
          openId: OPENID
        })
        .get()
    ).data;

    if (!userRecord) {
      await userCollection.add({
        data: {
          openId: OPENID,
          createdTime: db.serverDate(),
          name: wxContext.nickName,
          gender: wxContext.gender,
          avatarUrl: wxContext.avatarUrl
        }
      });
    }

    //获取所有的用户
    const allUser = (await userCollection.get()).data;
    //筛选出openid一样的用户
    const [userInfo] = allUser.filter(v => v.openId === OPENID);
    console.log("查到的userInfo", userInfo);
    let name, avatarUrl, gender;
    // 无记录，加记录
    if (!userInfo) {
      await userCollection.add({
        data: {
          openId: OPENID,
          createdTime: db.serverDate(),
          name: wxContext.nickName,
          gender: wxContext.gender,
          avatarUrl: wxContext.avatarUrl
        }
      });
      // 有记录，返回用户信息
    } else {
      name = userInfo.name;
      avatarUrl = userInfo.avatarUrl;
      gender = userInfo.gender;
    }
    return {
      name: name || null,
      avatarUrl: avatarUrl || null,
      gender: gender || null,
      openId: OPENID
    };
  } catch (e) {
    console.error(e);
    return {
      code: 500,
      message: "服务器错误"
    };
  }
};
