import Taro, { Component } from '@tarojs/taro'
import {View, Text,} from '@tarojs/components'
import {AtInput, AtToast, AtButton,AtListItem} from "taro-ui"


export default class ConfirmPage extends Component {

  config = {
    navigationBarTitleText: '确认信息'
  }

  toUserInfoPage(){
    Taro.navigateTo({url:'/pages/userInfo/userInfoPage'})
  }

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      isOpened: false,
      toastText: '',
      loading: false,
      disable: false,
      toastStatus:'',
      showReturnButton: false,
      showConfirmButton: true,
      showHomeButton: false
    };
  }

  timeFormat(selectedTime){
    let date = new Date();
    let time = selectedTime.split(':');
    date.setHours(Number(time[0], time[1], 0));
    date.setMinutes(date + 30);
  }

  getUserInfo(){
    Taro.cloud.callFunction({
      name:'getUserInfo'
    }).then(res=>{
      this.setState(res.result)
    })
  }

  postAppointment(){
    const {appointDate, selectedTime}= this.$router.params
    if (this.testName()) {
      Taro.cloud.callFunction({
        name:'postAppointment',
        data:{
          appointDate:appointDate,
          selectedTime:selectedTime
        }
      }).then(res=>{
        if (res.result.code==1){
          this.setState({isOpened:true, toastText:res.result.message, toastStatus: 'success', showReturnButton: false,showHomeButton:true,showConfirmButton:false})
        }else if (res.result.code==500){
          this.setState({isOpened:true, toastText:res.result.message, toastStatus: 'error', showReturnButton: true,showHomeButton:false,showConfirmButton:false})
        }
      })
    }
  }

  testName(){
    if (this.state.name==''){
      this.setState({isOpened:true,toastText:'请设置就诊人', toastStatus: 'error'})
      return false
    }else {
      return true
    }
  }

  backToHomePage() {
    const currentPage = Taro.getCurrentPages().length;
    Taro.navigateBack({ delta: currentPage-1 });
  }

  backToUpPage() {
    Taro.navigateBack({ delta: 1 });
  }

  componentWillMount () {
  }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () {
    this.getUserInfo()
  }

  componentDidHide () { }

  render () {
    const {appointDate, selectedTime}= this.$router.params
    const{name ,isOpened,toastText,loading,disable,toastStatus,showHomeButton} = this.state
    return (
      <View className='confirm'>
        <View style={{height: '50px', width: '100%', textAlign: 'center', backgroundColor: '#164883'}}>
          <Text style={{fontSize: '18px', color: '#ffffff', lineHeight: '50px'}}>挂号信息确认</Text>
        </View>

        <AtListItem title='店名（位置）'/>
        <AtListItem title='骨科'/>
        <AtListItem title='叶XX医生'/>
        <AtListItem title={'就诊时间：' + appointDate + '  ' + selectedTime}/>

        {
          this.state.showReturnButton ?
            <AtListItem title='就诊人：' extraText={name}/> :
            <AtListItem title='当前就诊人：' extraText={name} arrow='right' onClick={() => this.toUserInfoPage()} disabled={showHomeButton}/>
        }

        <View style='padding: 15px  15px  40px 15px '>
          {this.state.showReturnButton ?
            <AtButton type='primary' size='normal' onClick={() => this.backToUpPage()}>返回</AtButton> : null
          }

          {this.state.showConfirmButton ?
            <AtButton type='primary' size='normal' onClick={() => this.postAppointment()} loading={loading}
                      disabled={disable}>确认</AtButton> : null

          }

          {this.state.showHomeButton ?
            <AtButton type='primary' size='normal' onClick={() => this.backToHomePage()}>返回首页</AtButton> : null
          }

        </View>
        <AtToast isOpened={isOpened} text={toastText} status={toastStatus}></AtToast>
      </View>
    );
  }
}
