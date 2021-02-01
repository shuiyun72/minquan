<template>
	<view class="msg_all">
		<view class="t_img">
			<image src="../../static/img/wancheng.png" class="img"></image>
		</view>
		<!-- 编辑信息完成 -->
		<view v-if="barTitle == '修改完成'">
			<view class="msg_title">
				编辑店铺信息提交成功
			</view>
			<view class="msg_title2">
				正在审核 , 审核成功后
			</view>
			<view class="msg_title2">
				相关信息会进行更改
			</view>
			<view style="height:120upx">
		
			</view>
			<view class="msg_btn">
				<button class="lg btn blue round" @click="toNav('home')">返回首页</button>
			</view>
		</view>
		<!-- 反馈成功 -->
		<view v-if="barTitle == '反馈成功'">
			<view class="msg_title">
				您反映的问题,我们会尽快解决,谢谢合作
			</view>
			<view style="height:120upx">
		
			</view>
			<view class="msg_btn">
				<button class="lg btn blue round" @click="toNav('home')">返回首页</button>
			</view>
		</view>
		<!-- 反馈成功 -->
		<view v-if="barTitle == '反馈成功'">
			<view class="msg_title">
				您反映的问题,我们会尽快解决,谢谢合作
			</view>
			<view style="height:120upx">
		
			</view>
			<view class="msg_btn">
				<button class="lg btn blue round" @click="toNav('home')">返回首页</button>
			</view>
		</view>
		<!-- 提现申请成功 -->
		<view v-if="barTitle == '提现申请成功'">
			<view class="msg_title">
				提现申请成功
			</view>
			<view class="msg_title2">
				1-7个工作日内到账,若未及时到账 
			</view>
			<view class="msg_title2">
				请联系线下客服人员
			</view>
			<view style="height:120upx">
		
			</view>
			<view class="msg_btn">
				<button class="lg btn blue round" @click="toNav('qianbao')">返回我的钱包</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				msgShow: "",
				pageType: "",
				barTitle: "购买成功"
			};
		},
		onLoad(ph) {
			if (ph.title) {
				uni.setNavigationBarTitle({
					title:ph.title
				})
				this.barTitle = ph.title;
			}
			if (ph.msgShow) {
				this.msgShow = ph.msgShow
			}
		},
		methods: {
			back() {
				if (this.barTitle == '付款成功') {

				}
				uni.switchTab({
					url: './home'
				})
				return true;
			},

			toNav(el) {
				if (el == "home"){
					uni.reLaunch({
						url:"../home/home"
					})
				}
				if (el == "qianbao"){
					uni.navigateBack({
						delta:2
					})
				}
			},

		}
	}
</script>

<style lang="scss" scoped>
	.msg_all {
		padding: 26upx;
		color: #666;
		text-align: center;

		.t_img {
			padding: 120upx 0 40upx;
			text-align: center;

			.img {
				width: 140upx;
				height: 140upx;
			}
		}

		.msg_title {
			font-size: 34upx;
			font-weight: bold;
			padding-bottom: 10upx;
		}
		.msg_title2{
			font-size: 30upx;
			color: #999;
		}
		.msg_info {
			padding: 16upx 0;
		}

		.msg_btn {
			padding: 0 30upx;
		}
	}
</style>
