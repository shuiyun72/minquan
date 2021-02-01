<template>
	<view class="shop_store">
		<view class="header_t">
			<image :src="logoImg" class="h_img" mode="" @click="upImg('logo')"></image>
			<view class="text" v-if="noEdit">
				李小胖生鲜蔬菜
			</view>
			<view class="text"  v-if="!noEdit">
				上传批发商logo或门头照
			</view>
		</view>
		<view class="m26_title_sy">
			<view class="iconfont iconaishenghuo-shanghuzhongxin"> <text class="cc">批发商信息 </text></view>
		</view>
		<uni-list>
			<sy-list-item title="商家名称">
				<template v-slot:right="">
					<input :disabled="noEdit" type="text" v-model="shopName" maxlength="16" placeholder="请输入商家名称" class="addr_input" />
				</template>
			</sy-list-item>
			<sy-list-item title="商家地址" :showArrow="true" @click="selNav('address')">
				<template v-slot:right="">
					<view class="addr_input">
						{{shopAddress?shopAddress:"请选择地址"}}
					</view>
				</template>
			</sy-list-item>
			<sy-list-item title="商家宣传语">
				<template v-slot:right="">
					<input :disabled="noEdit" type="text" v-model="shopText" maxlength="16" placeholder="请输入宣传语" class="addr_input" />
				</template>
			</sy-list-item>
			
			<sy-list-item title="营业执照" :point="true" note="请确保证件完整,<text style='color:#FF8F3B'>编号</text>,<text style='color:#FF8F3B'>印章</text>,<text style='color:#FF8F3B'>文字</text>,照片均清晰可见 (可上传一张)"></sy-list-item>
			<view class="photo_list">
				<view class="photo_btn" @click="upImg('zhengjian')" v-if="!noEdit">
					<image src="../../static/img/shangc.png" class="img_photp" mode=""></image>
					<view class="text">
						上传照片
					</view>
				</view>
				<view class="photo_btn" v-if="zhengjianImg != ''">
					<image :src="zhengjianImg" class="img_photp" mode=""></image>
					<view class="iconfont iconyduicuowushixin" @click="delList('zhengjian')"></view>
				</view>
			</view>
		</uni-list>
		<view class="m26_title_sy">
			<view class="iconfont iconpersonnone"> <text class="cc">店主信息 </text></view>
		</view>
		<uni-list>
			<sy-list-item title="店主姓名">
				<template v-slot:right="">
					<input :disabled="noEdit" type="text" v-model="userName" maxlength="16" placeholder="请输入店主姓名" class="addr_input" />
				</template>
			</sy-list-item>
			<sy-list-item title="手机号码">
				<template v-slot:right="">
					<input :disabled="noEdit" type="text" v-model="userPhone" maxlength="16" placeholder="请输入手机号码" class="addr_input" />
				</template>
			</sy-list-item>
			<sy-list-item title="身份证号码">
				<template v-slot:right="">
					<input :disabled="noEdit" type="text" v-model="userShenfen" maxlength="30" placeholder="请输入身份证号码" class="addr_input" />
				</template>
			</sy-list-item>
			
			<sy-list-item title="身份证" :point="true" note="请确保证件完整,<text style='color:#FF8F3B'>上传正反两面</text>,身份证照片 (两张)"></sy-list-item>
			<view class="photo_list">
				<view class="photo_btn" @click="upImg('shenfen')" v-if="!noEdit">
					<image src="../../static/img/shangc.png" class="img_photp" mode=""></image>
					<view class="text">
						上传身份证照片
					</view>
				</view>
				<view class="photo_btn" v-for="(item,index) in imgList2">
					<image :src="item" class="img_photp" mode=""></image>
					<view class="iconfont iconyduicuowushixin" @click="delList('shenfen',index)"></view>
				</view>
			</view>
		</uni-list>
		<view class="sub_top m26">
			<button class="btn  ms" @click="next" v-if="noEdit">编辑店铺</button>
			<button class="btn  ms" @click="next" v-if="!noEdit">立即提交</button>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from "vuex";
	import _ from "../../until/lodash";
	export default {
		data() {
			return {
				noEdit:false,
				logoImg:"../../static/img/mentz.png",
				logoImgUrl:"",
				shopName:"",
				shopAddress:"",
				shopText:"",
				zhengjianImg:"",
				zhengjianImgUrl:"",
				imgList2:[],
				imgList2Url:[],
				userName:"",
				userPhone:"",
				userShenfen:""
			};
		},
		onShow() {
			uni.getLocation({
			    type: 'wgs84',
			    success: function (res) {
			        console.log('当前位置的经度：' + JSON.parse(res));
			        console.log('当前位置的纬度：' + res.latitude);
			    }
			});
		},
		computed: {
			...mapState(["httpp", "SystemInfo", "userInfo", "shopCar", "location"]),
		},
		methods:{
			upImg(el) {
				if(!this.noEdit){
				let this_ = this;
				uni.chooseImage({
					count: 1,
					sizeType: ['copressed'],
					success(res) {
						//因为有一张图片， 输出下标[0]， 直接输出地址
						let imgFiles = res.tempFilePaths[0]
						uni.uploadFile({
							url: this_.httpp+'/api/Common/upload', //仅为示例，非真实的接口地址
							filePath: imgFiles,
							name: 'file',
							formData: {
								'token': this_.userInfo.token
							},
							success: (uploadFileRes) => {
								let imgRest = JSON.parse(uploadFileRes.data)
								console.log(imgRest.data.url)
								if (el == "logo") {
									this_.logoImg = imgFiles;
									this_.logoImgUrl = imgRest.data.url;
								}
								if (el == "zhengjian") {
									this_.zhengjianImg = imgFiles;
									this_.zhengjianImgUrl = imgRest.data.url;
								}
								if (el == "shenfen") {
									this_.imgList2.push(imgFiles);
									this_.imgList2Url.push(imgRest.data.url);
								}
							}
						});
								
						
					},
					fail(err){
						this_.$msg("不支持您上传的图片格式")
					}
				})
				}
			},
			delList(el,index){
				if(el == 'zhengjian'){
					this.zhengjianImg = "";
					this.zhengjianImgUrl = "";
				}
				if(el == 'shenfen'){
					this.imgList2.splice(index,1)
					this.imgList2Url.splice(index,1)
				}
			},
			next(){
	
				if(this.noEdit){
					this.noEdit = false;
				}else{
					// this.noEdit = true;
					// if(this.zhengjianImgUrl.length == 0 || this.imgList2Url.length == 0 || this.logoImgUrl.length == 0){
					// 	this.$msg("请完善信息")
					// 	return false;
					// }
					let dataL = {
						type:"1",
						logo:this.logoImgUrl,
						name:this.shopName,
						// address:this.shopAddress,
						address:"无名乡",
						desc:this.shopText,
						business_images:this.zhengjianImgUrl.toString(),
						boss_name:this.userName,
						tel:this.userPhone,
						idcard:this.userShenfen,
						idcarrd_images:this.imgList2Url.toString()
					}
					console.log(dataL)			
					this.$getApi("/api/Merchant/apply", dataL, res => {
						console.log(res.data,"入驻/修改 申请")
						uni.reLaunch({
							url:"../home/msg?title=入驻申请"
						})
						
					})
				}
			},
			selNav(el){
				let this_ = this;
				if(el == 'address'){
					uni.chooseLocation({
					    success: function (res) {
							this_.shopAddress = res.address ? res.address :res.name;
					        console.log('位置名称：' + res.name);
					        console.log('详细地址：' + res.address);
					        console.log('纬度：' + res.latitude);
					        console.log('经度：' + res.longitude);
					    }
					});
				}
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #f0f0f0;
	}
	.m26_title_sy{
		margin: 0 26upx;
		padding: 20upx 0;
		.iconfont{
			font-size: 30upx;
			color: #666;
			.cc{
				margin-left: 10upx;
			}
		}
	}
.shop_store{
	.sub_top {
		margin-top: 60upx;
		padding-bottom: 80upx;
		.btn{
			background-color: $uni-bl;
			color: #fff;
		}
	}
	.photo_list {
		display: flex;
		flex-wrap: wrap;
		padding: 20upx 0upx 20upx 26upx;
	
		.photo_btn {
			width: 300upx;
			height: 160upx;
			margin:0 20upx 20upx 0;
			position: relative;
	
			.text {
				width: 300upx;
				position: absolute;
				text-align: center;
				bottom: 30upx;
				color: #999;
				transform: scale(.9);
			}
	
			.iconyduicuowushixin {
				position: absolute;
				top: 0;
				right: 0;
				color: $uni-bl;
			}
	
			.img_photp {
				width: 300upx;
				height: 160upx;
			}
		}
	}
	.addr_input{
		flex:1;
		text-align: right;
		font-size: 28upx;
		color: #777;
	}
	.header_t{
		background-color: $uni-bl;
		padding: 30upx 0;
		text-align: center;
		color: #f0f0f0;
		.h_img{
			width: 140upx;
			height: 140upx;
		}
		.text{
			font-size: 30upx;
			padding-top: 10upx;
		}
	}
	
}
</style>
