<template>
	<view class="msg_all">
		<!-- left-icon="arrowleft" -->
		<!-- <uni-nav-bar color="#333333" background-color="#ffffff" :status-bar="true" :title="barTitle" @clickLeft="back" /> -->
		<view class="t_img">
			<image src="../../static/img/wanc.png" class="img"></image>
		</view>
		<!-- 支付完成 -->
		<view v-if="barTitle == '支付完成'">
			<view class="msg_title">
				支付完成
			</view>
			<view style="height:120upx">
		
			</view>
			<view class="msg_btn">
				<button class="lg btn blue round" @click="toNav('dingdan')">查看订单</button>
			</view>
		</view>
		<!-- 订单订单 -->
		<view v-if="barTitle == '凭证提交成功'">
			<view class="msg_title">
				凭证提交成功
			</view>
			<view style="height:120upx">

			</view>
			<view class="msg_btn">
				<button class="lg btn blue round" @click="toNav('mine')">返回个人中心</button>
			</view>
		</view>
		<!-- 修改手机号 -->
		<view v-if="barTitle == '修改成功'">
			<view class="msg_title">
				修改手机号成功
			</view>
			<view style="height:120upx">

			</view>
			<view class="msg_btn">
				<button class="lg btn blue round" @click="toNav('shezhi')">返回设置</button>
			</view>
		</view>
		<!-- 意见反馈 -->
		<view v-if="barTitle == '反馈成功'">
			<view class="msg_title">
				您反映的问题,我们会尽快解决,谢谢合作
			</view>
			<view style="height:120upx">
		
			</view>
			<view class="msg_btn">
				<button class="lg btn blue round" @click="toNav('fankui')">返回</button>
			</view>
		</view>
		<!-- 评价 -->
		<view v-if="barTitle == '评价成功'">
			<view class="msg_title">
				评价成功,谢谢合作
			</view>
			<view style="height:120upx">
		
			</view>
			<view class="msg_btn">
				<button class="lg btn blue round" @click="toNav('pingjia')">返回</button>
			</view>
		</view>
		<!-- 入驻申请 -->
		<view v-if="barTitle == '入驻申请'">
			<view class="msg_title">
				入驻申请提交成功
			</view>
			<view class="msg_title2">
				正在审核,审核完成后
			</view>
			<view class="msg_title2">
				客服人员将会与您联系
			</view>
			<view style="height:80upx">
		
			</view>
			<view class="msg_btn">
				<button class="lg btn blue round" @click="toNav('mine')">返回个人中心</button>
			</view>
		</view>
		<!-- 入驻申请 -->
		<view v-if="barTitle == '新用户注册'">
			<view class="msg_title">
				注册成功
			</view>
			<view class="msg_title2">
				正在审核,审核完成后
			</view>
			<view class="msg_title2">
				客服人员将会与您联系
			</view>
			<view style="height:80upx">
		
			</view>
			<view class="msg_btn">
				<button class="lg btn blue round" @click="toNav('home')">返回首页</button>
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
				this.barTitle = ph.title;
				uni.setNavigationBarTitle({
					title:ph.title
				})
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
				if (el == "dingdan"){
					uni.navigateTo({
						url: '../order/order?ins=2'
					})
				}
				if (el == "daifukuan"){
					uni.navigateTo({
						url: '../order/order?ins=2'
					})
				}
				if(el == "shezhi"){
					uni.navigateBack({
						delta:2
					})
				}
				if(el == "fankui"){
					uni.navigateBack({
						delta:2
					})
				}
				if(el == "mine"){
					uni.switchTab({
						url:"../mine/mine"
					})
				}
				if(el == "pingjia"){
					uni.switchTab({
						url:"../mine/mine"
					})
				}
				if(el == "home"){
					uni.switchTab({
						url:"./home"
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
			font-size: 36upx;
			font-weight: bold;
			margin-bottom: 10upx;
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
