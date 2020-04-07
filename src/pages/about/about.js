import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import './about.scss'

import img8 from '../../asset/images/default_avatar.jpeg'

export default class Answer extends Component {
  config = {
    navigationBarTitleText: '关于开发者'
  };
  constructor() {
    super(...arguments)
  }

  navigateTo = (url) => {
    Taro.navigateTo({ url: url })
  };

  render() {
    return (
      <View className='answer_container'>
        <View className='question'>
          <Text className='question-title'>关于这个小程序</Text>
        </View>
        <View className='answerer-wrp'>
          <View className='bg-half' />
          <View className='answerer flex-wrp'>
            <View className='avatar flex-item'>
              <Image src={img8} />
            </View>
            <View className='answerer-info flex-item'>
              <Text className='answerer-name'>开发者: 黄健</Text>
              <Text className='answerer-des'>后端/Python/Golang开发者</Text>
            </View>
          </View>
        </View>
        <View className='answer-content'>
          <Text>
            希望它做些什么: \n
            &ensp;&ensp;1. 帮助林业科研工作者阅读最新论文 \n
            &ensp;&ensp;2. 作为一个项目，由南林学子一直维护下去 \n
            \n
            关于作者: \n
            &ensp;&ensp;就读于南京林业大学 \n
            &ensp;&ensp;后端开发者，在做Devops \n
            &ensp;&ensp;如果对小程序有什么建议，欢迎发邮件到 \n
            &ensp;&ensp;mambahj24@gmail.com \n
            &ensp;&ensp;24小时内必回 \n
            \n
            THX...
          </Text>
        </View>
      </View>
    )
  }
}

