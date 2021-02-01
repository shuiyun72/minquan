<template>
	<view class="scroll_box_x" :style="'background:'+bgc">
		<view class="scroll_box_foot">
			<slot></slot>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		props:["bgc"]
	}
</script>

<style lang="scss" scoped>
.scroll_box_x{
	width: 750upx;
	box-sizing: border-box;
	overflow-x: auto;
	padding-bottom: 20upx;
	.scroll_box_foot{
		display: flex;
		
	}
}
</style>
