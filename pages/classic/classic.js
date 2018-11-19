var icons=require("../../models/index-data.js");

Page({


data:{

},
onLoad:function()
{
  this.setData({
    icons:icons.icons
  })
},
  onSwiperItemTap:function(event)
  {
    var postId = event.target.dataset.postid;
    console.log(postId);
  }

  })