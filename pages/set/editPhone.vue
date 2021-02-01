<template>
	<view class="eidt_phone">
		<uni-list>
			<sy-list-item title="原密码:">
				<template v-slot:right="">
					<input type="password" v-model="oldPsd" maxlength="6" placeholder="请输入原始密码" class="addr_input" />
				</template>
			</sy-list-item>
			<sy-list-item title="新密码:">
				<template v-slot:right="">
					<input type="password" v-model="newPsd" maxlength="6" placeholder="请输入新的密码" class="addr_input" />
				</template>
			</sy-list-item>
			<sy-list-item title="确认密码:">
				<template v-slot:right="">
					<input type="password" v-model="newPsdR" maxlength="6" placeholder="请确认新的密码" class="addr_input" />
				</template>
			</sy-list-item>
		</uni-list>
		<view class="h200">
			
		</view>
		<view class="sub_top m26">
			<button class="btn  ms" @click="next">提交</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				oldPsd:"",
				newPsd:"",
				newPsdR:""
			};
		},
		methods:{
			next(){
				let dataL = {
					oldpwd:this.oldPsd,
					newpwd1:this.newPsd,
					newpwd2:this.newPsdR
				}
				this.$getApi('/api/User/changepwd', dataL, res => {
					console.log(res.data)
					// this.resData = res.data
					this.$msg("密码修改成功")
					uni.navigateBack({
						delta:1
					})
				})
				
				
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #f0f0f0;
	}
.eidt_phone{
	.h200{
		height: 200upx;
	}
	.sub_top {
		margin-top: 60upx;
		padding-bottom: 80upx;
		.btn{
			background-color: $uni-bl;
			color: #fff;
		}
	}
	.addr_input{
		flex:1;
		text-align: left;
		font-size: 28upx;
		padding-left: 20upx;
		color: #777;
	}
}
</style>
