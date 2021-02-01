<template>
	<view class="shop_car">
		<view class="guodu_header" :style="{'padding-top':SystemInfoL.menu.top+'px'}"></view>
		<sy-nav-bar right-text="删除" title="购物车" color="#333" @clickRight="deleteFoots"></sy-nav-bar>
		<view class="shop_body">
			<view class="shop_car_cc" v-for="(parent,parIndex) in shopCarList">
				<view class="shop_sel_title" @click="selAll(parent)">
					<view class="iconfont sel_s" :class="parent.sel == 1?'iconyduizhengqueshixin':'sel_c'"></view>
					<view class="shop_title">
						<view class="iconfont iconaishenghuo-shanghuzhongxin"></view>
						<view class="text">
							{{parent.shopName}}
						</view>
						<view class="iconfont iconjiantou"></view>
					</view>
				</view>
				<!-- 购物车商品 -->
				<view class="shop_list">
					<view class="for_item_box" v-for="(item,index) in parent.list" @click="selItem(item,index)">
						<view class="item_box">
							<view class="iconfont sel_s" :class="item.sel == 1?'iconyduizhengqueshixin':'sel_c'"></view>
							<view class="right_info">
								<view class="">
									<image :src="httpp+item.logo" class="img" mode=""></image>
								</view>
								<view class="text">
									<view class="title">
										<view>{{item.name}}</view>
									</view>
									<view class="money_num">
										<view class="money">
											￥<text class="price">{{item.price}}</text>
										</view>
										<view class="num_add_sy">
											<view class="iconfont iconjian" v-if="item.number > 0" @click.stop="foot2Jian(item)"></view>
											<view class="n" v-if="item.number > 0">{{ item.number }}</view>
											<view class="iconfont iconjia" @click.stop="foot2Jia(item)"></view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="car_pay_sy">
			<view class="part1">
				<view class="iconfont sel_s" :class="allItem?'iconyduizhengqueshixin':'sel_c'"></view>
				<view class="text" @click="allSel">
					全选
				</view>
			</view>
			<view class="money_b">
				<view class="c_text">
					合计:
				</view>
				<view calss="price_c">{{allMoney}}</view>
			</view>
			<view class="buy_btn" @click="payFoots">
				结算({{numb}})
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
				
				shopList: [],
				dianpuList:[],
				allItem: false,
			};
		},
		mounted() {
			console.log(this.SystemInfo)
		},
		onShow() {
			this.shopList = this.shopCar;
			this.initShopCar();
			this.clacShopListSel();
			this.$getApi("/api/Shop/list", {}, res => {
				console.log(res.data.data, "店铺列表")
				this.dianpuList = res.data.data;
			})
		},
		watch: {
			shopList: {
				handler: function(newVal, oldVal) {
					let selIndex = _.filter(this.shopList, item => {
						return item.sel == 1
					})
					console.log(selIndex.length, this.shopList.length)
					if (selIndex.length == this.shopList.length) {
						this.allItem = true
					} else {
						this.allItem = false
					}
				},
				deep: true,
				immediate: true
			},
			shopCar: {
				handler: function(newVal, oldVal) {
					this.initShopCar();
				},
				deep: true,
				immediate: true
			}
		},
		computed: {
			...mapState(["httpp", "SystemInfo", "userInfo", "shopCar", "location"]),
			shopCarList() {
				let shopLits = [];
				_.map(this.dianpuList, itemShop => {
					
					let footList = [];
					_.map(this.shopList, itemFoot => {
						console.log(itemFoot)
						if (itemShop.id == itemFoot.shop_id) {
							footList.push(itemFoot)
						}
					})
					if (footList.length > 0) {
						let noSel = _.filter(footList,itemFli=>{
							return itemFli.sel == 0
						})
						
						let allS = noSel.length > 0 ? 0 : 1;
						shopLits.push({
							shopName: itemShop.name,
							shopId:itemShop.shopId,
							list: footList,
							sel: allS
						})
					}

				})
				return shopLits;
			},
			numb() {
				let numb = 0;
				let newShop = _.filter(this.shopList, item => {
					return item.sel == 1
				})
				_.map(newShop, item => {
					numb += item.number
				})
				return numb;
			},
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
						'top': 26,
						'width': 87
					},
					'statusBarHeight': 20
				}
				// #endif

			},
			allMoney() {
				let money = 0;
				_.map(this.shopList, item => {
					if (item.sel == 1) {
						money += (item.price * 1000 * item.number)
					}
					console.log(money)
				})
				return money / 1000
			}
		},
		methods: {
			...mapMutations(["jiaCar", "jianCar", "delCar"]),
			clacShopListSel() {
				let shList = [];
				_.map(this.shopList, item => {
					item.sel = 1;
					shList.push(item)
				})
				console.log(shList)
				this.shopList = shList;
			},
			initShopCar() {
				let numb = 0;
				_.map(this.shopCar, item => {
					numb += item.number
				})
				if (numb > 0) {
					let numbStr = numb.toString();
					uni.setTabBarBadge({
						index: 2,
						text: numbStr
					})
				} else {
					uni.removeTabBarBadge({
						index: 2
					})
				}
			},
			//删除已选商品
			deleteFoots() {
				let noSelFoot = _.filter(this.shopList, item => {
					return item.sel == 0
				})
				let snoSelFoot = _.filter(this.shopList, item => {
					return item.sel == 1
				})
				if(snoSelFoot.length > 0){
					_.map(snoSelFoot,item=>{
						this.$getApi("/api/Cart/change", {id:item.id,number:0}, res => {
							console.log(res.data, "商品删除")
							this.delCar(snoSelFoot)
						})
					})
					
				}
				this.shopList = noSelFoot
				
			},
			payFoots() {
				
				let payFootList = _.filter(this.shopList,item=>{
					return item.sel == 1
				})
				console.log(payFootList)
				if(payFootList.length > 0){
					uni.navigateTo({
						url: "../order/orderTrue?payFootList="+JSON.stringify(payFootList)
					})
				}else{
					this.$msg("您还没有选择商品")
				}
				
			},
			allSel() {
				console.log(this.allItem)
				let newShopLits = [];
				if(this.allItem){
					_.map(this.shopList,itemS=>{
						itemS.sel = 0
						newShopLits.push(itemS)
					})
				}else{
					_.map(this.shopList,itemS=>{
						itemS.sel = 1
						newShopLits.push(itemS)
					})
				}
				this.shopList = newShopLits
			},
			selItem(item, index) {
				console.log(item)
				let newShopLits = [];
				_.map(this.shopList,itemS=>{
					if(itemS.id == item.id){
						if(item.sel == 1){
							item.sel = 0
						}else{
							item.sel = 1
						}
					}
					newShopLits.push(itemS)
				})
				console.log(newShopLits)
				this.shopList = newShopLits;
			},
			foot2Click(item) {
				console.log(item)
			},
			foot2Jia(item) {
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
				--item.number;
				this.$getApi("/api/Cart/change", {id:item.id,number:item.number}, res => {
					console.log(res.data, "商品列表")
					this.jianCar(item)
					this.$getApi("/api/Cart/list", {id:item.id,number:item.number}, res => {
						console.log(res.data, "商品列表")
						
					})
				})

			},
			toNav(el) {
				if (el == 'huangou') {
					uni.navigateTo({
						url: "./huangou"
					})
				}
			},
			selAll(parent) {
				console.log(parent)
				let itemFil = _.filter(parent.list,itemC=>{
					return itemC.sel == 0
				})
				let isSel  = itemFil.length > 0 ? 1 : 0;
				let newShopLits = [];
				
				_.map(this.shopList,itemS=>{
					_.map(parent.list,itemC=>{
						if(itemS.id == itemC.id){
							itemC.sel = isSel
						}
					})
					newShopLits.push(itemS)
				})
				console.log(newShopLits)
				this.shopList = newShopLits;
			}
		}
	}
</script>
<style>
	page {
		background-color: #f0f0f0;
	}
</style>
<style lang="scss" scoped>
	.guodu_header {
		background-color: #fff;
	}

	.car_pay_sy {
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: fixed;
		width: 750upx;
		background-color: #fff;
		left: 0;
		bottom: 0upx;
		/* #ifdef H5 */
		bottom: 100upx;
		/* #endif */
		z-index: 1000;

		.part1 {
			display: inline-flex;
			align-items: center;
			color: #999;
			padding-left: 26upx;
			.iconyduizhengqueshixin{
				font-size: 32upx;
			}
			.text {
				margin-left: 20upx;
			}
		}

		.money_b {
			color: #333;
			display: inline-flex;
			font-weight: bold;
			font-size: 30upx;

			.c_text {
				font-weight: 100;
				margin-right: 6upx;
				font-size: 26upx;
			}

		}

		.buy_btn {
			width: 250upx;
			background-color: $uni-bl;
			color: #fff;
			text-align: center;
			padding: 26upx 0;
			font-size: 30upx;
		}

		.sel_s {
			width: 30upx;
			height: 30upx;

			border-radius: 50%;
			margin-left: 4upx;
			box-sizing: border-box;

			&.sel_c {
				border: 1upx solid #999;
			}

			&.iconyduizhengqueshixin {
				color: $uni-bl;
			}
		}
	}

	.shop_car {

		.huangou {
			padding: 6upx 0 20upx;

			.box {
				display: flex;
				align-items: center;
				justify-content: space-between;
				border: 1upx solid $uni-bl;
				background-color: $uni-bl-bg;
				padding: 14upx 16upx 20upx;
				border-radius: 50upx;
				color: #666;

				.l_pt1 {
					display: inline-flex;
					align-items: center;

					.btn {
						background-color: $uni-red;
						padding: 10upx 16upx;
						color: #fff;
						transform: scale(.9);
						margin-right: 10upx;
					}
				}
			}
		}

		.ctrl_btn {
			background-color: #f0f0f0;
			display: flex;
			font-size: 30upx;
			align-items: center;
			color: #999;
			justify-content: space-between;
			padding: 16upx 32upx 10upx;
		}

		.shop_body {
			padding: 0upx 26upx 140upx;
		}

		.shop_car_cc {
			overflow-y: auto;
			background-color: #fff;
			padding: 0upx 6upx 0;
			margin-top: 20upx;
			border-radius: 10upx;

			.shop_sel_title {
				color: #666;
				display: flex;
				padding: 20upx 0 20upx 4upx;
				border-bottom: 1upx solid #f0f0f0;
				align-items: center;

				.text {
					font-size: 30upx;
				}

				.sel_s {
					width: 30upx;
					height: 30upx;

					border-radius: 50%;
					margin-left: 4upx;
					box-sizing: border-box;

					&.sel_c {
						border: 1upx solid #999;
					}
				}

				.iconjiantou {
					color: #999;
					font-size: 30upx;
					margin-top: 8upx;
				}

				.iconyduizhengqueshixin {
					color: $uni-bl;
					font-size: 32upx;
				}

				.shop_title {
					display: inline-flex;

					.iconaishenghuo-shanghuzhongxin {
						font-size: 28upx;
						margin: 10upx 8upx 0 26upx;
					}
				}
			}

			.shop_list {


				&.huangou_c {
					padding: 10upx 0upx 0;
				}

				.for_item_box {
					background-color: #fff;
					border-radius: 12upx;
					margin-bottom: 20upx;
					padding: 40upx 20upx 30upx 10upx;

					&.huangou_ctrl {
						padding: 10upx 20upx 30upx 10upx;

						.ctrl_btn {
							display: flex;
							font-size: 30upx;
							align-items: center;
							color: #999;
							justify-content: space-between;
							padding: 16upx 32upx 10upx;
							background-color: #fff;
						}
					}
				}

				.maiyisongyi {
					display: flex;
					align-items: center;
					color: #666;
					padding-top: 20upx;

					.img_l {
						text-align: center;
						width: 240upx;

						.img {
							width: 90upx;
							height: 90upx;
						}
					}

					.text_r {
						display: inline-flex;
						justify-content: space-between;
						flex: 1;
						align-items: center;

						.r_l {
							display: inline-flex;
							width: 360upx;

							.or {
								color: $uni-or;
								margin-right: 10upx;
							}
						}
					}
				}

				.item_box {

					display: flex;
					align-items: center;



					.sel_s {
						width: 30upx;
						height: 30upx;

						border-radius: 50%;
						margin-left: 4upx;
						box-sizing: border-box;

						&.sel_c {
							border: 1upx solid #999;
						}
					}

					.iconyduizhengqueshixin {
						color: $uni-bl;
						font-size: 32upx;
					}

					.right_info {
						display: inline-flex;
						padding-left: 20upx;
						flex: 1;

						.img {
							width: 160upx;
							height: 160upx;
						}

						.text {
							flex: 1;
							display: inline-flex;
							flex-direction: column;
							justify-content: space-between;
							padding-left: 20upx;

							.title {
								font-weight: bold;
								color: #666;
								display: inline-flex;
								align-items: center;

								.maiyisong {
									background-color: $uni-or;
									padding: 6upx 0upx 8upx;
									color: #fff;
									border-radius: 4upx;
									margin-right: 6upx;
									transform: scale(.8);
									width: 130upx;
									text-align: center;
									flex-shrink: 0;
								}
							}

							.money_num {
								display: inline-flex;
								justify-content: space-between;
								align-items: baseline;

								.money {
									font-weight: bold;
									color: #666;

									&.or {
										color: $uni-or;
									}

									.price {
										font-size: 34upx;

									}
								}
							}
						}
					}
				}
			}

			.num_add_sy {
				display: inline-flex;

				.n {
					width: 50upx;
					text-align: center;
				}

				.iconfont {
					padding: 6upx 8upx;
					border-radius: 50%;
				}

				.iconjian {
					background-color: #f0f0f0;
					color: #666;
				}

				.iconjia {
					background-color: #f0f0f0;
					color: #666;
					// background-color: #fec40b;
					// color: #fff;
				}
			}
		}
	}
</style>
