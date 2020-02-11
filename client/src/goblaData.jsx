export const docPng = 'cloud://dev-4yi6g.6465-dev-4yi6g-1300741789/DocPng.png';
export const storePng = 'cloud://dev-4yi6g.6465-dev-4yi6g-1300741789/sotre.png';
export const icon = 'cloud://dev-4yi6g.6465-dev-4yi6g-1300741789/icon.PNG';
export const inter1 = 'cloud://dev-4yi6g.6465-dev-4yi6g-1300741789/inter1.jpg';
export const inter2 = 'cloud://dev-4yi6g.6465-dev-4yi6g-1300741789/inter2.jpg';
export const inter3 = 'cloud://dev-4yi6g.6465-dev-4yi6g-1300741789/inter3.jpg';
export const inter4 = 'cloud://dev-4yi6g.6465-dev-4yi6g-1300741789/inter4.jpg';
 //获取日期，参数可获取前后几天的日子,days为0时为当天
export function getHopeDate(days){
  let date1 = new Date()
  let date2 = new Date(date1);
  date2.setDate(date1.getDate()+days);
  // let date = date2.getFullYear()+"-"+(date2.getMonth()+1)+"-"+date2.getDate();
  return date2
}

//格式化date xxxx/xx/xx
export function dateFormat(fmt, date) {
  let ret;
  const opt = {
    "Y+": date.getFullYear().toString(),        // 年
    "m+": (date.getMonth() + 1).toString(),     // 月
    "d+": date.getDate().toString(),            // 日
    "H+": date.getHours().toString(),           // 时
    "M+": date.getMinutes().toString(),         // 分
    "S+": date.getSeconds().toString()          // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (let k in opt) {
    ret = new RegExp("(" + k + ")").exec(fmt);
    if (ret) {
      fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
    };
  };
  return fmt;
}
