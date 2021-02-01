<template>
	<view>
		<view class="pingjia_box_sy2" v-for="item in pingjiaList">
			<view class="pingjia_user">
				<view class="left">
					<image :src="item.avatar" class="img" mode=""></image>
					<view class="left2">
						<view class="name shengluehao">
							{{item.nickname}}
						</view>
						<view class="time">
							{{item.ftime}}
						</view>
					</view>
				</view>
				<view class="right" v-if="item.grade">
					<uni-rate color="#bbb" active-color="#F59005" :readonly="true" :size="14" margin="3" :value="item.grade" class="rate_pj"></uni-rate>
				</view>
			</view>
			
			<view class="wa_text">
				{{item.content}}
			</view>
			<view v-if="item.images">
				<view class="pingjia_img_box">
			
						<view class="img_item" :style="'backgroundImage: url('+httpp+itemImg+')'" v-for="itemImg in item.images.split(',')"></view>
					
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				value:5,
				pingjiaImg:[{
					img: "pingj1.png"
				}, {
					img: "pingj1.png"
				}, {
					img: "pingj1.png"
				}],
				page:1,
				itemId:"",
				pingjiaList:[]
			};
		},
		onLoad(ph) {
			this.itemId = ph.itemId
			this.getPingjia();
		},
		onReachBottom() { //上拉触底函数
			console.log("more")
			++this.page;
			this.getPingjia(true)
		},
		computed:{
			httpp(){
				return this.$store.state.httpp
			}
		},
		methods:{
			getPingjia(isMore){
				
				this.$getApi("/api/Goods/comments", {id:this.itemId,page:this.page}, res => {
					console.log(res.data,"pingjia")
					if(isMore){
						this.pingjiaList = [...this.pingjiaList,...res.data.data]
					}else{
						this.pingjiaList = res.data.data
					}
					
				})
			}
		}
		
	}
</script>
<style lang="scss" scoped>
.pingjia_box_sy2{
		padding: 20upx 26upx 0;
		border-bottom: 20upx solid #f0f0f0;
		.p26{
			padding: 0 26upx;
		}
		.pingjia_user{
			display: flex;
			justify-content: space-between;
			align-items: center;
			color: #666;
			padding-right: 20upx;
			.left{
				display: inline-flex;
				align-items: center;
				.left2{
					margin-left: 20upx;
				}
				.img{
					width: 80upx;
					height: 80upx;
				}
				.name{
					font-size: 30upx;
					
					max-width: 420upx;
				}
			}
		}
		.rate_pj{
			padding: 30upx 0 30upx;
		}
		.wa_text{
			font-size: 30upx;
			color: #666;
			padding: 20upx 0;
		}
		.pingjia_img_box{
			// padding: 0 26upx;
			height: 230upx;
			padding-bottom: 30upx;
			display: flex;
			.img_item{
				width: 226upx;
				height: 226upx;
				margin-right: 4upx;
				background: no-repeat center center;
				background-size: 226upx auto;
			}
		}
	}
	
</style>
