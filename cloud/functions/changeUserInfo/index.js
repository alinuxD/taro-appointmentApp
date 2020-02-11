const cloud = require("wx-server-sdk");
cloud.init();
const db = cloud.database();
const userCollection = db.collection("user");

exports.main = async event => {
  const { OPENID } = cloud.getWXContext();
  const { name, gender, birthday, phone } = event;

  let array = birthday.split("-");
  let date = new Date();
  date.setFullYear(Number(array[0]), Number(array[1] - 1), Number(array[2]));
  date.setHours(0, 0, 0, 0);

  try {
    const [userRecord] = (
      await userCollection
        .where({
          openId: OPENID
        })
        .get()
    ).data;
    if (!userRecord) {
      //用户不存在，在此新建用户

      return {
        code: 1,
        message: "用户不存在"
      };
    } else {
      await userCollection.doc(userRecord._id).update({
        data: {
          name: name,
          gender: gender,
          birthday: date,
          phone: phone
        }
      });
    }
    // return {
    //   openId: OPENID,
    //   nickName,
    //   gender,
    //   avatarUrl
    // };
  } catch (e) {
    console.log(e);
    return {
      code: 500,
      message: e
    };
  }
};
