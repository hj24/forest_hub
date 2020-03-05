import Taro, { Component } from '@tarojs/taro'
import { View,Image,Text } from '@tarojs/components'
import more from '../../asset/images/more.png'

import './feed.scss'

export default class Feed extends Component {
  navigateTo = (url) => {
    Taro.navigateTo({url:url})
  };
  render() {
    return (
      <View className='feed-item'>
        <View className='feed-source'>
          {/*<View className='avatar flex1'>*/}
          {/*    <Image className='avatar_img' src={this.props.feedSourceImg}></Image>*/}
          {/*</View>*/}
          <View className='flex8'>
            <Text className='feed-source-txt'>{this.props.feedSourceName}</Text>
          </View>
          <View className='flex1'>
            <Image className='item-more' mode='aspectFit' src={more}></Image>
          </View>
        </View>
        <View className='feed-content'>
            <View className='question'
              onClick={
                    Feed.navigateTo.bind(this,
                      '/pages/answer/answer?id=' + this.props.idx +
                      '&title=' + this.props.question + '&fav=' + this.props.goodNum)
              }
            >
                <View className='question-link'>
                    <Text>{this.props.question}</Text>
                </View>
            </View>
            <View className='answer-body'>
                <View>
                    <Text className='answer-txt'
                      onClick={
                        Feed.navigateTo.bind(this,
                          '/pages/answer/answer?id=' + this.props.idx +
                          '&title=' + this.props.question +
                          '&fav=' + this.props.goodNum + '&date=' + this.props.commentNum)
                      }
                    >
                      {this.props.answerCtnt}
                    </Text>
                </View>
                <View className='answer-actions'>
                    <View className='like dot'>
                        <View>{this.props.goodNum} 收藏 </View>
                    </View>
                    <View className='comments dot'>
                        <View>{this.props.commentNum} 下载 </View>
                    </View>
                    {/*<View className='follow-it'>*/}
                    {/*    <View>关注问题</View>*/}
                    {/*</View>*/}
                </View>
            </View>
        </View>
      </View>
    )
  }
}
