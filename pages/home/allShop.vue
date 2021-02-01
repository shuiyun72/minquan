<template>
	<view class="all_shop">
		<view class="search_t"  @click.stop="toNav('searchShop')">
			<sy-search-bar placeholder="请输入店铺名称" ></sy-search-bar>
		</view>
		<view class="dianpu_list">
			<view class="dian" v-for="item in dianpuList1" @click="shopNav(item)">
				<image :src="httpp + item.logo" mode="" class="dian_img"></image>
				<view class="dian_t shengluehao">
					{{item.name}}
				</view>
				<view class="btn_r">
					进店
				</view>
			</view>
		</view>
		<view class="dianpu2_list">
			<view class="dian2" v-for="item in dianpuList2"  @click="shopNav(item)">
				<image :src="httpp + item.logo" mode="" class="dian2_img"></image>
				<view class="info">
					<view class="title">
						{{item.name}}
					</view>
					<view class="rate_h">
						<uni-rate :value="item.grade" color="#bbb" active-color="#FF8F3B" class="rate_fen" :margin="3" :size="12" :disabled="true"/> <text class="statr">{{item.grade}}分</text> <text class="xiaoliang">月销{{item.month_sales}}</text>
					</view>
					<view class="jieshao shengluehao">
						{{item.desc}}
					</view>
					<view class="address">
						<text class="iconfont iconlocation"><text>{{item.address}}</text></text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from "vuex";
	import _ from "../../until/lodash";
	export default {
		data() {
			return {
				dianpuList:[],
				page:1
			}
		},
		onShow() {
			this.getShop()
		},
		onReachBottom() { //上拉触底函数
			console.log("more")
			++this.page;
		
			this.getShop(true)
			
			
		},
		computed: {
			...mapState(["httpp", "SystemInfo", "userInfo", "shopCar", "location"]),
			dianpuList1(){
				return this.dianpuList.slice(0,3)
			},
			dianpuList2(){
				return this.dianpuList.slice(3,7)
			},
		},
		methods: {
			getShop(isMore){
				if(!isMore){
					this.page = 1
				}
				this.$getApi("/api/Shop/list", {page:this.page}, res => {
					console.log(res.data, "店铺列表")
					if(!isMore){
						this.dianpuList = res.data.data;
					}else{
						this.dianpuList = [this.dianpuList,res.data.data];
					}
					
					// this.itemNav2("",this.nav2dex,true);
				})
			},
			toNav(el){
				if(el=="searchShop"){
					uni.navigateTo({
						url:'./searchShop'
					})
				}
			},
			shopNav(item){
				uni.navigateTo({
					url:"../classify/shopClassify?shopId=1"
				})
			},
		}
	}
</script>

<style lang="scss">
.all_shop{
	.search_t{
		padding: 0 6upx 20upx;
	}
	.dianpu2_list{
		padding: 10upx 26upx;
		.dian2{
			display: flex;
			padding: 20upx 0 26upx;
			&+.dian2{
				border-top: 1upx solid #f0f0f0;
			}
			.dian2_img{
				width: 160upx;
				height: 160upx;
				flex-shrink: 0;
				padding: 10upx 16upx 10upx 0upx;
			}
			.info{
				
				display: inline-flex;
				flex-direction: column;
				justify-content: space-between;
				.title{
					font-size: 30upx;
				}
				.rate_h{
					display: flex;
					align-items: baseline;
					.statr{
						color: #666;
						margin-left: 16upx;
					}
					.xiaoliang{
						color: #666;
						margin-left: 26upx;
					}
				}
				
				.jieshao{
					color: $uni-or;
					transform: scale(.9);
					position:relative;
					left: -16upx;
				}
				.address{
					color: #666;
					.iconlocation{
						font-size: 26upx;
						text{
							margin-left: 6upx;
						}
					}
				}
			}
		}
	}
	
	.dianpu_list{
		display: flex;
		padding: 0 0 0 26upx;
		
		.dian{
			width: 220upx;
			text-align: center;
			padding: 20upx 0;
			border-radius: 16upx;
			margin-right: 20upx;
			.dian_img{
				width: 120upx;
				height: 120upx;
				border-radius: 50%;
				overflow: hidden;
			}
			.dian_t{
				width: 200upx;
				margin: 6upx auto 16upx;
				color: #fff;
				font-size: 30upx;
			}
			.btn_r{
				background-color: #fff;
				width: 160upx;
				height: 40upx;
				line-height: 40upx;
				margin: 0 auto;
				border-radius: 30upx;
			}
			&:nth-child(1){
				background-color: $uni-color-warning;
				.btn_r{
					color: $uni-color-warning;
				}
			}
			&:nth-child(2){
				background-color: $uni-color-error;
				.btn_r{
					color: $uni-color-error;
				}
			}
			&:nth-child(3){
				background-color: $uni-bl;
				.btn_r{
					color: $uni-bl;
				}
			}
		}
	}
	
}
</style>
