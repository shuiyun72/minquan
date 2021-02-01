<template>
	<view class="return_msg">
		<view class="re_title">问题和意见</view>
		<textarea v-model="ques" placeholder="请简要描述您的问题和意见" class="textarea_l t1" />
		<view class="re_title">联系方式</view>
		<textarea v-model="phone" placeholder="请留下您的联系方式" class="textarea_l t2" />
		<view class="bh160"></view>
		<view class="bg_btn_sub_sy"><view class="btn" @click="nativeTo">提交</view></view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			ques: '',
			phone: ''
		};
	},
	computed:{
		userInfo(){
			return this.$store.state.userInfo;
		}
	},
	methods: {
		nativeTo() {
			if(!this.ques || !this.phone){
				this.$msg('请完善信息')
				return false;
			}
			let data = {
				content:this.ques,
				tel: this.phone,
				type:"client",
				nickname:this.userInfo.nickname
			}
			this.$getApi('/api/Feedback/add',data,res=>{
				console.log(res)
				uni.navigateTo({
					url: '../home/msg?title=反馈成功'
				});

			})
		}
	}
};
</script>

<style lang="scss" scoped>
.return_msg {
	background-color: #f0f0f0;
	height: 100vh;
	.bh160{
		height: 160upx;
	}
	.bg_btn_sub_sy {
		padding: 0 26upx;
		.btn {
			background-color: $uni-bl;
			color: #fff;
			padding: 32upx;
			text-align: center;
			border-radius: 60upx;
		}
	}
	.re_title {
		padding: 26upx;
		font-size: 32upx;
		color: #666;
	}
	.textarea_l {
		background-color: #fff;
		font-size: 28upx;
		padding: 26upx;
		width: 100%;
		box-sizing: border-box;
		&.t1 {
			height: 150upx;
		}
		&.t2 {
			height: 90upx;
		}
	}
	.msg_btn {
		padding: 0 60upx;
	}
}
</style>
