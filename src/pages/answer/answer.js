import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'
import './answer.scss'


import img4 from '../../asset/images/heart2.png'
import img5 from '../../asset/images/star2.png'
import eye from '../../asset/images/eye.png'
import faved from '../../asset/images/allread.png'


export default class Answer extends Component {
    config = {
        navigationBarTitleText: '详情'
    };

    constructor() {
        super(...arguments);
        this.state = {
          idx: null,
          title: "N/A",
          author: "N/A",
          fav: -1,
          content: "加载中",
          date: "N/A",
          favtag: false
        }

    }

    componentDidShow() {
      var idx = this.$router.params["id"];
      var title = this.$router.params["title"];
      var fav = this.$router.params["fav"];
      var date = this.$router.params["date"];
      this.setState({
        idx: idx,
        title: title,
        fav: fav,
        date: date
      });
      var accessToken = Taro.getStorageSync('accessToken');
      if (accessToken){
        Taro.request({
          url: 'https://mambahj.com/articles/' + idx,
          method: "GET",
          header: {
            'content-type': 'application/json',
            'accessToken': accessToken,
          }
        }).then((res) => {
          if (res.data["code"] === 24) {
            if (res.data["tokentag"] === "yes") {
              Taro.setStorage({
                key: "accessToken",
                data: res.data["accessToken"]
              });
            }
            var chlist = [
              res.data["article"]["content"], '原文地址: ', res.data["article"]["arx_url"],
              'PDF地址: ', res.data["article"]["pdf_url"], '更新日期: ', date, '\n', '\n'
            ];
            var cot = chlist.join('\n');
            if (res.data["favtag"] === 'yes'){
              this.setState({
                content: cot,
                favtag: true,
                author: res.data["article"]["author"]
              });
            } else {
              this.setState({
                content: cot,
                favtag: false,
                author: res.data["article"]["author"]
              })
            }
          }
        });
      } else {
        Taro.request({
          url: 'https://mambahj.com/articles/' + idx,
          method: "GET"
        }).then((res) => {
          if (res.data["code"] === 24) {
            var chlist = [
              res.data["article"]["content"], '原文地址: ', res.data["article"]["arx_url"],
              'PDF地址: ', res.data["article"]["pdf_url"], '更新日期: ', date, '\n', '\n'
            ];
            var cot = chlist.join('');
            if (res.data["favtag"] === 'yes'){
              this.setState({
                content: cot,
                favtag: true,
                author: res.data["article"]["author"]
              });
            } else {
              this.setState({
                content: cot,
                favtag: false,
                author: res.data["article"]["author"]
              })
            }
          }
        });
      }
    }

    navigateTo = (url) => {
        Taro.navigateTo({ url: url })
    };

    processFav = () => {
      var accessToken = Taro.getStorageSync('accessToken');
      if (accessToken) {
        var ft = "no";
        if (this.state.favtag) {
          ft = "yes"
        }
        // 把当前状态传过去，当前已收藏，则取消收藏
        Taro.request({
          url: 'https://mambahj.com/articles/' + this.state.idx,
          method: "POST",
          header: {
            'content-type': 'application/json',
            'accessToken': accessToken,
          },
          data: {
            "favtag": ft
          }
        }).then((res) => {
          // 服务端出错
          if (res.statusCode !== 200){
            Taro.showToast({
              'title': '服务器错误',
              'icon': 'none'
            });
            return
          }
          if (res.data["tokentag"] === "yes") {
            Taro.setStorageSync('accessToken', res.data["accessToken"]);
          }
          if (res.data["code"] === 24) {
            if (res.data["favtag"] === "yes") {
              this.setState({
                favtag: true,
                fav: res.data["favnum"]
              });
            } else {
              this.setState({
                favtag: false,
                fav: res.data["favnum"]
              });
            }
          }
        })
      } else {
        // 未登录，这个按钮不可以点
        Taro.showToast({
          'title': '您未登录，不能收藏哦',
          'icon': 'none'
        });
      }
    };

    render() {
        return (

          <View className='answer_container'>
            <View className='question'>
                <Text className='question-title'>{this.state.title}</Text>
            </View>
            <View className='answerer-wrp'>
              <View className='bg-half'></View>
              <View className='answerer flex-wrp'>
                {/*<View className='avatar flex-item'>*/}
                {/*  <Image src={img7}></Image>*/}
                {/*</View>*/}
                <View className='answerer-info flex-item'>
                  <Text className='answerer-name'>作者:</Text>
                  <Text className='answerer-des'>{this.state.author}</Text>
                </View>
                {/*<View className='follow flex-item'>*/}
                {/*  <Text>十 收藏</Text>*/}
                {/*</View>*/}
              </View>
            </View>
            <View className='answer-content'>
              <Text>
                {this.state.content}
              </Text>
            </View>
            <View className='answer-footer flex-wrp'>
              <View className='good flex-item'>
                  <View className='good-bad'>
                      <Image src={eye} />
                  </View>
                  <View className='good-num'>{this.state.fav}</View>
              </View>
              <View className='operation-wrp flex-item'>
                <View className='operation flex-wrp flex-tab'>
                  <View className='operation-btn flex-item'>
                    {/*<Image src={img3}></Image>*/}
                    {/*<Text>没有帮助</Text>*/}
                  </View>
                  <View className='operation-btn flex-item'>
                    {/*<Image src={img6}></Image>*/}
                    {/*<Text>302</Text>*/}
                  </View>
                  <View className='operation-btn flex-item'>
                    <Button className='btn'>
                      <Image src={img4} />
                      <Text>下载</Text>
                    </Button>
                  </View>
                  <View className='operation-btn flex-item'>
                    <Button className='btn' onClick={this.processFav}>
                      {
                        this.state.favtag ? <Image src={faved} />
                                          : <Image src={img5} />
                      }
                      <Text>收藏</Text>
                    </Button>
                  </View>

                </View>
              </View>
            </View>
          </View>
        )
    }
}

