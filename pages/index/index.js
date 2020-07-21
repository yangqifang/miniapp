//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    position:{
      longitude:0.00,
      latitude:0.00
    },
    //是否开启卫星地图
    satellite:false,
    //是否开启实施路况
    traffic:false,
  },
  onLoad: function () {
    let self=this
    wx.getLocation({
      type: 'gcj02',
      altitude: true,
      isHighAccuracy:true,
      success (res){
        self.setData({
          position:{
            latitude:res.latitude,
            longitude:res.longitude
          }
        })
      }
    })
    wx.startLocationUpdate({
      success: (res) => {
        wx.onLocationChange((result) => {
          console.log(result)
        })
      },
    })
  },
  report:function(){
    wx.navigateTo({
      url: '/pages/report/report',
    })    
  }
})
