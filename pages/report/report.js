// pages/report.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    longitude:0.00,//经度
    latitude:0.00,//维度
    address:'',//地址
    description:''//描述
  },

  options: {
    addGlobalClass: true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '上报路况',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 选择位置
   */
  onChangeAddress:function(){
    let that=this
    wx.chooseLocation({
      success:function(res){
        console.log(res)
        that.setData({
          address:res.address,
          longitude:res.longitude,
          latitude:res.latitude
        })
      }
    })
  },
  /**
   * 用户点击上报
   */
  onUpload:function(){
    if(!this.data.address||!this.data.latitude||!this.data.longitude){
      wx.showToast({
        title: '请选择或者输入位置信息',
        icon:'none'
      })
      return;
    }
    if(!this.data.description){
      wx.showToast({
        title: '请说明当前位置发生了什么',
        icon:'none'
      })
      return;
    }

    wx.showToast({
      title: '上报成功！感谢你的上报',
      duration:5000,
      success:function(){
        wx.navigateBack({
          delta: 1
        })
      }
    })
    
  }
})