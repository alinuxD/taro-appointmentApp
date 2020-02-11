import Taro, { Component } from '@tarojs/taro'
import {View, Text,Button} from '@tarojs/components'
import {AtList, AtButton, AtListItem, AtPagination, AtModal, AtCalendar,AtModalAction} from "taro-ui"
import {getHopeDate,dateFormat} from "../../goblaData";


export default class manageRecordPage extends Component {

  config = {
    navigationBarTitleText: '管理员查看预约记录'
  }

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      total: 0,
      current: 1,
      pageSize: 10,
      selectedDate:'',
      userInfoContent: '',
      userInfoIsOpened:false,
      modalIsOpened: false,
      recordData: []
    };
  }

  getUserInfo(){
    Taro.cloud.callFunction({
      name:'getUserInfo'
    }).then(res=>{
      this.setState(res.result)
    })
  }

  getAppointRecord() {
    const{current,pageSize,selectedDate}= this.state
    Taro.cloud.callFunction({
      name:'getAppointRecord',
      data: {
        appointDate: selectedDate,
        current: Number(current),
        pageSize: Number(pageSize)
      }
    }).then(res=>{
      console.log(res);
      this.setState({
        recordData:res.result.data,
        total: res.result.total
      })
    })
  }

  setAtListItem() {
    const {recordData} = this.state
    let atList = recordData.map((item) =>
      (<AtListItem title={item.selectedTime} extraText={item.userInfo? item.userInfo.name:'null'} arrow='right'
                   onClick={()=>this.setAtModal(item.userInfo)} />) )

    return atList
  }

  setAtModal(userInfo) {
    let context = 'null'
    if (userInfo){
      const {name,phone,birthday,gender} = userInfo
      const birthdayStr = birthday.substr(0, 10);
      const currentYear = (new Date()).getFullYear();
      const birthYear = (new Date(birthdayStr)).getFullYear();
      const age = currentYear - birthYear;
      const sex = (gender - 1) ? '女' : '男'
      context = '姓名：' + name + '\n性别：' + sex +'\n年龄：'+age+ '\n电话号码：' + phone;
    }



    this.setState({
      userInfoContent: context,
      userInfoIsOpened:true,
    })
  }

  handlePageChange(e) {
    this.setState({current: e.current})

  }

  openCalendarModal() {
    this.setState({modalIsOpened: true})
  }

  handleCalendarClick(res) {
    this.setState({selectedDate: res})
  }

  handleModalConfirm() {
    this.setState( {
      modalIsOpened: false,
    })

    this.getAppointRecord()

  }

  handleModalCancel() {
    this.setState( {modalIsOpened: false})
  }


  backToHomePage() {
    const currentPage = Taro.getCurrentPages().length;
    Taro.navigateBack({ delta: currentPage-1 });
  }

  componentWillMount () {
    const currentDate = getHopeDate(0);
    this.setState({
      selectedDate:dateFormat('YYYY-mm-dd',currentDate)
    })
  }

  componentDidMount () {
    this.getAppointRecord();
  }

  componentWillUnmount () { }

  componentDidShow () {
    // this.getUserInfo();
  }

  componentDidHide () { }

  render () {

    const{userInfoContent , total,pageSize,selectedDate,modalIsOpened,userInfoIsOpened} = this.state
    return (
      <View className='userRecord'>
        <View style={{height: '50px', width: '100%', textAlign: 'center', backgroundColor: '#164883'}}>
          <Text style={{fontSize: '18px', color: '#ffffff', lineHeight: '50px'}}>预约记录</Text>
        </View>


        <AtList>
          <AtListItem title='选择日期:' extraText={selectedDate} onClick={()=>this.openCalendarModal()} />
          <AtListItem title='该日预约总人数:' extraText={total.toLocaleString()}  />
          {this.setAtListItem()}
        </AtList>

        <AtPagination current={this.state.current} total={total} pageSize={pageSize} onPageChange={(e)=>this.handlePageChange(e)} />
        <View style='padding: 15px  15px  40px 15px '>
          <AtButton type='primary' size='normal' onClick={() => this.backToHomePage()}>返回首页</AtButton>
        </View>
        <AtModal isOpened={modalIsOpened} closeOnClickOverlay={false}>
          <AtCalendar currentDate={selectedDate} onDayClick={(item: { value: String })=>this.handleCalendarClick(item.value)} />
          <AtModalAction>
            <Button onClick={()=>this.handleModalCancel()}>取消</Button>
            <Button onClick={()=>this.handleModalConfirm()}>确定</Button>
          </AtModalAction>
        </AtModal>
        <AtModal isOpened={userInfoIsOpened} title='就诊人信息' content={userInfoContent} onClose={()=>this.setState({userInfoIsOpened:false})}  />
      </View>
    );
  }
}
