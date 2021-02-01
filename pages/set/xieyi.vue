<template>
	<view class="set_xieyi">
		<view class="pc_text">
		xxxxxx有限公司（以下简称“我们”）深知个人信息对您的重要性，并会尽全力保护您的个人信息安全可靠。我们致力于维持您对我们的信任，恪守以下原则，保护您的个人信息：权责一致原则、目的明确原则、选择同意原则、最少够用原则、确保安全原则、主体参与原则、公开透明原则等。同时，我们承诺，我们将按业界成熟的安全标准，采取相应的安全保护措施来保护您的个人信息。</view>
		<view class="pc_text">请在使用我们的产品（或服务）前，仔细阅读并了解本《用户协议》。</view>
		<view class="pc_text">一、我们如何收集和使用您的个人信息
		个人信息是指以电子或者其他方式记录的能够单独或者与其他信息结合识别特定自然人身份或者反映特定自然人活动情况的各种信息。</view>
		<view class="pc_text">我们仅会出于本政策所述的以下目的，收集和使用您的个人信息：</view>
		<view class="pc_text">（一）为您提供网上订购服务</view>
		<view class="pc_text">1、注册成为用户</view>
		<view class="pc_text">为完成创建账号，您需提供您手机号码；注册时您还可选择创建一个用户名和密码，便于日常快速登录。</view>
		<view class="pc_text">您提供的上述信息，将在您使用本服务期间持续授权我们使用。在您注销账号时，我们将停止使用并删除上述信息。</view>
		<view class="pc_text">2、根据您的位置展示服务项目、个性化推荐、提供上门服务</view>
		<view class="pc_text">为了向您展示您所在位置的可用服务项目，以及按您的位置为您提供上门服务，您需提供住宅小区及家庭地址等位置信息。</view>
		<view class="pc_text">上述信息将存储于中华人民共和国境内。如需跨境传输，我们将会单独征得您的授权同意。</view>
		<view class="pc_text">（二）开展内部数据分析和研究，第三方SDK统计服务，改善我们的产品或服务</view>
		<view class="pc_text">我们收集数据是根据您与我们的互动和您所做出的选择，包括您的隐私设置以及您使用的产品和功能。我们收集的数据可能包括SDK/API/JS代码版本、浏览器、互联网服务提供商、IP地址、平台、时间戳、应用标识符、应用程序版本、应用分发渠道、独立设备标识符、iOS广告标识符（IDFA)、网卡（MAC）地址、国际移动设备识别码（IMEI）、设备型号、终端制造厂商、终端设备操作系统版本、会话启动/停止时间、语言所在地、时区和网络状态（WiFi等）、硬盘、CPU和电池使用情况等。</view>
		<view class="pc_text">当我们要将信息用于本策略未载明的其它用途时，会事先征求您的同意。</view>
		<view class="pc_text">当我们要将基于特定目的收集而来的信息用于其他目的时，会事先征求您的同意。</view>
		<!-- <rich-text type="text" class="pc_text" :nodes="textHtml"></rich-text> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				textHtml:""
			};
		},
		mounted() {
			// this.$getApi('/App/Public/getArticle', {type:2}, resLei => {
			// 	console.log(resLei.data.content,"用户协议")
			// 	this.textHtml = resLei.data.content
			// })
		}
	}
</script>

<style lang="scss" scoped>
.set_xieyi{
	padding: 20upx 26upx;
	.pc_text{
		color: #666;
		font-size: 30upx;
		letter-spacing: 2upx;
		margin-bottom: 40upx;
	}
}

</style>
