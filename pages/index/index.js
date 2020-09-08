//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    position: {
      longitude: 0.00,
      latitude: 0.00
    },
    //是否开启卫星地图
    satellite: false,
    //是否开启实施路况
    traffic: false,
    //标点
    markers:[
      {
        id:909099,
        latitude:28.235879,
        longitude:112.927297,
        'ari-alabel':'1231232131'
      }
    ],
    showMarkerModel:false,
    markerData:{},
    isClosePanl:false,//是否关闭登陆面板
  },
  onLoad: function () {
    let self = this
    console.log(app.globalData.userInfo)
    wx.getLocation({
      type: 'gcj02',
      altitude: true,
      isHighAccuracy: true,
      success(res) {
        self.setData({
          position: {
            latitude: res.latitude,
            longitude: res.longitude
          }
        })
      }
    })
    wx.getStorage({
      key: 'userInfo',
      success:function(res){
        console.log(res.data)
        if(res.data){
          self.setData({
            isClosePanl:true
          })
        }else{
          self.setData({
            isClosePanl:false
          })
        }
      }
    })
  },
  onShow:function(){
    var that=this
    wx.getStorage({
      key: 'userInfo',
      success:function(info){
        console.log(info.data)
        app.globalData.userInfo=info.data
        that.roadInfo(info.data.openId)
      },
      fail:function(){
        wx.showToast({
          title: '请登陆',
          icon:'none'
        })
        that.setData({
          isClosePanl:false
        })
      }
    })
  },
  onReady: function () {
    this.mapCtx = wx.createMapContext('map', this)
    this.mapCtx.moveToLocation()
  },
  report: function () {
    wx.navigateTo({
      url: '/pages/report/report',
    })
  },
  markertap:function(e){
    console.log(e)
    for(let index in this.data.markers){
      if(index==e.markerId){
        var item=this.data.markers[index]
        this.setData({
          showMarkerModel:true,
          markerData:item['aria-label']
        })
      }
    }
    
  },
  mapTap:function(){
    this.setData({
      showMarkerModel:false
    })
  },
  getuserinfo:function(res){
    let that=this
    let userInfo=res.detail.userInfo
    wx.login({
      success:function(resul){
        wx.request({
          url: app.globalData.server_url+'/jeecg-boot/mini/getOpenId',
          data:{
            'code':resul.code
          },
          success:function(res){
            let data=res.data
            console.log(data.code)
            if(data.code==0){
              let openid=data.data.openid
              wx.request({
                url: app.globalData.server_url+'/jeecg-boot/mini/getByOpenId',
                data:{
                  'openId':openid
                },
                success:function(resul){
                  let data=resul.data.data
                  if(data){
                    console.log('用户存在',data)
                    app.globalData.userInfo=data
                    that.setData({
                      isClosePanl:true
                    })
                    that.setCath('userInfo',data)
                    wx.showToast({
                      title: '登陆成功！',
                    })
                  }else{
                    console.log('调用注册接口')
                    console.log(userInfo)
                    wx.request({
                      url: app.globalData.server_url+'/jeecg-boot/mini/registry',
                      data:{
                        'nickname':userInfo.nickName,
                        'age':0,
                        'sex':userInfo.gender,
                        'openId':openid
                      },
                      method:'POST',
                      success:function(res){

                      },
                      fail:function(error){
                      }
                    })
                  }
                }
              })
            }else{
              wx.showToast({
                title: '登陆失败',
              })
            }
          }
        })
      }
    })
  },
  setCath:function(key,value){
    wx.setStorage({
      data: value,
      key: key,
    })
  },
  roadInfo:function(openid){
    var that=this;
    wx.request({
      url: app.globalData.server_url+'/jeecg-boot/mini/roadInfo',
      data:{
        'openId':openid
      },
      success:function(resul){
          let {data}=resul
          let podata=data.data;
          var markers=[]
          for(let index in podata){
            let item=podata[index]
            markers.push({'id':index,'latitude':item.latitude,'longitude':item.longitude,'aria-label':item})
          }
          that.setData({
            markers:markers
          })
      }
    })
  }
})