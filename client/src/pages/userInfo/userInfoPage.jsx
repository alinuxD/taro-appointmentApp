import Taro, { Component } from '@tarojs/taro'
import {View, Text,Picker} from '@tarojs/components'
import {AtInput, AtForm, AtButton, AtMessage, AtListItem, AtToast} from "taro-ui"


export default class ConfirmPage extends Component {

  config = {
    navigationBarTitleText: '确认信息'
  }

  constructor(props) {
    super(props);
    this.state = {
      name :'' ,
      selector: ['男', '女'],
      gender:0 ,
      birthday:'',
      phone:'',
      isOpened:false,
      toastText:'',
      loading:false,
      buttonDisabled:false,
    }
  }

  handleNameChange (value) {
    this.setState({
      name:value,
      isOpened:false
    })
    // 在小程序中，如果想改变 value 的值，需要 `return value` 从而改变输入框的当前值
    return value
  }

  handlePhoneChange (value) {
    this.setState({
      phone: Number(value),
      isOpened:false
    })
    // 在小程序中，如果想改变 value 的值，需要 `return value` 从而改变输入框的当前值
    return value
  }

  onChange = e => {
    this.setState({
      gender: Number(e.detail.value)+1,
      isOpened:false
    })
  }

  onDateChange = e => {
    this.setState({
      birthday: e.detail.value,
      isOpened:false
    })
  }

  testInputData(){
    if (this.state.name==''){
      this.setState({toastText:'姓名不能为空！',isOpened:true})
      return false
    }else if (this.state.gender==0) {
      this.setState({toastText:'性别不能为空！',isOpened:true})
      return false
    }else if (this.state.birthday==''){
      this.setState({toastText:'生日不能为空！',isOpened:true})
      return false
    }else if (this.state.phone==''||this.state==0) {
      this.setState({toastText:'电话不能为空！',isOpened:true})
      return false
    }
    return true
  }

  getUserInfo(){
    Taro.cloud.callFunction({
      name:'getUserInfo'
    }).then(res=>{
      this.setState(res.result)
    })
  }

  backUpPage(){
    Taro.navigateBack(1);
  }

  changeUserInfo(){

    if (this.testInputData()){
      this.setState({loading:true,buttonDisabled:true})
      Taro.cloud
        .callFunction({
          name: 'changeUserInfo',
          data: {
            name: this.state.name,
            gender: this.state.gender,
            phone: this.state.phone,
            birthday: this.state.birthday
          },
        }).then(res=>{
        if (res.errMsg.endsWith('ok')){
          Taro.atMessage({
            'message': '修改成功',
            'type': 'success',
          })
        }else {
          Taro.atMessage({
            'message': '修改失败',
            'type': 'error',
          })
        }
        setTimeout(this.backUpPage.bind(this),2000)
      })
    }
  }

  componentWillMount () {

  }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () {
    this.getUserInfo()
  }

  componentDidHide () { }

  dateFormat(fmt, date) {
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



  render () {
    {console.log(this.state)}
    const {isOpened,toastText,loading,buttonDisabled} = this.state
    return (
      <View >
        <AtMessage />
        <View style={{height:'50px',width: '100%', textAlign: 'center',backgroundColor: '#164883'}}>
          <Text style={{fontSize: '18px',color: '#ffffff',lineHeight:'50px'}}>个人信息</Text>
        </View>

      <AtForm>
        <AtInput
          name='name'
          title='姓名'
          placeholder='姓名'
          type='text'
          value={this.state.name}
          onChange={this.handleNameChange.bind(this)}
        />
        <AtInput
          name='phone'
          title='电话号码'
          placeholder='电话号码'
          type='phone'
          value={this.state.phone}
          onChange={this.handlePhoneChange.bind(this)}
        />
        <Picker mode='selector' range={this.state.selector} onChange={this.onChange}>
          <AtListItem
            name='sex'
            title='性别'
            arrow='right'
            // placeholder='性别'
            // type='text'
            extraText={this.state.selector[Number(this.state.gender)-1]}
          />
        </Picker>
        <Picker mode='date' onChange={this.onDateChange}>
          <AtListItem
            name='birthday'
            title='出生日期'
            arrow='right'
            // placeholder='出生日期'
            // type='text'
            extraText={this.state.birthday}
          />
        </Picker>

      </AtForm>

        <View style='padding: 15px  15px  40px 15px '>
          <AtButton type='primary' size='normal' loading={loading} disabled={buttonDisabled} onClick={()=>this.changeUserInfo()}>确认</AtButton>
        </View>
        <AtToast isOpened={isOpened} text={toastText} status='error' ></AtToast>
      </View>
    );
  }
}
