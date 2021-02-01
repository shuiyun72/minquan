<template>
	<view class="set_yinsi">
		
<!-- 		<view class="pc_text">
		第一部分 定义
		个人信息：指以电子或者其他方式记录的能够单独或者与其他信息结合识别特定自然人身份或者反映特定自然人活动情况的各种信息。</view>
		<view class="pc_text">个人敏感信息：指包括身份证件号码、个人生物识别信息、银行账号、财产信息、行踪轨迹、交易信息、14岁以下（含）儿童信息等的个人信息（我们将在本隐私权政策中对具体个人敏感信息以粗体进行显著标识）。</view>
		<view class="pc_text">个人信息删除：指在实现日常业务功能所涉及的系统中去除个人信息的行为，使其保持不可被检索、访问的状态。"</view> -->
		<view class="pc_text" v-html="hezuo.content"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				swMsg: '',
				hezuo:""
			};
		},
		mounted() {
			this.$getApi("/api/Document/detail",{type:"privacy"},res=>{
				console.log(res.data)
				this.hezuo = res.data
			})
		},
	}
</script>

<style lang="scss" scoped>
.set_yinsi{
	padding: 20upx 26upx;
	.pc_text{
		color: #666;
		font-size: 30upx;
		letter-spacing: 2upx;
		margin-bottom: 40upx;
	}
}
</style>
