<template>
	<view class="home">

		<view class="guodu_header" :style="{'padding-top':SystemInfoL.menu.top+30+'px'}">
			<view class="h_fixed" :class="{'fixed':isFixed}" :style="{'padding-top':SystemInfoL.menu.top+'px'}">
				<view class="fuceng">
					<view class="trans">
						<view class="home_search_sy zindex10" :style="{ 'line-height': (SystemInfoL.menu.bottom - SystemInfoL.menu.top -4) + 'px'}">
							<view class="seach_msg">
								<view class="placeholder_no"  @click="toSearch">
									<view class="iconfont iconsousuo"></view>
									<view class="">
										搜索商品
									</view>
								</view>
								<image src="../../static/img/xiaox.png" class="trans_img" mode=""  @click="toNav('xiaoxi')"></image>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 新品推荐一级菜单 -->
			<view class="nav_first_sy">
				<view class="nav_box">
					<view class="item" v-for="item in homeNav2" @click="toClassify(item)">
						{{item.description}}
					</view>
				</view>
			</view>
			<view class="bt_img zindex10">
				<swiper :autoplay="true" :circular="true" :interval="4000" :duration="1000" @change="changeLunbo">
					<swiper-item v-for="item in lunboList">
						<view class="swiper-item">
							<image :src="httpp+item.images" class="img1"></image>
						</view>
					</swiper-item>
				</swiper>

			</view>
		</view>
		<!-- 头部 end-->
		<view class="home_nav2 m26">
			<view class="item" v-for="item in homeNav1" @click="toClassify(item)">
				<image :src="httpp+item.image" class="nav2_img"></image>
				<view class="text">
					{{item.description}}
				</view>
			</view>
		</view>
		<view class="mine_title m26">
			<image src="../../static/img/redbb.png" class="left_bobao_img" mode=""></image>
			<uni-notice-bar :scrollable="true" :single="true" :text="hotBobao" class="bobao_text" background-color="#fff" color="#333" />
		</view>
		<view class="h20" v-if="dianpuList1.length > 0"></view>
		
		<view class="home_title" v-if="dianpuList1.length > 0">
			<image src="../../static/img/tuijdp.png" class="img" mode=""></image>
			推荐店铺
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
		<view class="dianpu2_list" v-if="dianpuList2.length > 0">
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
		<view class="load_more_sy" v-if="dianpuList.length > 7" @click="toNav('allShop')">
			查看更多<text class="iconfont iconjiantou"></text>
		</view>
		
		<view class="bgcf0f0f0 pt26">
			<view class="hont_find m26">
				<sy-header1 @click="turnTo({name:'热销排行榜'})" :item="title2"></sy-header1>
				<view class="shop_case_box">
					<view class="shop_auto">
						<sy-foot1 @click="part1Num" :item="item" v-for="item in xiaoliangList"></sy-foot1>
					</view>
				</view>
			</view>
			<sy-scroll-x class="p26">
				<view class="item_nav1" v-for="(item,index) in homeNav" :class="{'active':index == nav2dex}" @click="itemNav2('',index,true)">
					<view class="title1">
						精选
					</view>
					<view class="money">
						{{item.description}}
					</view>
				</view>
			</sy-scroll-x>
			<!-- 底部商品 -->
			<view class="pubuliu m26">
				<view class="left_box">
					<sy-pubuli :item='item' v-for="(item,index) in arrtL" @click="foot2Click">
						<view class="num_add_sy1">
							<view class="iconfont iconjian" v-if="item.number > 0" @click.stop="foot2JianJs(item)"></view>
							<view class="n" v-if="item.number > 0">{{ item.number }}</view>
							<view class="iconfont iconjia show" @click.stop="foot2JiaJs(item)"></view>
						</view>
					</sy-pubuli>
				</view>
				<view class="right_box">
					<sy-pubuli :item='item' v-for="(item,index) in arrtR" @click="foot2Click">
						<view class="num_add_sy1">
							<view class="iconfont iconjian" v-if="item.number > 0" @click.stop="foot2JianJs(item)"></view>
							<view class="n" v-if="item.number > 0">{{ item.number }}</view>
							<view class="iconfont iconjia show" @click.stop="foot2JiaJs(item)"></view>
						</view>
					</sy-pubuli>
				</view>
			</view>
		</view>
		<uni-load-more :status="loadStatus"></uni-load-more>

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
				isFixed: false,
				hotBobao: "平台上线了,快来下单吧",
				homeNav: [],
				shopList: [],
				shopList2: [],
				nav2dex: 0,
				lunboList: [],
				lunboIndex: 0,
				loadStatus: 'noMore',
				arrtL: [],
				arrtR: [],
				timer: 0,
				title2: {
					t1: "热销排行榜",
					t2: "大家都在买",
					url: "33"
				},
				xiaoliangList:[],
				jingxuanList:[],
				page:1
			};
		},

		onReachBottom() { //上拉触底函数
			console.log("more")
			++this.page;

			this.itemNav2(this.page)
			
			
		},
		watch: {
			shopCar: {
				handler: function(newVal, oldVal) {
					this.initShopCar()
				},
				deep: true,
				immediate: true
			}
		},
		computed: {
			...mapState(["httpp", "SystemInfo", "userInfo", "shopCar", "location"]),
			dianpuList1(){
				return this.dianpuList.slice(0,3)
			},
			dianpuList2(){
				return this.dianpuList.slice(3,7)
			},
			homeNav1(){
				return this.homeNav.slice(0,10)
			},
			homeNav2(){
				return this.homeNav.slice(10,)
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

			}
		},
		onHide() {
			console.log("cccc")
		},
		mounted() {

		},
		onShow() {
			this.page = 1;
			this.$getApi("/api/Banner/list", {pos:"INDEX_TOP"}, res => {
				console.log(res.data, "轮播图")
				// this_.lunboList = res.data
				this.lunboList = res.data;
			})
			this.$getApi("/api/Notice/list", {}, res => {
				console.log(res.data, "热点播报")
				// this_.lunboList = res.data
				let length = res.data.length;
				if(length > 0){
					this.hotBobao = res.data[length-1].content;
				}else{
					this.hotBobao = ""
				}
			})
			this.$getApi("/api/Category/list", {order_type:"asc"}, res => {
				console.log(res.data, "一级分类")
				this.homeNav = res.data;
				this.$getApi("/api/Shop/list", {is_recommend:1}, res => {
					console.log(res.data, "店铺列表")
					this.dianpuList = res.data.data;
					this.itemNav2("",this.nav2dex,true);
				})
			})
			this.$getApi("/api/Goods/list", {order_field:"sales"}, res => {
				console.log(res.data, "按销量")
				this.xiaoliangList = res.data.data;
			})
			this.$getApi("/api/Cart/list", {}, res => {
				console.log(res.data, "购物车列表")
				this.setCar(res.data)
				this.initShopCar();
			})
			
			
			// this.footPbL();
			// this.startTime();
			// console.log(this.shopCar)
			// _.map(this.shopList, itemL => {
			// 	_.map(this.shopCar, (itemC, index) => {
			// 		if (itemL.id == itemC.id) {
			// 			// this.shopList[index].number = itemC.number
			// 			this.$set(this.shopList[index], "number", itemC.number)
			// 		}
			// 	})
			// })
			// _.map(this.shopList2, itemL => {
			// 	_.map(this.shopCar, (itemC, index) => {
			// 		if (itemL.id == itemC.id) {
			// 			// this.shopList[index].number = itemC.number
			// 			this.$set(this.shopList2[index], "number", itemC.number)
			// 		}
			// 	})
			// })
		},
		onPullDownRefresh() {
			//监听下拉刷新动作的执行方法，每次手动下拉刷新都会执行一次
			setTimeout(function() {
				uni.stopPullDownRefresh(); //停止下拉刷新动画
			}, 1000);
		},
		onPageScroll(res) {
			// console.log(res.scrollTop)
			if (res.scrollTop > 6) {
				this.isFixed = true;
			} else {
				this.isFixed = false;
			}
		},
		methods: {
			...mapMutations(["jiaCar", "jianCar","setCar", "setLocation", "setClassify"]),
			toNav(el){
				if(el == 'xiaoxi'){
					uni.navigateTo({
						url:"../mine/xiaoxi"
					})
				}
				if(el == 'allShop'){
					uni.navigateTo({
						url:"./allShop"
					})
				}
				
			},
			shopNav(item){
				uni.navigateTo({
					url:"../classify/shopClassify?shopId="+item.id
				})
			},
			nShareAppMessage: function(e) {
				let title = '民权生鲜'
				return {
					title: title,
					path: 'pages/home/home'
				}
			},
			toClassify(item) {
				this.setClassify(item)
				uni.switchTab({
					url: '../classify/classify'
				})

			},
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
			getPopup() {
				console.log("lingque")
			},
			toSearch() {
				uni.navigateTo({
					url: "./search"
				})
			},
			
			itemNav2(page, index,isPage) {
				console.log(page)
				if(index >= 0){
					this.nav2dex = index;
				}
				if(isPage){
					this.page = 1;
				}
				if(page>1){
					this.page = page
				}
				this.$getApi("/api/Goods/list", {order_field:"weigh",page:this.page,category_id:this.homeNav[this.nav2dex].id,shopinfo:1}, res => {
					console.log(res.data, "按权重,精选")
					let jingxuanList = [];
					let jingxuanListNum = [];
					if(isPage){
						jingxuanList = res.data.data;
					}else{
						jingxuanList = [...this.jingxuanList,...res.data.data]
					}
					_.map(jingxuanList,item=>{
						// _.map(this.dianpuList, (itemShop, index) => {
						// 	if (item.shop_id == itemShop.id) {
						// 		item.shopImg = itemShop.logo;
						// 		item.shopName = itemShop.name;
						// 	}
						// })
						item.number = 0;
						_.map(this.shopCar, (itemC, index) => {
							if (item.id == itemC.id) {
								item.number = itemC.number;
							}
						})
						jingxuanListNum.push(item)
					})
					this.jingxuanList = jingxuanListNum;
					this.footPbL();
				})
			},
			part1Num(item) {
				console.log(item)
				this.itemClick(item)
			},
			changeLunbo(el) {
				setTimeout(() => {
					this.lunboIndex = el.detail.current;
				}, 1000)

			},
			footPbL(type) {
				let arrtL = [];
				let arrtR = [];
				console.log(this.jingxuanList)
				_.map(this.jingxuanList, (item, index) => {
					console.log(item, index)
					if (index % 2 == 0) {
						arrtL.push(item)
					} else {
						arrtR.push(item)
					}
				})
				this.arrtL = arrtL;
				this.arrtR = arrtR;
				console.log(arrtL)
				console.log(arrtR)
			},
			turnTo(item) {
				console.log(item)
				if (item.name == '新品推荐') {
					uni.navigateTo({
						url: "../recommend/recommend?title=" + item.name
					})
				}
				if (item.name == '热销排行榜') {
					uni.navigateTo({
						url: "./searchResult?searchName=热销排行榜&fromType=home"
					})
				}
				if (item.name == '买一送一') {
					uni.navigateTo({
						url: "../recommend/recommend?title=" + item.name
					})
				}
				if (item.name == '本周上新') {
					uni.navigateTo({
						url: "../recommend/recommend?title=" + item.name
					})
				}
				if (item.name == '限时抢购') {
					uni.navigateTo({
						url: "../recommend/noTimeRecommend"
					})
				}

				if (item.name == '新人专属') {
					uni.navigateTo({
						url: "../find/xinrenzhuanshu?title=" + item.name
					})
				}
			},
			foot2Click(item) {
				console.log(item)
				uni.navigateTo({
					url: '../detail/detail?id=' + item.id
				})
			},
			itemClick(item) {
				console.log(item)
				uni.navigateTo({
					url: '../detail/detail?id=' + item.id
				})
			},

			foot2Jia(item) {
				this.foot2JiaItem(item, 1)
			},
			foot2iJia(item) {
				this.foot2JiaItem(item, 2)
			},
			foot2JiaJs(item) {
				this.foot2JiaItem(item, 3)
			},
			foot2Jian(item) {
				this.foot2JianItem(item, 1)
			},
			foot2iJian(item) {
				this.foot2JianItem(item, 2)
			},
			foot2JianJs(item) {
				this.foot2JianItem(item, 3)
			},
			foot2JiaItem(item, el) {
				let list = [];
				if (el == 1) {
					list = this.shopList
				} else
				if (el == 2) {
					list = this.shopList2
				} else
				if (el == 3) {
					list = this.jingxuanList
				}
				_.map(list, fil => {
					if (fil.id == item.id) {
						item.number++;
						this.jiaCar(item)
					}
				})
			},
			foot2JianItem(item, el) {
				let list = [];
				if (el == 1) {
					list = this.shopList
				} else
				if (el == 2) {
					list = this.shopList2
				} else
				if (el == 3) {
					list = this.jingxuanList
				}
				_.map(list, fil => {
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
	.load_more_sy{
		color: #777;
		text-align: center;
		padding: 20upx 0;
		border-top: 1upx solid #f0f0f0;
		.iconjiantou{
			font-size: 28upx;
		}
	}
	.home {
		.h26{
			background-color: #f0f0f0;
			height: 20upx;
		}
		.pt26 {
			padding-top: 26upx;
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
		.h_fixed {
			position: fixed;
			width: 750upx;
			left: 0;
			top: 0;
			background-color: rgba(24, 179, 87, 0);
			transition: all .5s;

			&.fixed {
				background-color: rgba(24, 179, 87, 1);
				z-index: 10;
			}
		}

		.item_nav1 {
			width: 170upx;
			flex-shrink: 0;
			text-align: center;

			&.active {
				.title1 {
					color: $uni-bl;
				}

				.money {
					color: #fff;
					background-color: $uni-bl;
				}
			}

			.title1 {
				font-weight: bold;
				font-size: 30upx;
				padding-bottom: 6upx;
			}

			.money {
				color: #999;
				padding: 6upx 12upx;
				transform: scale(.8);
				border-radius: 30upx;
			}
		}

		.hont_find {
			background-color: $uni-or;
			border-radius: 22upx 22upx;
			margin-bottom: 26upx;
		}

		.shop_case_box {
			.shop_auto {
				background-color: #fff;
				border-radius: 22upx;
				padding: 26upx;
				box-sizing: border-box;
				display: flex;
				overflow-x: auto;
			}
		}




		color: #333;

		// background-color: #f0f0f0;
		.mine_title {
			display: flex;
			align-items: center;
			padding-top: 20upx;
			.left_bobao_img {
				width: 140upx;
				height: 26upx;
				margin-bottom: 10px;
			}

			.bobao_text {
				flex: 1
			}
		}

		.guodu_header {
			position: relative;
			background-image:linear-gradient(to bottom, #18B357 0%, #18B357  30%, #fff 100%);
			.guodu {
				position: absolute;
				width: 750upx;
				height: 100%;
				top: 0;
				left: 0;
				z-index: 1;
				transition: opacity 2s;
			}
		}

		.zindex10 {
			z-index: 10;
		}

		.header_title {
			text-align: center;
			color: #fff;
			font-size: 36upx;
		}
		.bt_img {
			.swiper-item {
				text-align: center;
			}

			.img1 {
				width: 700upx;
				height: 300upx;

			}
		}

		.home_nav2 {
			display: flex;

			flex-wrap: wrap;

			.item {
				width: 130upx;
				text-align: center;
				padding: 10upx 10upx 10upx 0;

				.nav2_img {
					width: 96upx;
					height: 96upx;
				}
			}
		}
	}

	.fuceng {
		height: 76upx;
		width: 750upx;
		position: relative;

		.trans {
			width: 700upx;
			position: absolute;
			top: 0;
			left: 0;
			z-index: 10;
			padding: 10upx 26upx;

		}

	}

	.home_title {
		padding: 20upx 26upx;
		font-size: 30upx;
		color: #666;

		.img {
			width: 30upx;
			height: 30upx;
			vertical-align: middle;
			margin-right: 20upx;
		}
	}

	.home_search_sy {
		// border: 1upx solid $uni-bl;
		border-radius: 40upx;

		transition: width 2s;
		// display: flex;

		.seach_msg {
			display: flex;
			align-items: center;
			justify-content: space-between;

			.placeholder_no {
				color: #666;
				display: inline-flex;
				// justify-content: center;
				align-items: center;
				padding-left: 40upx;
				width: 560upx;
				background-color: #fff;
				border-radius: 40upx;

				.iconsousuo {
					font-size: 26upx;
					padding-right: 20upx;

				}
			}

			.trans_img {
				width: 40upx;
				height: 40upx;
			}
		}

	}

	.pubuliu {
		display: flex;

		justify-content: space-between;
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

	.num_add_sy1 {
		display: inline-flex;

		.n {
			width: 30upx;
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
			transform: scale(.8);
		}

		.iconjia {
			background-color: #f0f0f0;
			color: #666;
			transform: scale(.8);

			&.show {
				background-color: $uni-bl;
				color: #fff;
			}
		}
	}

	.jiushui_qu_sy {
		margin: 100upx 26upx 20upx;
		border: 20upx solid $uni-bl;
		border-top: 130upx solid $uni-bl;
		position: relative;

		.ab_img {
			position: absolute;
			top: -210upx;
			left: -30upx;

			.img {
				width: 714upx;
				height: 200upx;
			}
		}

		.jiushui_box {
			display: flex;
			justify-content: space-around;
			padding-top: 10upx;

			.item {
				text-align: center;

				.img {
					width: 150upx;
					height: 150upx;
				}

				.money {
					background-color: $uni-red;
					transform: scale(.9);
					color: #fff;
					border-radius: 20upx;

					.number {
						font-size: 30upx;
					}

				}

				.text {
					font-size: 28upx;
					padding-top: 6upx;
				}
			}
		}
	}

	.nav_first_sy {
		width: 750upx;
		overflow-x: auto;
		padding: 26upx 0;
		.nav_box {
			padding: 0 26upx;
			display: flex;
			.item {
				background-color: rgba(255, 255, 255, .2);
				padding: 4upx 30upx;
				border-radius: 40upx;
				color: #fff;
				font-weight: bold;
				display: inline-flex;
				flex-shrink: 0;
				margin-right: 20upx;
			}
		}
	}
</style>
