<template>
	<view class="component_header_sy">
		<view class="left">
			<view class="iconfont iconpintuanxuanzexinyishangpin"></view>
			<view class="title1">
				{{item.t1}}
			</view>
			<view class="title2">
				{{item.t2}}
			</view>
		</view>
		<view class="right" @click="moreClick(item)">
			<view class="">
				更多
			</view>
			<view class="iconfont iconjiantou"></view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		props:['bgcolor','item'],
		mounted() {
			
		},
		methods:{
			moreClick(item){
				this.$emit('click',item)
			}
		}
	}
</script>

<style lang="scss" scoped>
.component_header_sy{
	display: flex;
	justify-content: space-between;
	padding: 26upx 20upx;
	border-radius: 22upx 22upx 0 0;
	.left{
		display: inline-flex;
		align-items: center;
		.iconpintuanxuanzexinyishangpin{
			color: #fff;
		}
		.title1{
			font-size: 30upx;
			color: #fff;
			font-weight: bold;
			padding-left: 20upx;
		}
		.title2{
			color: #eee;
			border-left: 1upx solid #ddd;
			margin-left: 10upx;
			padding-left: 10upx;
			line-height: 30upx;
			height: 30upx;
		}
	}
	.right{
		display: inline-flex;
		background-color: #fff;
		color: $uni-or;
		padding: 4upx 10upx 4upx 20upx;
		border-radius: 50upx;
		transform: scale(.9);
		
		.iconfont{
			font-size: 32upx;
			position:relative;
			top: 6upx;
		}
	}
}

</style>
