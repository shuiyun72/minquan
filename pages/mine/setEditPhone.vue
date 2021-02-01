<template>
	<view class="login">
		<view class="icon_input_sy">
			<view class="iconfont icon19"></view>
			<input class="input" type="text" v-model="phone" placeholder="请输入新手机号" />
		</view>
		<view class="icon_input_sy">
			<view class="iconfont iconyanzhengma2"></view>
			<input class="input" type="text" v-model="yzm" placeholder="请输入短信验证码" />
			<text class="iconfont iconshouye_shugang_shijiantixing"></text>
			<text class="yzm" @click="getYZM" v-if="timeout<0">发送验证码</text>
			<text class="yzm" v-if="timeout>=0">{{timeout}}s 重新获取</text>
		</view>
		<view class="sub_top">
			<button class="btn blue ms round" @click="loginIn">提交</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isShow: false,
				phone: "",
				yzm: "",
				timeout: -1
			};
		},
		onShow() {
		
		},
		methods: {
			getYZM(){
				let data = {
					mobile:this.phone,
					event:"changemobile"
				}
				// ,
				// event: "mobilelogin"
				this.timeout = 30;
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
			loginIn() {
				this.$getApi("/api/User/changemobile", {mobile:this.phone,captcha:this.yzm}, res => {
					console.log(res.data, "修改手机号")
					uni.navigateTo({
						url:"../home/msg?title=修改成功"
					})
				})
			}

		}
	}
</script>

<style lang="scss" scoped>
	.login {
		padding: 40upx 60rpx 0 60rpx;
		.iconfont{
			color: #666;
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
		.s_bz_s{
			padding-top: 16upx;
			color: #999;
			transform: scale(.9);
			text-align: center;
			font-size: 28upx;
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

		.mine_l {
			text-align: center;
			margin-bottom: 50upx;

			.mine_logo {
				width: 230upx;
			}
		}

		.sub_top {
			margin-top: 160upx;
		}

		.login_wjmm {
			font-size: 20upx;
			color: #999;
			padding: 20upx 0 90upx;

			&.b {
				color: #333;
			}
		}
	}
</style>
