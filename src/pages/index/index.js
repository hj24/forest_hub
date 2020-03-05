import Taro, { Component } from '@tarojs/taro'
import { View,ScrollView,Input,Image} from '@tarojs/components'
import './index.scss'
import Feed from '../../components/feed/feed'
import searchPng from '../../asset/images/search.png'
import lightingPng from '../../asset/images/lighting.png'


export default class Index extends Component {
  config = {
    navigationBarTitleText: '收藏'
  };
  constructor() {
    super(...arguments);
    this.state = {
      unauthored: true,
      list:[],
      searchmod: false,
      searchph: '搜索论文名、主题或作者',
      searchv: ''
    };
  }

  componentDidShow() {
    this.clear();
    var accessToken = Taro.getStorageSync('accessToken');
    if (accessToken) {
      this.setState({
        unauthored: false
      });
      if (this.state.searchmod) {
        return
      }
      if (this.state.list.length === 0) {
        Taro.showLoading({ title: '加载中' });
        Taro.request({
          url: 'https://mambahj.com/favlist',
          method: "GET",
          header: {
            'content-type': 'application/json',
            'accessToken': accessToken,
          }
        }).then(res => {
          Taro.hideLoading();
          if (res.data["code"] === 24) {
            // 如果需要更新，则更新token
            if (res.data["tokentag"] === "yes") {
              Taro.setStorage({
                key: "accessToken",
                data: res.data["accessToken"]
              });
            }
            this.setState({
              unauthored: false,
              list: res.data["articles"]
            });
            // 更新页码，后续分页加载时需要
            Taro.setStorage({
              key: "favpage",
              data: 1
            });
          }
        })
      }
    } else {
      this.setState({
        unauthored: true
      });
      Taro.setStorage({
        key: "favpage",
        data: 1
      });
    }
  }


  componentDidMount () {
    // 获取远程数据
    Taro.showLoading({ title: '加载中' });
    var accessToken = Taro.getStorageSync('accessToken');
    if (accessToken){
      this.setState({
        unauthored: false
      });
      Taro.request({
        url: 'https://mambahj.com/favlist',
        method: "GET",
        header: {
          'content-type': 'application/json',
          'accessToken': accessToken,
        }
      }).then(res => {
        Taro.hideLoading();
        if (res.data["code"] === 24) {
          // 如果需要更新，则更新token
          if (res.data["tokentag"] === "yes") {
            Taro.setStorage({
              key: "accessToken",
              data: res.data["accessToken"]
            });
          }
          this.setState({
            unauthored: false,
            list: res.data["articles"]
          });
          // 更新页码，后续分页加载时需要
          Taro.setStorage({
            key: "favpage",
            data: 1
          });
        }
      })
    } else {
      Taro.hideLoading();
      this.setState({
        unauthored: true
      });
      Taro.showToast({
        'title': '没有权限，请授权登录',
        'icon': 'none'
      });
    }
  }

  updateList = () => {
    // 如果没有授权，执行不了更新操作
    if (this.state.unauthored) {
      return
    }
    var accessToken = Taro.getStorageSync('accessToken');
    if (accessToken) {
      if (this.state.searchmod === false) {
        Taro.request({
          url: 'https://mambahj.com/favlist',
          method: "GET",
          header: {
            'content-type': 'application/json',
            'accessToken': accessToken,
          }
        }).then(res => {
          if (res.data["code"] === 24) {
            // 如果需要更新，则更新token
            if (res.data["tokentag"] === "yes") {
              Taro.setStorage({
                key: "accessToken",
                data: res.data["accessToken"]
              });
            }
            this.setState({
              unauthored: false,
              list: res.data["articles"]
            });
            // 更新页码，后续分页加载时需要
            Taro.setStorage({
              key: "favpage",
              data: 1
            });
          }
        });
        this.setState({
          unauthored: false
        });
      } else {
        var sk = Taro.getStorageSync('searchkey');
        Taro.request({
          url: 'https://mambahj.com/favlist',
          method: "POST",
          header: {
            'content-type': 'application/json',
            'accessToken': accessToken,
          },
          data: {
            'key': sk
          }
        }).then(res => {
          if (res.data["code"] === 24) {
            // 如果需要更新，则更新token
            if (res.data["tokentag"] === "yes") {
              Taro.setStorage({
                key: "accessToken",
                data: res.data["accessToken"]
              });
            }
            this.setState({
              list: res.data["articles"]
            });
            Taro.setStorageSync('searchpage', 1);
          }
        });
        this.setState({
          unauthored: false
        });
      }
    }

  };

  appendNextPageList = () => {
    if (this.state.unauthored) {
      return
    }
    var accessToken = Taro.getStorageSync('accessToken');
    if (accessToken) {
      //如果没有进入搜索模式
      if (this.state.searchmod === false) {
        var p = Taro.getStorageSync('favpage');
        Taro.request({
          url: 'https://mambahj.com/favlist?page=' + (p + 1),
          method: "GET",
          header: {
            'content-type': 'application/json',
            'accessToken': accessToken,
          }
        }).then(res => {
          if (res.data["code"] === 24) {
            // 如果需要更新，则更新token
            if (res.data["tokentag"] === "yes") {
              Taro.setStorage({
                key: "accessToken",
                data: res.data["accessToken"]
              });
            }
            if (res.data["len"] === 0) {
              Taro.showToast({
                "title": "我真的一滴都不剩了",
                "icon": "none"
              });
            } else {
              this.setState({
                unauthored: false,
                list: this.state.list.concat(res.data["articles"])
              });
              // 更新页码，后续分页加载时需要
              Taro.setStorage({
                key: "favpage",
                data: res.data["page"]
              });
            }
          }
        });
        this.setState({
          unauthored: false
        });
      } else {
        var sp = Taro.getStorageSync('searchpage');
        var sk = Taro.getStorageSync('searchkey');
        Taro.request({
          url: 'https://mambahj.com/favlist?page=' + (sp + 1),
          method: "POST",
          header: {
            'content-type': 'application/json',
            'accessToken': accessToken,
          },
          data: {
            'key': sk
          }
        }).then(res => {
          if (res.data["code"] === 24) {
            // 如果需要更新，则更新token
            if (res.data["tokentag"] === "yes") {
              Taro.setStorage({
                key: "accessToken",
                data: res.data["accessToken"]
              });
            }
            if (res.data["len"] === 0) {
              Taro.showToast({
                "title": "我真的一滴都不剩了",
                "icon": "none"
              });
            } else {
              this.setState({
                unauthored: false,
                list: this.state.list.concat(res.data["articles"])
              });
              // 更新页码，后续分页加载时需要
              Taro.setStorage({
                key: "searchpage",
                data: res.data["page"]
              });
            }
          }
          if (res.data["code"] === 10) {
            Taro.showToast({
              'title': '真的没有了',
              'icon': 'none'
            });
          }
        });
        this.setState({
          unauthored: false
        });
      }
    }

  };

  clearSearch = () => {
    Taro.removeStorageSync('searchkey');
    Taro.removeStorageSync('searchpage');
    this.setState({
      searchmod: false,
    });
  };

  searchFav = (res) => {
    // 进入搜索前，先清空上一次搜索的状态
    this.clearSearch();
    // 没有token，不可以搜索
    var token = Taro.getStorageSync('accessToken');
    if (token) {
      //进行搜索时，页面切换到搜索模式
      var key = res.detail.value;
      //对输入长度进行校验
      if (key.length === 0) {
        // 输入长度为0时，默认为取消搜索
        this.clearSearch();
        this.updateList();
        return
      }
      if (key.length > 100) {
        Taro.showToast({
          'title': '输入过长',
          'icon': 'none'
        });
        return
      }
      Taro.request({
        url: 'https://mambahj.com/favlist',
        method: "POST",
        header: {
          'content-type': 'application/json',
          'accessToken': token,
        },
        data: {
          "key": key
        }
      }).then(ans => {
        if (ans.statusCode !== 200) {
          // 服务端错误，需要从搜索模式退出
          Taro.showToast({
            'title': '服务端错误',
            'icon': 'none'
          });
          this.setState({
            searchmod: false
          });
        } else {
          if (ans.data["code"] === 10) {
            Taro.showToast({
              'title': '没有找到内容',
              'icon': 'none'
            });
            if (ans.data["tokentag"] === "yes") {
              Taro.setStorage({
                key: "accessToken",
                data: ans.data["accessToken"]
              });
            }
            this.setState({
              searchmod: false
            });
          }
          if (ans.data["code"] === 24) {
            if (ans.data["tokentag"] === "yes") {
              Taro.setStorage({
                key: "accessToken",
                data: ans.data["accessToken"]
              });
            }
            // 搜索成功
            var sp = ans.data["page"];
            Taro.setStorageSync('searchpage', sp);
            Taro.setStorageSync('searchkey', key);
            this.setState({
              list: ans.data["articles"],
              searchmod: true
            });
            Taro.showToast({
              'title': '找到 ' + ans.data["articles"].length + ' 条信息'
            });
          }
        }
      })
    } else {
      Taro.showToast({
        'title': '您未登录，不能进行搜索',
        'icon': 'none'
      });
    }
  };

  clearInput = () => {
    this.setState({
      searchv: ''
    })
  };

  clear = () => {
    this.clearInput();
    this.clearSearch();
    this.updateList();
  };

  setInput = (e) => {
    // 输入时把值赋给searchv，后续清空时使用
    this.setState({
      searchv: e.detail.value
    });
    return this.state.searchv
  };

  render () {
    return (
        <View>
        <View className='search flex-wrp'>
          <View className='search-left flex-item'>
            <View className='flex-wrp'>
              <View className='flex1'><Image src={searchPng} /></View>
              <View className='flex6'>
                <Input type='text' placeholder={this.state.searchph}
                  placeholderClass='search-placeholder' confirmType='go' onConfirm={e => this.searchFav(e)}
                  value={this.state.searchv} onInput={this.setInput}
                />
              </View>
            </View>
          </View>
          <View className='search-right flex-item'>
            <Image onClick={this.clear} src={lightingPng} />
          </View>
        </View>
        <ScrollView className='container' scrollY scrollWithAnimation scrollTop='0' lowerThreshold='10' upperThreshold='10'
          style='height:300px' onScrollToUpper={this.updateList} onScrollToLower={this.appendNextPageList} enableBackToTop='true'
        >
        {
          this.state.unauthored
          ? <View className='txcenter'>未登录</View>
          : this.state.list.map((item, key) => {
            return <Feed
              key={key}
              //feedSourceImg={item.feed_source_img}
              feedSourceName={item.author ? item["author"].substring(0, 20) + " ...": ""}
              //feedSourceTxt={item.feed_source_txt}
              idx={item.id}
              question={item.title}
              goodNum={item["fav_num"]}
              commentNum={item["date"]}
              answerCtnt={item.expr ? item["expr"].substring(0, 200) : ""}
            />
          })
        }
      </ScrollView>
      </View>
    )
  }
}

