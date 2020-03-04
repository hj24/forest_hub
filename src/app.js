import Taro, { Component } from '@tarojs/taro'
import Discovery from './pages/discovery/discovery'

import './app.scss'


class App extends Component {
  config = {
    pages: [
      'pages/discovery/discovery',
      'pages/index/index',
      'pages/more/more',
      'pages/answer/answer',
      'pages/question/question',
      'pages/about/about'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#0068C4',
      navigationBarTitleText: 'forest',
      navigationBarTextStyle: 'white',
      enablePullDownRefresh: true
    },
    tabBar: {
      color: "#626567",
      selectedColor: "#2A8CE5",
      backgroundColor: "#FBFBFB",
      borderStyle: "white",
      list: [{
        pagePath: "pages/discovery/discovery",
        text: "首页",
        iconPath: "./asset/images/discovery.png",
        selectedIconPath: "./asset/images/discovery_focus.png"
      }, {
        pagePath: "pages/index/index",
        text: "收藏",
        iconPath: "./asset/images/index.png",
        selectedIconPath: "./asset/images/index_focus.png"
      }, {
        pagePath: "pages/more/more",
        text: "个人",
        iconPath: "./asset/images/burger.png",
        selectedIconPath: "./asset/images/burger_focus.png"
      }]
    }
  };

  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  componentCatchError () {}

  render () {
    return (
      <Discovery />
    )
  }
}

Taro.render(<App />, document.getElementById('app'));
