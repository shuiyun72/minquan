<template>
    <div>
        <table class="show_table" border="1" cellspacing="0">
            <thead>
                <tr>
                    <th>
                        编号
                    </th>
                    <th>
                        名称
                    </th>
                    <th>
                        条码
                    </th>
                    <th>
                        单价
                    </th>
                    <th>
                        数量
                    </th>
                    <th>
                        操作
                    </th>
                </tr>
            </thead>
            <tbody>
                <template v-for="item in tableData">
                <tr>
                    <td rowspan="2">{{item.id}}</td>
                    <td>{{item.name}}</td>
                    <td>{{item.code}}</td>
                    <td>{{item.price}}</td>
                    <td>{{item.count}}</td>
                    <td>暂无</td>
                </tr>
                <tr>
                    <td colspan="5" class="img_td">
                        <img :src="'static/api/'+url" alt="" 
                            v-for="(url,index) in item.imgurl" :key="index" 
                            class="td_img"
                            @click="showPhoto(url)"
                        >
                        <span v-if="item.imgurl[0] == ''" class="img_td_text">
                            暂无预览图片
                        </span>
                    </td>
                </tr>
                </template>
            </tbody>
        </table>
        <div class="flex_pic" @click="onPicHide" v-show="isPicShow">
            <img src="" class="flex_pic_img">
        </div>
    </div>
</template>
<script>
import _ from 'lodash';
export default {
  name: "List",
  data() {
    return {
      tableData:[],
      imgData:[],
      isPicShow:false
    }
  },
  mounted(){
      this.getData();
  },
  methods:{
    getData(){
        let this_ = this; 
        this.$axios({
            url: '/CshowDetails.php',
            method: 'post',
            responseType: 'json'
        }).then(function (res) {
            console.log(res)
            this_.tableData = res.data;
            let imgData = [];
            _.map(this_.tableData,url=>{
                let childUrl = url.imgurl.split("|");
                let childI = [];
                _.map(childUrl,child=>{
                    childI.push(child);
                })
                url.imgurl = childI;
            })
            this_.imgData = imgData;
        }).catch(function (error) {
            console.log(error);
            alert("网络错误，请稍后再试");
        })
    },
    showPhoto(url){
      document.getElementsByClassName("flex_pic_img")[0].src= 'static/api/'+url;
      this.isPicShow = true;
    },
    onPicHide(){
      let _this = this;
      setTimeout(function(){
        _this.isPicShow = false;
      },100) 
    },
  }
}
</script>
<style scoped>
.show_table{
    border-color:#eee;
    width: 98%;
    margin: 0 auto;
}
.show_table th{
    padding: 4px 0;
    background: #cccbcb;
}
.show_table tr:nth-child(2n-1) td,.img_td_text{
    padding: 4px 0;
}
.img_td{
    text-align: left;
}
.td_img{
    width: 60px;
    max-height: 60px;
    margin-right:2px;
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