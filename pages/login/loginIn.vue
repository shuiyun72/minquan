<template>
	<view class="edit_login">
		<view class="edit_body">
			<!-- <view class="icon_input_sy">
				<view class="iconfont iconyonghuming"></view>
				<input class="input" type="text" v-model="name1" placeholder="请输入昵称" />
			</view> -->
			
			<view class="icon_input_sy" v-if="isShow">
				<view class="iconfont icon19"></view>
				<input class="input" type="text" v-model="phone" placeholder="请输入手机号 ( 登录账号 )" />
			</view>
			<view class="icon_input_sy">
				<view class="iconfont iconyanzhengma2"></view>
				<input class="input" type="text" v-model="yzm" placeholder="请输入验证码" />
				<text class="iconfont iconshouye_shugang_shijiantixing"></text>
				<text class="yzm" @click="getYZM" v-if="timeout<0">发送验证码</text>
				<text class="yzm" v-if="timeout>=0">{{timeout}}s 重新获取</text>
			</view>
			<view class="icon_input_sy">
				<view class="iconfont icontuandui"></view>
				<input class="input" type="text" v-model="danwei" placeholder="请输入单位名称" />
			</view>
			<view class="sub_top">
				<button class="btn blue ms round" @click="next">注册</button>
			</view>
			<view class="login_pro">
				 <label class="radio" @click="handlePro"><radio value="r1" :checked="isPro" class="pro_radio"/>同意</label>
				 <view class="pro_text">
				 	<text class="">
				 		注册即表示您已同意
				 	</text>
					 <text class="xiyi" @click="navigateToPro('xieyi')">
					 	用户协议
					 </text>
					 和
					 <text class="xiyi" @click="navigateToPro('yinsi')">
					 	用户隐私
					 </text>
				 </view>
			</view>
			<!-- <view class="icon_input_sy"  @click="selAddress">
				<view class="iconfont iconlocation"></view>
				<text class="text_bl2">定位</text>
				<view class="iconfont iconjiantou"></view>
			</view>
			<textarea v-model="addressDetail" placeholder="详细地址 : 如道路 门牌号 位置描述 店铺名称等" class="address_textarea"/> -->
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				name1:"",
				danwei:"",
				isShow: true,
				phone: "",
				yzm: "",
				timeout: -1,
				isPro: false,
				addressDetail:"",
				lngLat:"",
				zhengjianImg:""
			};
		},
		methods: {
			selAddress(){
				console.log("cc")
				let this_ = this;
				uni.chooseLocation({
					success: (res) => {
						console.log(res,JSON.stringify(res),"94hang")
						this_.addressDetail =res.address?res.address:res.name;
						this_.lngLat = [res.longitude,res.latitude];
					}
				})
			},
			next(){
				if(!this.isPro){
					this.$msg("请点击同意用户协议和用户隐私")
					return false;
				}
				let data = {
					username:this.phone,
					mobile:this.phone,
					code:this.yzm,
					// img:this.zhengjianImg
					company:this.danwei
				}
				this.$getApi('/api/User/register',data,res=>{
					console.log(res)
					uni.reLaunch({
						url:"../home/msg?title=新用户注册"
					})
				},"false")
				
			},
			handlePro(){
				this.isPro = !this.isPro
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
			//获取验证码
			getYZM() {
				let data = {
					mobile: this.phone,
					event:"register"
				}
				// ,
				// event: "mobilelogin"
				this.timeout = 60;
				let interL = setInterval(() => {
					this.timeout--
					if (this.timeout < 0) {
						clearInterval(interL)
					}
				}, 1000)
				this.$getApi('/api/Sms/send', data, res => {
					console.log(res)

					this.$msg('请在短信中查看验证码')
				}, "false")

			},
			navigateToPro(el){
				console.log(el)
				if(el=='xieyi'){
					uni.navigateTo({
						url:"../mine/setXieyi"
					})
				}
				if(el == 'yinsi'){
					
					uni.navigateTo({
						url:"./yinsi"
					})
					console.log(el)
				}
			},
			upImg(el) {

				let this_ = this;
				uni.chooseImage({
					count: 1,
					sizeType: ['copressed'],
					success(res) {
						//因为有一张图片， 输出下标[0]， 直接输出地址
						console.log(res)
						let imgFiles = res.tempFilePaths[0]
						this_.zhengjianImg = res.tempFilePaths[0];
						console.log(this_.zhengjianImg)
						return false;
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
				
			},
		}
	}
</script>

<style lang="scss">
	.edit_login {

		padding: 0upx 60rpx 0 60rpx;
		.sub_top{
			padding-top: 220upx;
		}
		.login_pro{
			display: flex;
			font-size: 26upx;
			align-items: baseline;
			color: #666;
			padding-top: 40upx;
			.radio{
				display: inline-flex;
				align-items: baseline;
				width: 116upx;
				flex-shrink: 0;
			}
			.pro_radio{
				transform: scale(.7);
			}
			.pro_text{
				margin-left: 20upx;
				// display: inline-flex;
				flex:1;
				.xiyi{
					color: $uni-bl;
					padding: 0 10upx;
				}
			}
		}
		.touxiang_info{
			display: flex;
			// border-bottom: 1upx solid #f0f0f0;
			.cc_img{
				padding-top: 20upx;
				color: #999;
				font-size: 30upx;
			}
		}
		
		.address_textarea{
			padding: 20upx 0upx;
			font-size: 30upx;
			border-top: 1upx solid #f0f0f0;
			margin: 0 26upx;
		}
		.iconjiantou{
			font-size: 38upx;
			color: #999;
		}
		.text_bl2{
			font-size: 28upx;
			width: 100%;
			text-align: right;
		}
		.iconshouye_shugang_shijiantixing {
			font-size: 38upx;
			color: #999;
		}

		.yzm {
			font-size: 25upx;
			color: $uni-bl;
		}

		.s_bz {
			padding-top: 10upx;
			color: #999;
			transform: scale(.9);
			text-align: center;
		}

		.edit_body {
			padding: 0upx 0 10upx;

			.icon_input_sy {
				.input {
					width: 300upx;
				}
			}
		}
	}
</style>
