<template>
	<view class="edit_phone">
		<view class="mine_l">
			<image src="../../static/img/logo.png" class="mine_logo" mode="widthFix"></image>
		</view>
		<view class="edit_body">
			
			<view class="icon_input_sy" v-if="isShow">
				<view class="iconfont icon19"></view>
				<input class="input" type="text" v-model="phone" placeholder="请输入手机号" />
			</view>
			<view class="icon_input_sy">
				<view class="iconfont iconyanzhengma2"></view>
				<input class="input" type="text" v-model="yzm" placeholder="请输入验证码" />
				<text class="iconfont iconshouye_shugang_shijiantixing"></text>
				<text class="yzm" @click="getYZM" v-if="timeout<0">发送验证码</text>
				<text class="yzm" v-if="timeout>=0">{{timeout}}s 重新获取</text>
			</view>
		</view>
		<view class="zhuce">
			<view class="zhuce_btn" @click="handleZhuce">
				新用户注册
			</view>
		</view>
		<view class="sub_top">
			<button class="btn blue ms round" @click="next">登录</button>
		</view>
		<view class="login_pro">
			 <label class="radio" @click="handlePro"><radio value="r1" :checked="isPro" class="pro_radio"/>同意</label>
			 <view class="pro_text">
			 	<text class="">
			 		登录即表示您已同意
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
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isShow: true,
				phone: "",
				yzm: "",
				timeout: -1,
				isPro:false
			};
		},
		onShow() {
			
		},
		methods: {
			handleZhuce(){
				uni.navigateTo({
					url:"./loginIn"
				})
			},
			//获取验证码
			getYZM(){
				let data = {
					mobile:this.phone,
					event:"mobilelogin"
				}
				// ,
				// event: "mobilelogin"
				this.timeout = 60;
				let interL = setInterval(()=>{
					this.timeout--
					if(this.timeout<0){
						clearInterval(interL)
					}
				},1000)
				this.$getApi('/api/Sms/send',data,res=>{
					console.log(res)
					
					this.$msg('请在短信中查看验证码')
				},"false")
				
			},
			next(){
				if(!this.isPro){
					this.$msg("请点击同意用户协议和用户隐私")
					return false;
				}
				let data = {
					mobile:this.phone,
					captcha:this.yzm
				}
				this.$getApi('/api/User/mobilelogin',data,res=>{
					console.log(res)
					this.$store.commit("login",res.data.userinfo)
					uni.switchTab({
						url:"../home/home"
					})
				},"false")
				
			},
			handlePro(){
				this.isPro = !this.isPro
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
			}

		}
	}
</script>

<style lang="scss" scoped>
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
	.icon_input_sy{
		.input{
			width: 300upx;
		}
	}
	.mine_l {
		text-align: center;
		margin-bottom: 100upx;
	
		.mine_logo {
			width: 230upx;
			height: 230upx;
		}
	}
	.edit_body{
		padding: 0upx 0 10upx;
	}
	.zhuce{
		padding: 6upx 0 100upx;
	}
	.zhuce_btn{
		color: $uni-bl;
	}
	.edit_phone {
		.s_bz {
			padding-top: 10upx;
			color: #999;
			transform: scale(.9);
			text-align: center;
		}
	}

	.mine_l_t {
		text-align: center;

		.t {
			padding: 100upx 0 50upx;
		}

		.wx {
			width: 80upx;
		}
	}

	.sub_top {
		margin-top: 40upx;
	}

	.edit_phone {
		padding: 40upx 60rpx 0 60rpx;

		.iconshouye_shugang_shijiantixing {
			font-size: 38upx;
			color: #999;
		}

		.yzm {
			font-size: 25upx;
			color: $uni-bl;
		}
	}

	.login_wjmm {
		font-size: 20upx;
		color: #999;
		padding: 20upx 0 90upx;

		&.b {
			color: #333;
		}
	}
</style>
