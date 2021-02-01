<template>
	<view class="search_com_sy">
		<view class="input_box">
			<view class="iconfont iconsousuo"></view>
			<view class="placeholder" @click="onClick">
				{{placeholder}}
			</view>
		</view>
	</view>
</template>

<script>
	import _ from "../../until/lodash";
	export default {
		props:['placeholder'],
		data() {
			return {
				
			};
		},
		methods:{
			onClick(){
				this.$emit("click")
			}
		}
	}
</script>

<style lang="scss">
.search_com_sy{
	padding: 0upx 26upx;
	background-color: #fff;
	.input_box{
		background-color: #f0f0f0;
		display: flex;
		padding: 20upx 26upx;
		border-radius: 40upx;
		
		.iconsousuo{
			margin-right: 20upx;
			color: #999;
		}
		.placeholder{
			color: #999;
		}
	}
}
</style>
