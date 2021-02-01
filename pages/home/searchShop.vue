<template>
	<view class="search_shop">
		<sy-search-bar placeholder="请输入店铺名称" clearButton="always" cancelButton="always" @clear="clearBtn" @cancel="search" ref="searchBarC"></sy-search-bar>
		<view v-if="isShowResult">
			<view class="se_title m26">
				<view class="left">
					热门搜索
				</view>
				<view class="right"></view>
			</view>
			<view class="se_box m26">
				<view class="item" v-for="item in hotList" @click="searchName(item)">
					{{item}}
				</view>
			</view>
			<view class="se_title m26">
				<view class="left">
					历史记录
				</view>
				<view class="right iconfont iconqingkongshanchu" @click="clearS"></view>
			</view>
			<view class="se_box m26">
				<view class="item" v-for="item in hisList" @click="searchName(item)">
					{{item}}
				</view>
			</view>
		</view>
		<view v-if="!isShowResult">
			<view class="dianpu2_list">
				<view class="dian2" v-for="item in dianpuList"  @click="shopNav(item)">
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
				hotList: [],
				hisList: [],
				isShowResult:true,
				dianpuList: [],
			};
		},
		onShow() {
			this.$getApi("/api/Searchlog/hot",{type:"shop"},res=>{
				console.log(res.data)
				this.hotList = res.data;
				// this.hezuo = res.data
			})
			this.$getApi("/api/Searchlog/history",{type:"shop"},res=>{
				console.log(res.data)
				this.hisList = res.data;
				// this.hezuo = res.data
			})
			
		},
		computed:{
			...mapState(["httpp", "SystemInfo", "userInfo", "shopCar"]),
			carShowNum() {
				let carShowNum = 0;
				_.map(this.shopCar, itemC => {
					carShowNum += itemC.number
				})
				return carShowNum;
			}
		},
		methods: {
			...mapMutations(["jiaCar", "jianCar"]),
			search(el) {
				this.searchName(el)
				
			},
			shopNav(item){
				uni.navigateTo({
					url:"../classify/shopClassify?shopId="+item.id
				})
			},
			searchName(name) {
				console.log(name)
				this.$refs.searchBarC.setSearchVal(name);
				
				let this_ = this;
				uni.showLoading()
				this.$getApi("/api/Shop/list",{keywords:name},res=>{
					console.log(res.data)
					uni.hideLoading();
					this_.isShowResult = false;
					
					this_.dianpuList = res.data.data;
				})
			},
			clearS() {
				this.$getApi("/api/Searchlog/clearHistory",{type:"shop"},res=>{
					this.hisList = []
				})
			},
			clearBtn(){
				console.log("sss")
				this.isShowResult = true;
			},
			
			toShopCar() {
				uni.switchTab({
					url: "../shopCar/shopCar"
				})
			},
			foot2Click(item) {
				console.log(item)
				uni.navigateTo({
					url:"../detail/detail?id="+item.id
				})
			},
			foot2Jia(item) {
				console.log("111111111")
				_.map(this.shopList, fil => {
					if (fil.id == item.id) {
						item.number++;
						this.jiaCar(item)
					}
				})
			},
			foot2Jian(item) {
				console.log("2222222222")
				console.log(item)
				_.map(this.shopList, fil => {
					if (fil.id == item.id) {
						item.number--;
						this.jianCar(item)
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.search_shop {
		.dianpu2_list{
			padding: 10upx 26upx;
			.dian2{
				display: flex;
				padding: 20upx 0 26upx;
				border-bottom: 1upx solid #f0f0f0;
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
		
		.foot_list_show {
				background-color: #f0f0f0;
				min-height: 100vh;
				padding: 20upx 26upx 200upx;
		
				.num_add_sy {
					display: inline-flex;
		
					.n {
						width: 50upx;
						text-align: center;
						position: relative;
						top: 8upx;
					}
		
					.iconfont {
						padding: 6upx 8upx;
						border-radius: 50%;
					}
		
					.iconjian {
						// background-color: #f0f0f0;
						// color: #666;
						background-color: $uni-bl;
						color: #fff;
					}
		
					.iconjia {
						background-color: #f0f0f0;
						color: #666;
		
						&.show {
							background-color: $uni-bl;
							color: #fff;
						}
					}
				}
		
				.buy_car.icongouwuche {
					position: fixed;
					bottom: 40upx;
					right: 40upx;
					font-size: 70upx;
					background-color: $uni-bl;
					color: #fff;
					width: 120upx;
					height: 120upx;
					text-align: center;
					line-height: 120upx;
					border-radius: 50%;
		
					.text {
						background-color: $uni-or;
						position: absolute;
						top: 16upx;
						right: 16upx;
						font-size: 26upx;
						width: 36upx;
						height: 36upx;
						line-height: 36upx;
						border-radius: 50%;
						transform: scale(.8);
					}
				}
		
				.rec_body_sy {
					background-color: #fff;
					border-radius: 12upx;
					padding: 10upx 26upx;
				}
			}
		
		.m26cc {
			margin: 0 10upx 30upx;
		}

		.se_title {
			font-size: 32upx;
			color: #999;
			display: flex;
			justify-content: space-between;
			margin-bottom: 30upx;
		}

		.se_box {
			display: flex;
			flex-wrap: wrap;
			padding-bottom: 50upx;

			.item {
				min-width: 150upx;
				text-align: center;
				box-sizing: border-box;
				padding: 8upx 20upx 12upx;
				background-color: #f0f0f0;
				margin: 0 20upx 30upx 0;
				color: #666;
				border-radius: 10upx;
			}
		}
	}
</style>
