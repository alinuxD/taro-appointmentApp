import Taro, { Component } from '@tarojs/taro'
import {View, Text, Image, Button} from '@tarojs/components'
import {AtButton, AtCalendar, AtList, AtListItem, AtMessage, AtModal, AtModalAction, AtToast} from 'taro-ui'
import {docPng,getHopeDate,dateFormat} from "../../goblaData";



export default class DocAppointmentPage extends Component {

  config = {
    navigationBarTitleText: '预约医生'
  }

  constructor(props) {
    super(props);
    this.state = {
      docInfo:{docName:'叶崇帆', docIntro:'专业骨科医生，多年整治疑难杂症。'},
      appointDate:'' ,
      selectedTime:'',
      isOpened:false,
      toastText:'',
      docPNG : docPng,
      modalIsOpened:false,
      tempDate: '',


    };
  }

  componentWillMount () { }

  componentDidMount () {
    //设置state中初始日子为第二天
    let nextDate = dateFormat('YYYY-mm-dd',getHopeDate(1))

    this.setState({
      appointDate:nextDate
    });
  }

  componentWillUnmount () { }

  componentDidShow () {
    this.setState({
      isOpened:false
    })
  }

  componentDidHide () { }


  toConfirmPage(appointDate,selectedTime) {
    if (!(appointDate==''||appointDate==null)){
      if (!(selectedTime==''||selectedTime==null))
        Taro.navigateTo({url:'/pages/confirm/confirmPage?appointDate='+appointDate+'&selectedTime='+selectedTime})
      else {
       this.setState({toastText:'尚未选取预约时间！',isOpened:true})
      }
    }else {
      this.setState({toastText:'尚未选取预约日期！',isOpened:true})
    }

  }

  handleTimeClick(value){
    this.setState({
      selectedTime: value,
      isOpened:false
    })
  }

  openCalendarModal() {
    this.setState({modalIsOpened: true})
  }

  handleCalendarClick(res) {
    this.setState({tempDate: res})
  }

  handleModalConfirm() {
    const {tempDate} = this.state;
    this.setState( {
      modalIsOpened: false,
      appointDate: tempDate
    })

  }

  handleModalCancel() {
    this.setState( {modalIsOpened: false})
  }

  //设置时间按钮
  setTimeButton(el,selectedTime){
    const morning = ['08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30']
    const afternoon = ['14:30','15:00','15:30','16:00','16:30','17:00','17:30']
    const evening = ['19:30','20:00','20:30']

    let timetable=[]

    if (el=='morning'){
      timetable = morning;
    }else if (el=='afternoon'){
      timetable = afternoon;
    }else if (el == 'evening') {
      timetable = evening;
    }
    let timesButton = timetable.map((item) => (
      item == selectedTime ?
        (<View className='at-col at-col-2 at-col--auto' style={{margin:'5px'}}><AtButton type='primary' size='small'   onClick={this.handleTimeClick.bind(this,item)}>{item}</AtButton></View>) :
        (<View className='at-col at-col-2 at-col--auto' style={{margin:'5px'}}><AtButton type='secondary' size='small'   onClick={this.handleTimeClick.bind(this,item)}>{item}</AtButton></View>)
    ))

    return timesButton;
  }


  render () {
    const {selectedTime ,appointDate ,isOpened,toastText,docPNG,modalIsOpened} = this.state
    console.log(selectedTime +'日期'+appointDate);


    return (
      <View>
        <AtMessage />
        <View className='doctorInfo' style={{width: '100%', height: '110px', backgroundColor: '#164883'}}>
          <Image src={docPNG} style={{
            marginLeft: '15px',
            marginTop: '10px',
            marginBottom: '10px',
            height: '90px',
            width: '67px',
            float: 'left'
          }}
          />
          <Text style={{
            marginLeft: '30%',
            height: '110px',
            lineHeight: '110px',
            fontSize: '30px',
            color: '#ffffff',
            fontWeight: 'bold'
          }}
          >{this.state.docInfo.docName}</Text>

        </View>

        <View style={{backgroundColor: '#698eb8', padding: '10px'}}>
          <Text style={{color: '#ffffff'}}>
            医生简介：{this.state.docInfo.docIntro}
          </Text>
        </View>

        <AtList>
          <AtListItem title='选择日期:' extraText={appointDate} onClick={()=>this.openCalendarModal()} />
        </AtList>

        <AtModal isOpened={modalIsOpened} closeOnClickOverlay={false}>
          <AtCalendar minDate={getHopeDate(0)} maxDate={getHopeDate(7)}  currentDate={appointDate} onDayClick={(item: { value: String })=>this.handleCalendarClick(item.value)} />
          <AtModalAction>
            <Button onClick={()=>this.handleModalCancel()}>取消</Button>
            <Button onClick={()=>this.handleModalConfirm()}>确定</Button>
          </AtModalAction>
        </AtModal>


        <Text style='margin-left:15px'>上午</Text>
        <View className='at-row at-row--wrap' >
          {this.setTimeButton('morning',selectedTime)}
        </View>

        <Text style='margin-left:15px'>下午</Text>
        <View className='at-row at-row--wrap' >
          {this.setTimeButton('afternoon',selectedTime)}
        </View>

        <Text style='margin-left:15px'>晚上</Text>
        <View className='at-row at-row--wrap' >
          {this.setTimeButton('evening',selectedTime)}
        </View>

        <View style={{margin:' 15px  15px  40px 15px'}}>
          <AtButton  type='primary' onClick={()=>this.toConfirmPage(appointDate,selectedTime)}>下一步</AtButton>
        </View>
        <AtToast isOpened={isOpened} text={toastText} status='error'  />
      </View>
    );
  }
}
