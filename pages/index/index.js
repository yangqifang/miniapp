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
    if(app.globalData.userInfo){
      this.setData({
        isClosePanl:true
      })
    }else{
      this.setData({
        isClosePanl:false
      })
    }
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
    this.setData({
      showMarkerModel:true
    })
  },
  mapTap:function(){
    this.setData({
      showMarkerModel:false
    })
  },
  getuserinfo:function(res){
    let that=this
    let userInfo=res.detail.userInfo
    console.log(userInfo)
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
                    console.log('用户存在')
                    app.globalData.userInfo=data
                    console.log(app.globalData.userInfo)
                    that.setData({
                      isClosePanl:true
                    })
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
  }
})