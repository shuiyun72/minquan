<template>
	<view class="shop_classify_page">
		<view class="guodu_header" :style="{'padding-top':SystemInfoL.menu.top+'px'}"></view>
		<sy-nav-bar left-icon="back"  title="店铺" backgroundColor="#18B357" @clickLeft="back">
			<block slot="right">
				<view class="">
					<text class="iconfont iconxin nav_shoucang" :class="{'active':shopDetail.is_favorites ==1}" @click="shoucang(shopDetail)">{{shopDetail.is_favorites ==1?'已收藏':'收藏'}}</text>
				</view>
			</block>
		</sy-nav-bar>
		<view class="shop_body">
			<view class="shop_info_sy">
				<view class="h_img_box" v-if="shopDetail.logo">
					<image :src="httpp + shopDetail.logo" class="header_img" mode=""></image>
				</view>

				<view class="info">
					<view class="title">
						<view class="name">
							{{shopDetail.name}}
						</view>
						<view class="number">
							月销量{{shopDetail.month_sales}}
						</view>
					</view>
					<view class="star" v-if="shopDetail.grade > -1">
						<uni-rate :value="shopDetail.grade" color="#bbb" active-color="#F59005" :readonly="true"  :disabled="true" :size="12" class="rate"></uni-rate>
						<view class="num_f">{{shopDetail.grade}}分</view>
						<view class="or shengluehao">
							{{shopDetail.desc}}
						</view>
					</view>
					<view class="address iconfont iconlocation">
						{{shopDetail.address}}
					</view>
				</view>
			</view>
			<view class="shop_pt2">
				<view class="title">
					全部商品
				</view>

				<sy-scroll-x class="p26 bgf0f" >
					<view class="tab_list_round_sy">
						<view class="item" v-for="(item,index) in homeNav" :class="{'active':index == tabSel}" @click="selectTab(item,index)">{{item.name}}</view>
					</view>
				</sy-scroll-x>
				<view class="shop_list">
					<view class="left_classify">
						<view class="item" :class="{'active':index == classifySel}" v-for="(item,index) in classifyList" @click="selClass(item,index)">
							<view class="border">
								{{item.name}}
							</view>
						</view>
					</view>
					<view class="sanji_right">
						<sy-foot2 v-for="item in shopList" :item="item" @click="foot2Click">
							<view class="num_add_sy">
								<view class="iconfont iconjian" v-if="item.number > 0" @click.stop="foot2Jian(item)"></view>
								<view class="n" v-if="item.number > 0">{{ item.number }}</view>
								<view class="iconfont iconjia show" @click.stop="foot2Jia(item)"></view>
							</view>
						</sy-foot2>
					</view>
				</view>
			</view>
		</view>
		<view class="buy_car iconfont icongouwuche" @click="toShopCar">
			<view class="text" v-if="carShowNum>0">
				{{carShowNum}}
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
				shopId: "",
				shopList: [],
				shopDetail:{},
				homeNav:[],
				tabSel: 0,
				classifySel: 0,
				classifyList: [],
				erId:""
			};
		},
		onLoad(ph) {
			if (ph.shopId) {
				this.shopId = ph.shopId
				this.$getApi('/api/Shop/detail',{id:ph.shopId},res=>{
					console.log(res.data,"店铺详情")
					this.shopDetail = res.data
				})
				this.$getApi("/api/Category/list", {shop_id:ph.shopId}, res => {
					console.log(res.data, "一级分类")
					this.homeNav = res.data;
					if(this.homeNav.length > 0){
						this.getErClass(this.homeNav[0].id)
					}
					
				})
			}else{
				this.$getApi("/api/Category/list", {}, res => {
					console.log(res.data, "一级分类")
					this.homeNav = res.data;
			
					if(this.homeNav.length > 0){
						this.getErClass(this.homeNav[0].id)
					}
				})
			}
		},
		onShow() {
			
		},
		created() {

		},
		computed: {
			...mapState(["httpp", "SystemInfo", "userInfo", "shopCar", "location"]),
			SystemInfoL() {
				// #ifdef MP
				return JSON.parse(this.SystemInfo)
				// #endif
				// #ifndef MP
				return {
					'barHeight': 64,
					'menu': {
						'bottom': 58,
						'height': 32,
						'left': 263,
						'right': 350,
						'top': 30,
						'width': 87
					},
					'statusBarHeight': 20
				}
				// #endif

			},
			carShowNum() {
				let carShowNum = 0;
				_.map(this.shopCar, itemC => {
					carShowNum += itemC.number
				})
				return carShowNum;
			}
		},
		methods:{
			...mapMutations(["jiaCar", "jianCar"]),
			selectTab(el, i) {
				this.tabSel = i;
				// this.getOrder(el.type);
				this.getErClass(this.homeNav[this.tabSel].id)
			},
			selClass(item, index) {
				this.classifySel = index;
				console.log(item)
				this.getFootlist(item.id,true)
			},
			//二级分类
			getErClass(id){
				this.erId = id;
				this.$getApi("/api/Category/list", {pid:id}, res => {
					console.log(res.data, "二级分类")
					this.classifyList = res.data;
					// console.log(this.classifyList[0].name)
					if(this.classifyList.length > 0){
						this.getFootlist(this.classifyList[0].id,true)
					}else{
						this.shopList = []
					}
					
				})
			},
			//商品列表
			getFootlist(key,isTrue){
				let categoryId = "";
				let keyName = ""
				if(isTrue){
					categoryId = key
				}else{
					keyName = key
				}
				this.$getApi("/api/Goods/list", {category_id:categoryId,keywords:keyName}, res => {
					console.log(res.data, "商品")
					let shopList = [];
					this.shopList = [];
					_.map(res.data.data,item=>{
						item.number = 0;
						_.map(this.shopCar, (itemC, index) => {
							if (item.id == itemC.id) {
								item.number = itemC.number;
							}
						})
						shopList.push(item)
					})
					console.log(shopList)
					this.$nextTick(function(){
						this.shopList = shopList;
					})
					
				})
			},
			shoucang(shopDetail){
				console.log("收藏")
				if(this.shopDetail.is_favorites ==1){
					this.$getApi("/api/Favorites/del", {type:"shop",id:this.shopId}, resCode => {
						console.log(resCode.data,"收藏店铺")
						this.shopDetail.is_favorites = 0
						this.$msg("取消收藏")
					})
				}else{
					this.$getApi("/api/Favorites/add", {type:"shop",id:this.shopId}, resCode => {
						console.log(resCode.data,"收藏店铺")
						this.shopDetail.is_favorites = 1
						this.$msg("店铺收藏成功")
					})
				}
				
			},
			foot2Click(item) {
				console.log(item)
				uni.navigateTo({
					url: "../detail/detail?id=" + item.id
				})
			},
			foot2Jia(item) {
				console.log("111111111")
				++item.number;
				this.$getApi("/api/Cart/change", {id:item.id,number:item.number}, res => {
					console.log(res.data, "商品列表")
					this.jiaCar(item)
					this.$getApi("/api/Cart/list", {id:item.id,number:item.number}, res => {
						console.log(res.data, "商品列表")
						
					})
				})
			},
			foot2Jian(item) {
				console.log(item)
				--item.number;
				this.$getApi("/api/Cart/change", {id:item.id,number:item.number}, res => {
					console.log(res.data, "商品列表")
					this.jianCar(item)
					this.$getApi("/api/Cart/list", {id:item.id,number:item.number}, res => {
						console.log(res.data, "商品列表")
						
					})
				})
			},
			toShopCar(){
				uni.switchTab({
					url:"../shopCar/shopCar"
				})
			},
			back(){
				uni.navigateBack({
					delta:1
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: $uni-bl;
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
		z-index:10;
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
	.nav_shoucang{
		font-size: 28upx;
		border-radius: 30upx;
		border: 1upx solid #fff;
		padding: 4upx 16upx 4upx 12upx;
		&.active{
			border: 1upx solid $uni-or;
			color: $uni-or;
		}
	}
	.shop_classify_page {
		.shop_body {
			background-color: #fff;
			margin-top: 60upx;
			border-radius: 30upx 30upx 0 0;

			.shop_info_sy {
				display: flex;
				padding: 10upx 26upx 20upx;

				.h_img_box {
					width: 140upx;
					height: 140upx;
					background-color: #fff;
					border-radius: 10upx;
					flex-shrink: 0;
					position: relative;
					top: -50upx;
					left: 0;
					box-shadow: 0 3px 3px #f0f0f0;

					.header_img {
						width: 100%;
						height: 100%;
					}
				}

				.info {
					flex: 1;
					margin-left: 20upx;

					.title {
						display: flex;
						justify-content: space-between;

						.name {
							font-size: 30upx;
						}

						.number {
							color: #999;
						}
					}
				}

				.star {
					display: flex;
					align-items: center;
					padding: 10upx 0;

					.rate {
						position: relative;
						top: 6upx;
						flex-shrink: 0;
					}

					.num_f {
						color: #999;
						flex-shrink: 0;
					}

					.or {
						width: 340upx;
						color: $uni-or;
						margin-left: 20upx;
						flex: 1;
					}
				}

				.address {
					font-size: 26upx;
					color: #777;
				}
			}
		}

		.shop_pt2 {
			.title {
				padding: 10upx 26upx 0;
				font-size: 32upx;
			}

			.shop_list {
				display: flex;

				.left_classify {
					background-color: #f0f0f0;
					/* #ifdef MP */
					height: calc(100vh - 150upx);
					/* #endif */
					/* #ifndef MP */
					height: calc(100vh - 460upx);
					/* #endif */
					overflow-y: auto;
					width: 180upx;
					box-sizing: border-box;

					.item {
						padding: 26upx 0 26upx 14upx;
						font-weight: bold;
						color: #666;

						.border {
							border-left: 8upx solid transparent;
							width: 160upx;
							text-align: center;
							line-height: 28upx;
						}

						&.active {
							background-color: #fff;

							.border {
								border-left: 8upx solid $uni-bl;
								color: $uni-bl;
							}
						}

					}
				}

				.sanji_right {
					flex: 1;
					padding:0 26upx 0 16upx;
				}
			}
		}
	}

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
	.tab_list_round_sy {
		display: flex;
		font-size: 28upx;
		justify-content: space-between;
		background-color: #fff;
		color: #999;
		padding: 20upx 26upx 20upx 0;
		
		.item {
			border-bottom: 6upx solid transparent;
			padding: 2upx 26upx;
			border-radius: 40upx;
			flex-shrink: 0;
			&.active {
				color: #fff;
				background-color: $uni-bl;

			}
		}
	}
</style>
