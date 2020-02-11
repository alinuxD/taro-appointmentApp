import Taro, { Component } from '@tarojs/taro'
import {View, Text, Button} from '@tarojs/components'
import './clinicSelectPage.css'



export default class ClinicSelectPage extends Component {

  config = {
    navigationBarTitleText: '选择门诊'
  }

  constructor(props) {
    super(props);

  }

  toDocAppointmentPage(){
    Taro.navigateTo({url:'/pages/docAppointment/docAppointmentPage'})
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='clinicSelect'>
        {/*<View style={{width:'100%',textAlign:'center',marginTop:'10px'}}>*/}
        {/*  <Text style={{fontSize:'30px'}}>门诊</Text>*/}
        {/*</View>*/}
        <View style={{height: '50px', width: '100%', textAlign: 'center', backgroundColor: '#164883'}}>
          <Text style={{fontSize: '18px', color: '#ffffff', lineHeight: '50px'}}>门诊</Text>
        </View>

        <Button style='margin:15px' onClick={()=>this.toDocAppointmentPage()}>骨科</Button>
      </View>
    );
  }
}
