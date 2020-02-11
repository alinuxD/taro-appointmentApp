import Taro, { Component } from "@tarojs/taro"

import {View, Button, Image, Text, Swiper, SwiperItem,} from "@tarojs/components"
import {inter1, inter2, inter3, inter4} from "../../goblaData";

export default class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAdmin: false
    }
  }

  componentDidMount () {
    this.testAdminRule();
  }


  toClinicSelectPage(){
    Taro.navigateTo({url:'/pages/clinicSelect/clinicSelectPage'})
  }

  toUserInfoPage(){
    Taro.navigateTo({url:'/pages/userInfo/userInfoPage'})
  }

  toUserRecordPage() {
    Taro.navigateTo({url:'/pages/userRecord/userRecordPage'})
  }

  toManageRecordPage() {
    Taro.navigateTo({url:'/pages/manageRecord/manageRecordPage'})
  }

  toManagePatientPage() {
    Taro.navigateTo({url:'/pages/managePatient/managePatientPage'})
  }

  testAdminRule() {
    Taro.cloud.callFunction({
      name:'testAdminRule'
    }).then(res=>{
      if (res.errMsg.endsWith('ok')){
        const result = res.result.isAdmin;
        this.setState({
          isAdmin: result
        })
      }
    })
  }

  render() {
    const {isAdmin} = this.state;
    const avatar = <Image style={{width:'60px',height:'60px'}} src={this.props.userInfo.avatarUrl} />
    return (
      <View className='index'>
        <View style={{height: '50px', width: '100%', textAlign: 'center', backgroundColor: '#164883'}}>
          <Text style={{fontSize: '18px', color: '#ffffff', lineHeight: '50px'}}>首页</Text>
        </View>
        <View style={{textAlign:'center',marginTop:'20px'}}>
          <Swiper
            className='test-h'
            indicatorColor='#999'
            indicatorDots='true'
            indicatorActiveColor='#333'
            vertical='true'
            circular='true'
            autoplay='true'>
            <SwiperItem>
              <View className='demo-text-1'>
                <Image src={inter1}/>
              </View>
            </SwiperItem>
            <SwiperItem>
              <View className='demo-text-2'>
                <Image src={inter2}/>
              </View>
            </SwiperItem>
            <SwiperItem>
              <View className='demo-text-3'>
                <Image src={inter3}/>
              </View>
            </SwiperItem>
            <SwiperItem>
              <View className='demo-text-3'>
                <Image src={inter4}/>
              </View>
            </SwiperItem>
          </Swiper>
        </View>
        {/*<View style='margin:15px'>*/}
        {/*  {avatar}*/}
        {/*</View>*/}
        <Button style='margin:15px' onClick={() => this.toClinicSelectPage()}>预约看病</Button>
        <Button style='margin:15px' onClick={() => this.toUserRecordPage()}>预约记录</Button>
        <Button style='margin:15px' onClick={() => this.toUserInfoPage()}>个人信息</Button>
        {isAdmin ?
          <Button type='warn' style='margin:15px' onClick={() => this.toManageRecordPage()}>管理员查看预约记录入口</Button> : null}
        {isAdmin ? <Button type='warn' style='margin:15px'
                           onClick={() => this.toManagePatientPage()}>管理员查询病人信息入口</Button> : null}
      </View>
    );
  }
}
