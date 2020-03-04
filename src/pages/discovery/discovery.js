import Taro, { Component } from '@tarojs/taro'
import { View, Text,ScrollView,Image,Swiper,SwiperItem} from '@tarojs/components'
import './discovery.scss'
import Feed from '../../components/feed/feed'

import img1 from '../../asset/images/forest3.jpeg'
import img2 from '../../asset/images/forest2.jpeg'
import img3 from '../../asset/images/forest1.jpeg'
import img7 from '../../asset/images/24280.jpg'
import img8 from '../../asset/images/mu2.jpeg'
import img9 from '../../asset/images/mu1.jpeg'

export default class Discovery extends Component {
  config = {
    navigationBarTitleText: '首页'
  };
  constructor() {
    super(...arguments);
    this.state = {
      imgUrls: [img1,img2,img3],
      imgUrls2: [img7, img8, img9],
      currentNavtab: 0,
      navTab: ['林业', '牧业'],
      feed:[],
      feed2: [],
    }
  }


  componentDidMount() {
    //主界面无需关注有没有token直接异步加载两个api
    Taro.showLoading({
      'title': '初始化'
    });
    function init(obj) {
      var r1 = new Promise(function (resolve, reject) {
        Taro.request({
          url: 'https://mambahj.com/articles?subject=forestry',
          success: function (res) {
            obj.setState({
              feed: res.data["articles"]
            });
            resolve(res.data)
          },
          fail: function (res) {
            reject(res.data)
          }
        })
      });
      r1.then(function () {
        console.log("forestry load");
        Taro.hideLoading();
      });
      var r2 = new Promise(function (resolve, reject) {
        Taro.request({
          url: 'https://mambahj.com/articles?subject=stock%20raising',
          success: function (res) {
            obj.setState({
              feed2: res.data["articles"]
            });
            resolve(res.data)
          },
          fail: function (res) {
            reject(res.data)
          }
        })
      });
      r2.then(function () {
        console.log("stock raising load")
      });
    }
    init(this);

    Taro.setStorage({
      key: "mainpage0", data: 1
    });
    Taro.setStorage({
      key: "mainpage1", data: 1
    });
  }

  update = () => {
    function _update(obj, url, idx) {
      console.log(obj.state);
      Taro.request({
        url: url,
        success: function (res) {
          if (idx === 0){
            obj.setState({
              feed: res.data["articles"]
            });
            console.log(obj.state.feed)
          }
          if (idx === 1){
            obj.setState({
              feed2: res.data["articles"]
            });
            console.log(obj.state.feed2)
          }
        },
        fail: function (res) {
          console.log(res)
        }
      })
    }
    if (this.state.currentNavtab === 0) {
      _update(this, 'https://mambahj.com/articles?subject=forestry', 0);
      Taro.setStorage({key: "mainpage0", data: 1})
    }
    if (this.state.currentNavtab === 1) {
      _update(this, 'https://mambahj.com/articles?subject=stock%20raising', 1);
      Taro.setStorage({key: "mainpage1", data: 1})
    }
  };

  appendNextPage = () => {
    if (this.state.currentNavtab === 0) {
      var p1 = Taro.getStorageSync('mainpage0');
      var _url = 'https://mambahj.com/articles?subject=forestry&page=' + (parseInt(p1) + 1);
      Taro.request({
        url: _url,
        method: "GET",
      }).then(res => {
        // code 24说明请求成功
        if (res.data["code"] === 24){
          //长度为0说明到底了
          if (res.data["len"] === 0) {
            Taro.showToast({
              "title": "已经到底啦",
              "icon": "none"
            });
          } else {
            // 不为0 更新localstroage的page，为了下一次翻页
            // 并且拉取新数据添加到feed中
            Taro.setStorage({
              key: "mainpage0",
              data: res.data["page"],
            });
            this.setState({
              feed: this.state.feed.concat(res.data["articles"])
            });
          }
        } else {
          Taro.showToast({
            "title": "fetch error",
            "icon": "loading"
          });
        }
      })
    }

    if (this.state.currentNavtab === 1) {
      var p2 = Taro.getStorageSync('mainpage1');
      var __url = 'https://mambahj.com/articles?subject=stock%20raising&page=' + (parseInt(p2) + 1);
      Taro.request({
        url: __url,
        method: "GET",
      }).then(res => {
        // code 24说明请求成功
        if (res.data["code"] === 24){
          //长度为0说明到底了
          if (res.data["len"] === 0) {
            Taro.showToast({
              "title": "已经到底啦",
              "icon": "none"
            });
          } else {
            // 不为0 更新localstroage的page，为了下一次翻页
            // 并且拉取新数据添加到feed中
            Taro.setStorage({
              key: "mainpage1",
              data: res.data["page"],
            });
            this.setState({
              feed2: this.state.feed2.concat(res.data["articles"])
            });
          }
        } else {
          Taro.showToast({
            "title": "fetch error",
            "icon": "loading"
          });
        }
      })
    }
  };


  switchTab(index, e) {
    console.log(e);
    this.setState({
      currentNavtab: index
    })
  }
  render () {
    return (
      <View>
        <View className='top-tab flex-wrp flex-tab' >
        {
          this.state.navTab.map((item, index) => {
            return (
              <View className={this.state.currentNavtab === index ? 'toptab flex-item active' : 'toptab flex-item'} key={index} onClick={this.switchTab.bind(this,index)}>
                {item}
              </View>
            )
          })
        }
        </View>

        <ScrollView scroll-y className='container discovery withtab' enableFlex='true'
          onScrollToUpper={this.update} onScrollToLower={this.appendNextPage} enableBackToTop='true'
        >
          <View className='ctnt0' hidden={this.state.currentNavtab !== 0}>
              <Swiper className='activity' indicatorDots='true' autoplay='true' interval='5000' duration='500'>
                {this.state.imgUrls.map((item,index) => {
                  return (<SwiperItem key={index}>
                    <Image src={item} className='slide-image' width='355' height='375' />
                  </SwiperItem>)
                })}
              </Swiper>
              {
                this.state.feed.map((item, index)=>{
                  return (
                    <Feed
                      key={`dis_${index}`}
                      // feedSourceImg={item.feed_source_img}
                      feedSourceName={item.author ? item["author"].substring(0, 20) + " ...": ""}
                      //feedSourceTxt={item.feed_source_txt}
                      question={item.title}
                      goodNum={item["fav_num"]}
                      commentNum={item["date"]}
                      answerCtnt={item.expr ? item["expr"].substring(0, 200) : ""}

                    />
                  )}
                )
              }
          </View>

          <View className='ctnt0' hidden={this.state.currentNavtab !== 1}>
            <Swiper className='activity' indicatorDots='true' autoplay='true' interval='5000' duration='500'>
              {this.state.imgUrls2.map((item,index) => {
                return (<SwiperItem key={index}>
                  <Image src={item} className='slide-image' width='355' height='375' />
                </SwiperItem>)
              })}
            </Swiper>
            {
              this.state.feed2.map((item, index)=>{
                return (
                  <Feed
                    key={`dis2_${index}`}
                    // feedSourceImg={item.feed_source_img}
                    feedSourceName={item.author ? item["author"].substring(0, 20) + " ...": ""}
                    //feedSourceTxt={item.feed_source_txt}
                    question={item.title}
                    goodNum={item["fav_num"]}
                    commentNum={item["date"]}
                    answerCtnt={item.expr ? item["expr"].substring(0, 200) : ""}

                  />
                )}
              )
            }
          </View>


          <View className='txcenter' hidden={this.state.currentNavtab !== 2}>
            <Text>热门</Text>
          </View>
          <View className='txcenter' hidden={this.state.currentNavtab !== 3}>
            <Text>收藏</Text>
          </View>

        </ScrollView>

      </View>
    )
  }
}

