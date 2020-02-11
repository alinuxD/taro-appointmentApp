const cloud = require("wx-server-sdk");
cloud.init();
const db = cloud.database();
const userCollection = db.collection("user");

exports.main = async event => {
  const { OPENID } = cloud.getWXContext();
  const { nickName, gender, avatarUrl } = event;
  console.log("event", event);

  try {
    const [userRecord] = (
      await userCollection
        .where({
          openId: OPENID
        })
        .get()
    ).data;
    console.log("查到的用户信息", userRecord);
    if (!userRecord) {
      //用户不存在，在此新建用户
      await userCollection.add({
        data: {
          openId: OPENID,
          createdTime: db.serverDate(),
          nickName: nickName,
          gender: gender,
          avatarUrl: avatarUrl
        }
      });

      return {
        //code: 1,
        openId: OPENID,
        nickName,
        gender,
        avatarUrl,
        message: "用户不存在,已新建用户"
      };
    } else {
      await userCollection.doc(userRecord._id).update({
        data: {
          nickName,
          gender,
          avatarUrl
        }
      });
    }
    return {
      openId: OPENID,
      nickName,
      gender,
      avatarUrl
    };
  } catch (e) {
    console.log(e);
    return {
      code: 500,
      message: e
    };
  }
};
