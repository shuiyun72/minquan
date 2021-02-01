<template>
	<view class="mine">
		<view class="">
			<!-- #ifdef MP -->
			<view class="user_info" :style="{ 'padding-top': (SystemInfoL.menu.top) + 'px' }">
				<!-- #endif -->
				<!-- #ifndef MP -->
				<view class="user_info">
					<!-- #endif -->

					<view class="left_info" @click="navsTo('mineMsg')" v-if="zhengjianImgL">
						<image :src="zhengjianImgL" class="user_img" mode=""></image>
						<view class="name_c">
							<view class="name">{{userInfo.nickname}}</view>
							<view class="name2" v-if="userInfo.mobile">{{userInfo.mobile}}</view>
						</view>
					</view>
					<view class="right_set">
						<image src="../../static/img/xiaox.png" class="msg1_img" mode=""  @click="navsTo('xiaoxi')"></image>
						<image src="../../static/img/shez.png" class="msg1_img" mode="" @click="navsTo('set')"></image>

					</view>
					<view class="mine_order">
						<view class="title">
							<view class="">
								我的订单
							</view>
							<view class="iconfont iconjiantou"></view>
						</view>
						<view class="o_box">
							<view class="item" v-for="item in orderList" @click="toOrder(item.ins)">
								<view class="img_c">
									<view class="number" v-if="item.number>0">
										{{item.number}}
									</view>
									<image :src="'../../static/img/mine/'+item.img" mode="" class="bg_img_c"></image>
								</view>
								<view class="">
									{{item.text}}
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="mine_body">
				<!-- <image src="../../static/img/mine/yaoqhy.png" class="mine_img" mode=""></image> -->
				<uni-list>
					<sy-list-item :title="item.text" v-for="item in serveList" :thumb="'../../static/img/mine/'+item.img" @click="navTo(item.text)"></sy-list-item>
				</uni-list>
			</view>

		</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from "vuex";
	export default {
		data() {
			return {
				mineInfo: [],
				orderList: [{
						ins: 1,
						img: "daifk.png",
						text: "待付款",
						number: 0
					},
					{
						ins: 2,
						img: "daish.png",
						text: "待收货",
						number: 0
					},
					{
						ins: 3,
						img: "daipj.png",
						text: "待评价",
						number: 0
					},
					{
						ins: 0,
						img: "quanb.png",
						text: "全部",
						number: 0
					}
				],
				serveList: [{
						img: "yue.png",
						text: "余额"
					},
					{
						img: "ruz.png",
						text: "批发商入驻"
					},
					{
						img: "shouh.png",
						text: "收货地址"
					},
					{
						img: "shouc.png",
						text: "我的收藏"
					},
					{
						img: "pingj.png",
						text: "我的评价"
					},
					{
						img: "shangwhz.png",
						text: "商务合作"
					},
					{
						img: "guany.png",
						text: "关于我们"
					}
				]
			};
		},
		computed: {
			...mapState(["httpp", "SystemInfo", "userInfo","shopCar"]),
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
			zhengjianImgL(){
				if(this.userInfo && this.userInfo.avatar){
					return this.userInfo.avatar
				}else{
					return ""
				}
			}
		},
		mounted() {
			// this.$getApi('/api/user/info',"",res=>{
			// 	console.log(res)
			// 	this.mineInfo = res.data
			// })
			console.log(this.SystemInfoL)
		},
		onShow() {
			this.$getApi('/api/User/getInfo',{},res=>{
				console.log(res.data)
				this.userInfo.avatar = res.data.avatar
				this.userInfo.nickname = res.data.nickname
			})
			this.$getApi('/api/Order/count',{},res=>{
				let orInfo = res.data
				this.orderList = [{
						ins: 1,
						img: "daifk.png",
						text: "待付款",
						number: orInfo.waitpay
					},
					{
						ins: 2,
						img: "daish.png",
						text: "待收货",
						number: orInfo.waitreceive
					},
					{
						ins: 3,
						img: "daipj.png",
						text: "待评价",
						number: orInfo.waitcomment
					},
					{
						ins: 0,
						img: "quanb.png",
						text: "全部",
						number: 0
					}
				]
			})
			this.$getApi("/api/Cart/list", {}, res => {
				console.log(res.data, "购物车列表")
				this.setCar(res.data)
				this.initShopCar();
			})
		},
		methods: {
			...mapMutations(["setCar"]),
			initShopCar() {
				let numb = 0;
				console.log(this.shopCar)
				
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
			toOrder(ins) {
				uni.navigateTo({
					url: "../order/order?ins=" + ins
				})
			},
			navsTo(item) {
				console.log(item);
				if (item == 'mineMsg') {
					uni.navigateTo({
						url: './mineMsg'
					})
				}
				if (item == 'set') {
					uni.navigateTo({
						url: './set'
					})
				}
				if (item == 'xiaoxi') {
					uni.navigateTo({
						url: './xiaoxi'
					})
				}
			},
			navTo(text) {
				if (text == '余额') {
					uni.navigateTo({
						url: './yuE'
					})
				} 
				if (text == '收货地址') {
					uni.navigateTo({
						url: './address'
					})
				} 
				if (text == '批发商入驻') {
					uni.navigateTo({
						url: './shopAdd'
					})
				} 
				if (text == '我的评价') {
					uni.navigateTo({
						url: './myPingjia'
					})
				} 
				if (text == '我的收藏') {
					uni.navigateTo({
						url: '../home/searchResult?fromType=shoucang&searchName=我的收藏'
					})
				} 
				if (text == '我的积分') {
					uni.navigateTo({
						url: './jifen'
					})
				} 
				if (text == '发票') {
					uni.navigateTo({
						url: './fapiao'
					})
				} 
				if (text == '配送范围') {
					uni.navigateTo({
						url: './fanwei'
					})
				} 
				if (text == '关于我们') {
					uni.navigateTo({
						url: './aboutMe'
					})
				} 
				if (text == '意见反馈') {
					uni.navigateTo({
						url: './ideaFor'
					})
				} 
				if (text == '商务合作') {
					uni.navigateTo({
						url: './hezuo'
					})
				}
				
				if (text == '联系客服') {
					// #ifdef MP
					console.log("1212")
					// #endif
					// #ifndef MP
					uni.makePhoneCall({
						phoneNumber: "000-88888"
					});
					// #endif
					// this.$getApi('/api/common/service',"",res=>{
					// 	console.log(res)
					// 	uni.makePhoneCall({
					// 	    phoneNumber: res.data.mobile 
					// 	});
					// })
				} 
			}
		}
	};
</script>
<style>
	page {
		background-color: #f0f0f0;
	}
	
</style>
<style lang="scss" scoped>
	
	.mine {
		background-color: #f0f0f0;

		font-size: 32upx;
		color: #333;
		display: flex;
		flex-direction: column;
		.kf_btn{
			font-size: 26upx;
			line-height: inherit;
			font-size: 32upx;
			color: #666;
			padding: 0;
		}
		.mine_body {
			// background-color: #fff;
			flex: 1;
			padding: 160upx 26upx 0upx;

			.mine_img {
				width: 698upx;
				height: 160upx;
				margin-bottom: 20upx;
			}
		}

		.mine_serve {
			background-color: #fff;
			padding: 26upx;
			border-radius: 16upx;

			.title {
				font-weight: bold;
				padding-bottom: 40upx;
			}

			.o_box {
				display: flex;
				flex-wrap: wrap;

				.item {
					width: 25%;
					text-align: center;
					margin-bottom: 35upx;
					color: #666;
				}

				.img_c {
					margin-bottom: 10upx;

					.bg_img_c {
						width: 60upx;
						height: 60upx;
					}
				}
			}
		}

		.header_title {
			text-align: center;
			color: #fff;
			font-size: 36upx;
		}

		.user_info {
			display: flex;
			align-items: baseline;
			padding: 40upx 40upx 120upx;
			justify-content: space-between;
			background-color: $uni-bl;
			position: relative;

			.mine_order {
				position: absolute;
				width: 700upx;
				bottom: -140upx;
				padding: 26upx 26upx 32upx;
				box-sizing: border-box;
				border-radius: 16upx;
				left: 50%;
				margin-left: -350upx;
				background-color: #fff;

				.title {
					font-weight: bold;
					padding-bottom: 20upx;
					display: flex;
					justify-content: space-between;

					.iconjiantou {
						color: #999;
					}
				}

				.o_box {
					display: flex;
					justify-content: space-around;

					.item {
						width: 20%;
						text-align: center;
						color: #999;
					}

					.img_c {
						position: relative;

						.number {
							background-color: $uni-red;
							color: #fff;
							width: 60upx;
							height: 60upx;
							line-height: 60upx;
							border-radius: 50%;
							position: absolute;
							z-index: 1;
							transform: scale(.5);
							text-align: center;
							top: -30upx;
							left: 50%;
							margin-left: 0upx;
						}

						.bg_img_c {
							width: 60upx;
							height: 60upx;
						}
					}
				}
			}

			.left_info {
				display: flex;

				.user_img {
					width: 120upx;
					height: 120upx;
					border-radius: 50%;
					overflow: hidden;
				}

				.name_c {
					color: #fff;
					margin-left: 20upx;
					display: inline-flex;
					justify-content: space-between;
					flex-direction: column;

					.name {
						font-size: 40upx;
					}

					.name2 {
						color: #ddd;
					}

				}

			}

			.right_set {
				.msg1_img {
					width: 40upx;
					height: 40upx;
					margin-left: 40upx;
				}
			}

		}
	}
</style>
