<template>
	<view class="case_item_sy" @click="handleClick(item)">
		<view class="t_center">
	<!-- 		<image :src="'../../static/img/home/'+item.img"mode=""></image> -->
			<image :src="httpp+item.logo"   class="img_c"  mode=""></image>
		</view>
		<view class="text_l">
			{{item.name}}
		</view>
		<view class="ctrl">
			<view class="">
				<view class="red">
					￥<text>{{item.price}}</text>
				</view>
			</view>
			<image src="../../static/img/gouwcjr.png" class="iconjia1_1"></image>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
			
			};
		},
		props:["item","isTuan"],
		computed:{
			httpp(){
				return this.$store.state.httpp
			}
		},
		methods:{
			handleClick(item){
				this.$emit('click',item)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.case_item_sy {
		width: 170upx;
		margin-right: 30upx;
		flex-shrink: 0;

		.img_c {
			width: 160upx;
			height: 160upx;
		}

		.text_l {
			color: #333;
			width: 180upx;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;

		}
		.sc9{
			transform: scale(.9);
		}
		.ctrl {
			display: flex;
			align-items: center;
			justify-content: space-between;

			.del {
				text-decoration: line-through;
				color: #999;
			}

			.iconjia1_1 {
				width: 30upx;
				height: 30upx;
				opacity: 1;
			}
		}
	}
</style>
