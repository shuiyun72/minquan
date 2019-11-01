<template>
  <div class="box">
    <div class="title">商品录入</div>
    <el-form ref="form" :inline="true" :model="form" label-width="60px">
      <el-form-item label="名称">
        <el-input v-model="form.name" placeholder="请输入商品名称"></el-input>
      </el-form-item>
      <el-form-item label="条码">
        <el-input v-model="form.code" placeholder="请输入商品条码"></el-input>
      </el-form-item>
      <el-form-item label="单价">
        <el-input v-model="form.price" placeholder="请输入商品单价"></el-input>
      </el-form-item>
      <el-form-item label="数量">
        <el-input v-model="form.count" placeholder="请输入商品数量"></el-input>
      </el-form-item>
    </el-form>
    <div class="show_pic" v-if="pictureList.length>0">
        <img :src="item.base64" alt="" v-for="(item,index) in pictureList" :key="index"  @click="showPhoto(item.base64)">
    </div>
    <div class="flex_pic" @click="onPicHide" v-show="isPicShow">
      <img src="" class="flex_pic_img">
    </div>
    <div class="footer">
        <div class="button_footer">添加图片</div>
        <input type="file"  accept="image/*" capture="camera" id="imgPhoto">
        <div class="button_footer" @click="reset">重置</div>
        <div class="button_footer" @click="submitForm">上传</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Create",
  data() {
    return {
      form: {
        name: "",
        code: "",
        price: "",
        count: ""
      },
      pictureList:[],
      isPicShow:false
    };
  },
  created(){
    let formValue = window.localStorage.getItem("formValue");
    console.log(formValue)
    if(formValue){
      let sss = JSON.parse(formValue)
      this.form = sss;
    }
  },
  mounted(){
    this.openCamera(res=>{
      console.log(res)
      this.parsePictureFile(res)
    });
  },  
  watch:{
    form:{
      handler(newValue,oldValue){
        window.localStorage.setItem("formValue",  JSON.stringify(newValue));
      },
      deep:true
    }
  },
  methods: {
    addOpenCamera(){
      this.openCamera(this.parsePictureFile)
    },
    openCamera(callback){
      document.getElementById("imgPhoto").onchange = function() {
        var reader = new FileReader();
        console.log(reader);
        reader.onload = function(e) {
          //调用图片压缩方法：compress();
        };
        reader.readAsDataURL(this.files[0]);
        var fileSize = Math.round(this.files[0].size / 1024 / 1024); //以M为单位
        //this.files[0] 该信息包含：图片的大小，以byte计算 获取size的方法如下：this.files[0].size;
        if (!(callback instanceof Function)) {
          callback = this.parsePictureFile;
        }
        callback(this.files[0]);
      };
    },
    //压缩图片
    createCanvas() {
      // 创建画布
      var canvas = document.getElementById("canvas");
      if (!canvas) {
        var canvasTag = document.createElement("canvas");
        canvasTag.setAttribute("id", "canvas");
        canvasTag.setAttribute("style", "display:none;"); //隐藏画布
        document.body.appendChild(canvasTag);
        canvas = document.getElementById("canvas");
      }
      console.log(canvas)
      return canvas;
    },
    // 通过File Reader读取图片的fileName和base64编码，并保存到data.pictureList
    parsePictureFile(fileObj) {
      console.log("begin");
      var reader; 
      if(this.isPlus){
        reader = new window.plus.io.FileReader();
      }else{
        reader = new FileReader();
      }
      var image = new Image();
      var canvas = this.createCanvas();
      var ctx = canvas.getContext("2d");
      reader.readAsDataURL(fileObj, "utf-8");
      var _this = this;
      console.log(fileObj);
      reader.onloadend = event => {
        var result = event.target.result;
        var resultLast = "";
        image.onload = function() {
          // 图片加载完处理
          var imgScale = _this.imgScaleW(1000, image.width, image.height);
          canvas.width = imgScale.width;
          canvas.height = imgScale.height;
          ctx.drawImage(image, 0, 0, imgScale.width, imgScale.height);

          ctx.font = "26px Arial";
          ctx.textAlign = "right";
          ctx.textBaseline = "middle"; //更改字号后，必须重置对齐方式，否则居中麻烦。设置文本的垂直对齐方式
          // 设置文字阴影的颜色为黑色，透明度为90%
          ctx.shadowColor = "rgba(0, 0, 0, 0.9)";
          // 将阴影向右移动15px，向上移动10px
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 2;
          // 轻微模糊阴影
          ctx.shadowBlur = 2;
          // ctx.textAlign = 'center';
          ctx.fillStyle = "#00ffff";
          var fleft = canvas.width - 20;
          var ftop = canvas.height - 30;
          // let date = new Date();
          // ctx.fillText(date, fleft, ftop);

          var dataURL = canvas.toDataURL("image/jpeg"); // 图片base64
          ctx.clearRect(0, 0, imgScale.width, imgScale.height); // 清除画布
          resultLast = dataURL; //dataURL:处理成功返回的图片base64
          // console.log("end", event, this.pictureList.length);
          _this.pictureList.push({
            fileName: resultLast,
            base64: resultLast
          });
          console.log("push end", _this.pictureList.length);
          // _.find(this.pictureList, { fileName: event.target.fileName }).base64 =
          //   event.target.result;
          // 向父级组件发送change事件以及最新的list数据
         console.log(_this.pictureList)
        };
        image.src = result;
      };
      reader.onerror = err => {
        window.plus.nativeUI.alert("拍摄已取消");
      };
    },
    imgScaleW(maxWidth, width, height) {
      /* maxWidth:宽度或者高度最大值
       * width：宽度
       * height：高度
       * */
      var imgScale = {};
      var w = 0;
      var h = 0;
      if (width <= maxWidth && height <= maxWidth) {
        // 如果图片宽高都小于限制的最大值,不用缩放
        imgScale = {
          width: width,
          height: height
        };
      } else {
        if (width >= height) {
          // 如果图片宽大于高
          w = maxWidth;
          h = Math.ceil((maxWidth * height) / width);
        } else {
          // 如果图片高大于宽
          h = maxWidth;
          w = Math.ceil((maxWidth * width) / height);
        }
        imgScale = {
          width: w,
          height: h
        };
      }
      return imgScale;
    },
    onPicHide(){
      let _this = this;
      setTimeout(function(){
        _this.isPicShow = false;
      },100) 
    },
    showPhoto(url){
      document.getElementsByClassName("flex_pic_img")[0].src=url;
      this.isPicShow = true;
    },
    //重置数据
    reset(){
      this.form = {
        name: "",
        code: "",
        price: "",
        count: ""
      };
      this.pictureList = [];
    },
    //上传
    submitForm(){
      console.log(this.form)
      let newPictureList=[];
      this.pictureList.map(res=>{
        newPictureList.push(res.base64)
      })

      var formData = this.form;
      console.log(this.form)
      formData.imgurl = JSON.stringify(newPictureList);
      let this_ = this;
      this.$axios({
            url: '/createuser.php',
            method: 'post',
            responseType: 'json', // 默认的
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            data: this.qs.stringify(formData)
        }).then(function (res) {
            console.log(res)
            if(res.data.length > 20){
              alert("上传成功");
              this_.reset();
            }else{
              alert("上传失败，稍后再试");
            }
        }).catch(function (error) {
            console.log(error);
            alert("网络错误，请稍后再试");
        })
    }
  }
};
</script>

<style>
.box{
  padding-bottom:42px;
}
.title{
  padding: 6px 0;
  font-weight: bold;
  border-bottom: 1px solid #eee;
  margin-bottom: 10px;
}
.show_pic{
  width: 100%;
  border: 1px solid #999;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}
.show_pic img{
  height:100px;
  width: auto;
  max-width: 110px;
  padding: 2px;
}
.footer{
  width: 100%;
  height: 40px;
  line-height: 40px;
  position:fixed;
  left: 0;
  bottom: 0;
  display: flex;
}
#imgPhoto{
  position: absolute;
  opacity: 0;
  top: 0;
  left: 0;
  height: 40px;
  width: 32%;
}
.footer .button_footer{
  width: 32%;
  justify-content: center;
  background: rgb(212, 233, 216);
  height: 100%;
  margin-right: 2%;
}
.footer .button_footer:last-child{
  margin-right: 0;
}

.flex_pic{
  width: calc(100vw);
  height: calc(100vh);
  background: #eee;
  z-index: 1000;
  position:fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content:center;
  align-items: center
}
.flex_pic_img{
  height:96%;
  position: absolute;
}
@media screen and (max-width: 1156px){
  .flex_pic_img{
    width:96%;
    height:auto;
    position: absolute;
  }
}

</style>
