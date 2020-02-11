import Taro, { Component } from '@tarojs/taro'
import {View, Text,} from '@tarojs/components'
import {AtList, AtButton, AtListItem, AtPagination, AtModal} from "taro-ui"


export default class userRecordPage extends Component {

  config = {
    navigationBarTitleText: '预约记录'
  }

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      total: 0,
      current: 1,
      pageSize: 10,
      modalContent: '',
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
    const{current,pageSize}= this.state
    Taro.cloud.callFunction({
      name:'getAppointRecord',
      data: {
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
      (<AtListItem title={item.appointDate.substr(0,10)} extraText={item.selectedTime} arrow='right'
                   onClick={()=>this.setAtModal(item.appointDate.substr(0,10),item.selectedTime)} />) )

    return atList
  }

  setAtModal(appointDate,selectedTime) {
    const {name,} = this.state
    const context = '就诊人：' + name + '  \n预约时间：' + appointDate + '  ' + selectedTime;
    this.setState({
      modalContent: context,
      modalIsOpened: true,
    });
  }

  handlePageChange(e) {
    this.setState({current: e.current})

  }

  handleModalConfirm() {
    this.setState( {modalIsOpened: false})
  }


  backToHomePage() {
    const currentPage = Taro.getCurrentPages().length;
    Taro.navigateBack({ delta: currentPage-1 });
  }

  componentWillMount () {
  }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () {
    this.getUserInfo()
    this.getAppointRecord()
  }

  componentDidHide () { }

  render () {

    const{name , total,pageSize} = this.state
    console.log(this.state);
    return (
      <View className='userRecord'>
        <View style={{height: '50px', width: '100%', textAlign: 'center', backgroundColor: '#164883'}}>
          <Text style={{fontSize: '18px', color: '#ffffff', lineHeight: '50px'}}>预约记录</Text>
        </View>

        <AtList>
          {this.setAtListItem()}
        </AtList>
        <AtPagination current={this.state.current} total={total} pageSize={pageSize} onPageChange={(e)=>this.handlePageChange(e)} />
        <View style='padding: 15px  15px  40px 15px '>
          <AtButton type='primary' size='normal' onClick={() => this.backToHomePage()}>返回首页</AtButton>
        </View>

        <AtModal isOpened={this.state.modalIsOpened} title='预约信息' content={this.state.modalContent}   />
      </View>
    );
  }
}
