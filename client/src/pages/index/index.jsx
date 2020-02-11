import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.css'

import Login from '../../components/login/index'
import HomePage from "../../components/homePage/index.weapp";

export default class Index extends Component {

  config = {
    navigationBarTitleText: '首页'
  }

  constructor(props) {
    super(props);
    this.handleLoginChange =this.handleLoginChange.bind(this)
    this.state = {isLogin: false , userInfo:{}};
  }

  //登陆成功后修改状态，这个方法传递到了login这个components
  handleLoginChange(res) {
    this.setState(res);
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='index'>
        {console.log('初始页登陆状态', this.state.isLogin)}
        {console.log('初始页用户状态', this.state.userInfo)}
        {this.state.isLogin ?  <HomePage userInfo={this.state.userInfo} /> : <Login onLoginChange={this.handleLoginChange} />}
      </View>
    );
  }
}
