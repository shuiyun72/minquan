<template>
	<view class="xiaoxi_detail">
		<view class="t_center">
			<view class="title_x">
				{{itemDetail.title}}
			</view>
			<view class="time">
				{{itemDetail.days}}
			</view>
		</view>
		<view class="p1">
			{{itemDetail.content}}
		</view>
<!-- 		<view class="">
			<image src="../../static/img/banner.png" class="img_x" mode="widthFix"></image>
		</view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				itemDetail:{}
			};
		},
		onLoad(ph) {
			this.$getApi('/api/Sysmessage/detail',{id:ph.xiaoxiId},res=>{
				console.log(res.data,"系统消息 - 详情")
				this.itemDetail = res.data
			})
		}
	}
</script>

<style lang="scss">
.xiaoxi_detail{
	padding: 20upx 26upx;
	.t_center{
		text-align: center;
		.title_x{
			font-size: 30upx;
		}
		.time{
			color: #999;
		}
	}
	.p1{
		font-size: 28upx;
		color: #999;
		padding: 20upx 10upx;
		line-height: 42upx;
	}
	.img_x{
		width: 100%;
	}
}
</style>
