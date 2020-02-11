const cloud = require("wx-server-sdk");
cloud.init();
const db = cloud.database();
const apponitmentCollection = db.collection("appointment");

exports.main = async event => {
  const { OPENID } = cloud.getWXContext();
  const { appointDate, selectedTime } = event;

  const array = appointDate.split("-");
  let date = new Date();
  date.setFullYear(Number(array[0]), Number(array[1] - 1), Number(array[2]));
  date.setHours(0, 0, 0, 0);

  try {
    const [appointmentRecord] = (
      await apponitmentCollection
        .where({
          openId: OPENID,
          appointDate: new Date(appointDate)
        })
        .get()
    ).data;
    if (!!appointmentRecord) {
      //当天已存在预约

      return {
        code: 500,
        message: "当天已存在预约,请返回上一步重选日期"
      };
    } else {
      await apponitmentCollection.add({
        data: {
          openId: OPENID,
          appointDate: date,
          selectedTime: selectedTime
        }
      });

      return {
        code: 1,
        message: "预约完成"
      };
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
