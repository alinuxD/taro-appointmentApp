import Taro, { Component } from "@tarojs/taro"
import {View, Text, Button, Image, SwiperItem,Swiper} from "@tarojs/components"
import {AtButton} from "taro-ui";
import {icon} from '../../goblaData'


export default class Login extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}



  // login() {
  //   console.log('start login')
  //   Taro.cloud
  //     .callFunction({
  //       name: 'login',
  //     })
  //     .then(res => {
  //       console.log('用户信息', res)
  //       this.setState({
  //         userInfo: res.result,
  //       })
  //     })
  //     .catch(console.log)
  //   console.log('end login')
  // }

  getUserInfo(e) {
    console.log(e);
    const { detail } = e;
    if (detail.errMsg.endsWith('ok')) {
      const userInfo = JSON.parse(detail.rawData);
      const { nickName, gender, avatarUrl } = userInfo;
      Taro.cloud
        .callFunction({
          name: 'postUserInfo',
          data: {
            nickName: nickName,
            gender: gender,
            avatarUrl: avatarUrl,
          },
        })
        .then(res => {
          console.log('用户信息', res)
          this.props.onLoginChange(

             {
            userInfo: res.result,
            isLogin: true,
            context: {res}
          }
          );

        })
    }

  }


  render() {
    const sotrePicture = <Image src={icon} style={{paddingTop:'10%',height:'280px'}}/>

    return (
      <View className='index'>
        {/*<Text>context：{JSON.stringify(this.props.context)}</Text>*/}
        <View style={{height: '50px', width: '100%', textAlign: 'center', backgroundColor: '#164883'}}>
          <Text style={{fontSize: '18px', color: '#ffffff', lineHeight: '50px'}}>崇仁大药房预约程序</Text>
        </View>
        <View style={{textAlign: 'center', width: '100%', height: '20%'}}>
          {sotrePicture}
        </View>
        <View style={{width: '100%', position: 'fixed', bottom: '30px'}} >
          <Button
            openType='getUserInfo'
            // onoenType={global.store.user.token ? '' : 'getUserInfo'}
            onGetUserInfo={this.getUserInfo}
            style={{margin: '15px'}}
          >
            授权登陆
          </Button>
        </View>
      </View>
    );
  }
}
