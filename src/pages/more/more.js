import Taro, { Component } from '@tarojs/taro'
import { View, Text,Image,Button} from '@tarojs/components'
import './more.scss'

import eyePng from '../../asset/images/eye.png'
import starPng from '../../asset/images/star.png'
import draftPng from '../../asset/images/draft.png'
import recentPng from '../../asset/images/recent.png'
import bookPng from '../../asset/images/book.png'
import livePng from '../../asset/images/live.png'
import zhiPng from '../../asset/images/zhi.png'
import default_avatar from '../../asset/images/default_avatar.jpeg'


export default class More extends Component {
  config = {
    navigationBarTitleText: '我的'
  }

  constructor () {
    super(...arguments)

    this.state = {
      name:"未登录",
      desc:"点击进行登录",
      //isLogin: false
      avatar: default_avatar
    }

  }

  componentWillMount() {
    // 页面加载时判断登录是否失效
    try {
      Taro.checkSession({
        success: function () {
          //登录未过期
          // Taro.getUserInfo().then(res => {
          //   console.log(res.userInfo)
          //   Taro.setStorage({key: 'avatar', data: res.userInfo.avatarUrl})
          //   Taro.setStorage({key: 'nickname', data: res.userInfo.nickName})
          //   Taro.setStorage({key: 'desc', data: '已授权'})
          // })
          Taro.showToast({
            title: '登录成功',
            icon: 'none',
            duration: 2000
          })

        },
        fail: function () {
          //console.log('登录信息过期')
          Taro.clearStorage({
            success: function () {
              Taro.showToast({
                title: '登录过期，请重新授权',
                icon: 'none',
                duration: 2000
              })
            }
          })

        }
      })
    } catch (e) {
      console.log(e)
    }
  }

  componentDidShow () {
    // 验证登录成功之后，页面加载时从缓存读取
    console.log('页面加载')
    try {
      var ava = Taro.getStorageSync('avatar')
      var nickname = Taro.getStorageSync('nickname')
      var desc = Taro.getStorageSync('desc')
      console.log(ava)
      if (ava && nickname && desc) {
        this.setState({
          name: nickname,
          desc: desc,
          avatar: ava
        })
      }
    } catch (e) {
      console.log(e)

    }
  }

  navigateTo = (url) => {
    Taro.navigateTo({
      url: url
    })
  }

  processInfo = (info) => {
    Taro.checkSession({
      success: function () {
        Taro.showToast({
          title: '已登录，无需重复登录',
          icon: 'none',
          duration: 2000
        })
      },
      fail: function () {
        // 如果授权成功，有授权信息
        if (info.detail.userInfo) {
          // 先清空缓存
          Taro.clearStorageSync()
          // 调用login接口获取 code
          Taro.login({
            success: function (res) {
              if (res.code) {
                console.log(res.code)
                // 有code之后带着code和info信息去后端请求token
                // Taro.request({
                //   url: 'https://mambahj24.com/mock/5b21d97f6b88957fa8a502f2/example/feed'
                // }).then(res => {
                //   Taro.hideLoading()
                //   if (res.data.success) {
                //     this.setState({
                //       loading: false,
                //       list: res.data.data
                //     })
                //   }
                // })
                Taro.getUserInfo().then(ans => {
                  Taro.setStorage({key: 'avatar', data: ans.userInfo.avatarUrl}).then(()=>{
                    Taro.setStorage({key: 'nickname', data: ans.userInfo.nickName}).then(()=>{
                      Taro.setStorage({key: 'desc', data: '已成功授权'}).then(()=>{
                        // 登录成功并且设置缓存之后，重新加载页面
                        Taro.reLaunch({url: '/pages/more/more'}).then().then(()=>{
                          Taro.showToast({
                            title: '登录成功',
                            icon: 'none',
                            duration: 2000
                          })
                        })
                      })
                    })
                  })
                })
              } else {
                // 获取code失败
                Taro.showToast({
                  title: '登录失败',
                  icon: 'none',
                  duration: 2000
                })
              }
            }
          })
        }
      }
    })
  }

  render () {
    return (
      <View className='more'>
        <View className='user flex-wrp'>
          <View className='avatar flex-item'>
            <Image className='userinfo-avatar' src={this.state.avatar} backgroundSize='cover'></Image>
          </View>
          <View className='user-info flex-item'>
            <Text className='userinfo-nickname'>{this.state.name}</Text>
            <Text className='edit'>{this.state.desc}</Text>
          </View>
        </View>
        <View className='my'>
          <View className='my-item flex-wrp'>
            <View className='myitem-icon flex-item' >
              <Image class='myitem-img' src={livePng}></Image>
            </View>
            <View className='myitem-button flex-item'>
              <Button className='myitem-b' open-type='getUserInfo' onGetUserInfo={this.processInfo}>授权登录</Button>
            </View>
          </View>

          <View className='my-item flex-wrp'>
            <View className='myitem-icon flex-item' >
              <Image class='myitem-img' src={starPng}></Image>
            </View>
            <View className='myitem-button flex-item'>
              <Button className='myitem-b'>我的收藏</Button>
            </View>
          </View>

          <View className='my-item flex-wrp'>
            <View className='myitem-icon flex-item' >
              <Image class='myitem-img' src={bookPng}></Image>
            </View>
            <View className='myitem-button flex-item'>
              <Button className='myitem-b' onClick={this.navigateTo.bind(this, '/pages/about/about')}>关于开发者</Button>
            </View>
          </View>


        </View>
      </View>
    )
  }
}

