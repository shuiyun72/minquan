<template>
	<view class="set">
	<uni-list>
		<sy-list-item title="修改密码" :showArrow="true" :clickable="true" @click="toNav('mima')"></sy-list-item>
		<sy-list-item title="意见反馈" :showArrow="true" :clickable="true" @click="toNav('yijian')"></sy-list-item>
		<sy-list-item title="联系客服" :showArrow="true" :clickable="true" @click="toNav('kefu')"></sy-list-item>
		<sy-list-item title="用户协议" :showArrow="true" :clickable="true" @click="toNav('xieyi')"></sy-list-item>
		<sy-list-item title="清除缓存" :showArrow="true" :clickable="true" @click="toNav('huancun')"></sy-list-item>
		<sy-list-item title="版本更新">
			<template v-slot:right="">
				<view class="addr_input">
					V1.0.0
				</view>
			</template>
		</sy-list-item>
	</uni-list>
	<view class="sub_btn_all mt100" @click="loginOut">
		退出登录
	</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				kefu:""
			};
		},
		onShow() {
			this.$getApi("/api/Document/detail",{type:"service"},res=>{
				console.log(res.data)
				this.kefu = res.data.tel
			})
		},
		methods:{
			toNav(el){
				if(el == "mima"){
					uni.navigateTo({
						url:"./editPhone"
					})
				}
				if(el == "yijian"){
					uni.navigateTo({
						url:"./yijian"
					})
				}
				if(el == "kefu"){
					uni.makePhoneCall({
					    phoneNumber: this.kefu //仅为示例
					});
				}
				if(el == "xieyi"){
					uni.navigateTo({
						url:"./xieyi"
					})
				}
				if(el == "huancun"){
					uni.showModal({
						title:"清除缓存",
						content:"是否确认清除缓存",
						success(res) {
							if(res.confirm == true){
								console.log('up')
							}else{
								console.log("down")
							}
						}
					})
				}
			},
			loginOut(){
				this.$store.commit('logout');
				uni.reLaunch({
					url:'../login/login'
				})
			}
		}
		
	}
</script>

<style lang="scss">
	page{
		background-color: #f0f0f0;
	}
.set{
	.sub_btn_all{
		text-align: center;
		background-color: #fff;
		padding: 24upx 0;
		font-size: 32upx;
	}
	.mt100{
		margin-top: 100upx;
	}
	.addr_input{
		flex:1;
		text-align: right;
		font-size: 28upx;
		color: #777;
	}
}

</style>
