import Taro, { Component } from '@tarojs/taro'
import {View, Text,Button} from '@tarojs/components'
import {AtList, AtButton, AtListItem, AtPagination, AtModal, AtSearchBar,AtModalAction} from "taro-ui"



export default class managePatientPage extends Component {

  config = {
    navigationBarTitleText: '管理员查看预约记录'
  }

  constructor(props) {
    super(props);
    this.state = {
      total: 0,
      current: 1,
      pageSize: 10,
      searchBarValue:'',
      userInfoContent: '',
      userInfoIsOpened:false,
      modalIsOpened: false,
      recordData: []
    };
  }


  getPatientRecord() {
    const{current,pageSize,searchBarValue}= this.state
    Taro.cloud.callFunction({
      name:'getPatientRecord',
      data: {
        searchBarValue: searchBarValue,
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
      (<AtListItem title={item.name} extraText={(item.gender-1)? '女':'男'} arrow='right'
                   onClick={()=>this.setAtModal(item)} />) )

    return atList
  }

  setAtModal(userInfo) {
    let context = 'null'
    console.log('userInfo:'+userInfo);
    if (userInfo){
      Taro.cloud.callFunction({
        name:'getAppointById',
        data:{
          openId : userInfo.openId
        }
      }).then(res => {
        if (res.errMsg.endsWith('ok')){
          const {name,phone,birthday,gender} = userInfo
          const birthdayStr = birthday.substr(0, 10);
          const currentYear = (new Date()).getFullYear();
          const birthYear = (new Date(birthdayStr)).getFullYear();
          const age = currentYear - birthYear;
          const sex = (gender - 1) ? '女' : '男'
          context = '姓名：' + name + '\n性别：' + sex +'\n年龄：'+age+ '\n电话号码：' + phone+'\n最近10次预约记录：';

          const data = res.result.data
          console.log(data);
          if (data.length){
            for( let i = 0;i<data.length;i++){
              context = context + '\n' + data[i].appointDate.substr(0,10)+'  '+data[i].selectedTime
            }
          }
          this.setState({
            userInfoContent: context,
            userInfoIsOpened:true,
          })
        }
      })
    }else {
      this.setState({
        userInfoContent: context,
        userInfoIsOpened:true,
      })
    }
  }

  handlePageChange(e) {
    this.setState({current: e.current})

  }

  openCalendarModal() {
    this.setState({modalIsOpened: true})
  }

  handleSearchBarChange(value) {
    this.setState({searchBarValue: value})
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
  }

  componentDidMount () {
    this.getPatientRecord();
  }

  componentWillUnmount () { }

  componentDidShow () {
  }

  componentDidHide () { }

  render () {

    const{searchBarValue , total,pageSize,userInfoContent,userInfoIsOpened} = this.state
    console.log(this.state)
    return (
      <View className='userRecord'>
        <View style={{height: '50px', width: '100%', textAlign: 'center', backgroundColor: '#164883'}}>
          <Text style={{fontSize: '18px', color: '#ffffff', lineHeight: '50px'}}>病人记录</Text>
        </View>

        <AtSearchBar
          value={searchBarValue}
          onChange={(value:string, event:Object) => this.handleSearchBarChange(value)}
          onActionClick={()=>this.getPatientRecord()}
        />
        <AtList>
          {this.setAtListItem()}
        </AtList>

        <AtPagination current={this.state.current} total={total} pageSize={pageSize} onPageChange={(e)=>this.handlePageChange(e)} />
        <View style='padding: 15px  15px  40px 15px '>
          <AtButton type='primary' size='normal' onClick={() => this.backToHomePage()}>返回首页</AtButton>
        </View>
        {/*<AtModal isOpened={modalIsOpened} closeOnClickOverlay={false}>*/}
        {/*  <AtModalAction>*/}
        {/*    <Button onClick={()=>this.handleModalCancel()}>取消</Button>*/}
        {/*    <Button onClick={()=>this.handleModalConfirm()}>确定</Button>*/}
        {/*  </AtModalAction>*/}
        {/*</AtModal>*/}
        <AtModal isOpened={userInfoIsOpened} title='就诊人信息' content={userInfoContent} onClose={()=>this.setState({userInfoIsOpened:false})}  />
      </View>
    );
  }
}
