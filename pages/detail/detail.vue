<template>
	<view class="detail">
		<view class="swiper_box">
			<swiper :autoplay="false" :interval="3000" :duration="1000" class="h_lunbo" @change="detailSw">
				<swiper-item v-for="item in itemBanner">
					<view class="swiper-item">
						<image :src="httpp+item" mode="" class="img"></image>
					</view>
				</swiper-item>
			</swiper>
			<view class="show_bi_num">
				<view class="cbc">
					{{imgsIndex+1}}/{{itemBanner.length}}
				</view>
			</view>
		</view>
		<view class="detail_info">
			<view class="money_num">
				<view class="left">
					<view class="red">
						<text>￥</text>
						<text class="m_n">{{itemDetail.price}}</text>
					</view>
					<!-- <view class="old_m">
						￥6.9
					</view> -->
					<view class="all_num">
						剩余{{itemDetail.stock}}件
					</view>
				</view>
			</view>
			<view class="t_title">
				{{itemDetail.name}}
			</view>
		</view>
		<view class="bgf20"></view>
		<uni-list>
			<uni-list-item :title="'商品评价('+pingjiaNum+')'" note="" rightText="查看全部" @click="showAllRate"></uni-list-item>
		</uni-list>
		<view class="pingjia_box_sy" v-if="pingjiaNum > 0">
			<view class="pingjia_user">
				<view class="left">
					<image :src="pingjia.avatar" class="img" mode=""></image>
					<view class="name shengluehao">
						{{pingjia.nickname}}
					</view>
				</view>
				<view class="time">
					{{pingjia.ftime}}
				</view>
			</view>
			<view class="rate_pj" v-if="pingjia.grade">
				<uni-rate color="#bbb" active-color="#F59005" :readonly="true" :size="18" :value="pingjia.grade" ></uni-rate>
			</view>
			
			<view class="wa_text">
				{{pingjia.content}}
			</view>
			<view v-if="pingjiaImg.length > 0">
				<view class="pingjia_img_box">
					<view class="img_item" :style="'backgroundImage: url('+httpp+itemImg+')'" v-for="itemImg in pingjiaImg"></view>
				</view>
			</view>
		</view>
		<view class="bgf20"></view>
		<view class="shop_info_sy" @click="toNav('shop')" v-if="itemDetail.shop">
			<image :src="httpp+itemDetail.shop.logo" class=" left_img" mode=""></image>
			<view class="info">
				<view class="title">
					<text>{{itemDetail.shop.name}}</text><text class="iconfont iconjiantou"></text>
				</view>
				<view class="or">
					{{itemDetail.shop.desc}}
				</view>
			</view>
		</view>
		<view class="xingqing_title">
			<view class="v"></view>
			<view class="t">
				商品详情
			</view>
			<view class="v"></view>
		</view>
		<view class="img_bg_box">
			<view class="img_c" v-for="item in itemContent">
				<image :src="httpp+item" class="img" mode="widthFix"></image>
			</view>
		</view>
		<view class="bottom_btn_group_sy">
			<view class="left">
				<view class="item shoucao" :class="isShoucang?'active':''" @click="handleC('shoucang')">
					<view class="iconfont iconshoucang"></view>
					<view class="text">
						{{isShoucang?'已收藏':'收藏'}}
					</view>
				</view>
				<view class="item car" @click="handleC('car')">
					<view class="iconfont icongouwuche"></view>
					<view class="text">
						购物车
					</view>
					<view class="sm_text" v-if="carShowNum>0">
						{{carShowNum}}
					</view>
				</view>
			</view>	
			<view class="btn_def btn_blue" @click="foot2Jia">
				加入购物车
			</view>
			<view class="btn_def btn_or" @click="toNav('pay')">
				立即购买
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
				value:5,
				itemId: 0,
				isShoucang:false,
				itemBanner:[],
				itemContent:[],
				imgsIndex: 0,
				itemDetail:{
					number:0
				},
				pingjia:{},
				pingjiaNum:"",
				pingjiaImg:[]
			};
		},
		onLoad(ph) {
			this.itemId = ph.id;
			this.$getApi("/api/Goods/detail", {id:this.itemId}, res => {
				console.log(res.data, "商品详情")
					let item = res.data;
					item.number = 0;
					_.map(this.shopCar, (itemC, index) => {
						if (item.id == itemC.id) {
							item.number = itemC.number;
						}
					})
					this.isShoucang = item.is_favorites == 1 ? true :false;
				this.itemDetail = item;
				this.itemBanner = this.itemDetail.banner_images.split(",");
				this.itemContent = this.itemDetail.content_images.split(",");
			})
			this.$getApi("/api/Goods/comments", {id:this.itemId}, res => {
				console.log(res.data, "商品评价")
				this.pingjiaNum = res.data.total;
					if(this.pingjiaNum > 0){
						this.pingjia = res.data.data[1];
						if(this.pingjia.images){
							this.pingjiaImg = this.pingjia.images.split(",");
						}else{
							this.pingjiaImg = []
						}
						
						console.log(this.pingjiaImg)
					}else{
						this.pingjia = {},
						this.pingjiaImg = []
					}
			})
		},
		computed:{
			...mapState(["httpp", "SystemInfo", "userInfo", "shopCar","classifyId"]),
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
			detailSw(el) {
				this.imgsIndex = el.detail.current;
			},
			showAllRate(){
				console.log("dsd")
				uni.navigateTo({
					url:"./allRate?itemId="+this.itemId
				})
			},
			handleC(el){
				if(el == "shoucang"){
					if(this.isShoucang){
						this.$getApi("/api/Favorites/del", {type:"goods",id:this.itemId}, resCode => {
							console.log(resCode.data,"收藏商品")
							this.$msg("已取消收藏")
							this.isShoucang = false;
						})
					}else{
						this.$getApi("/api/Favorites/add", {type:"goods",id:this.itemId}, resCode => {
							console.log(resCode.data,"收藏商品")
							this.$msg("收藏成功")
							this.isShoucang = true;
						})
					}
				}
				if(el == "car"){
					uni.switchTab({
						url:"../shopCar/shopCar"
					})
				}
			},
			toNav(el){
				if(el == 'shop'){
					uni.navigateTo({
						url:"../classify/shopClassify?shopId="+this.itemId
					})
				}
				if(el == 'pay'){
					let item = this.itemDetail;
					++item.number;
					this.$getApi("/api/Cart/change", {id:item.id,number:item.number}, res => {
						console.log(res.data, "商品列表")
						this.jiaCar(item)
						this.$getApi("/api/Cart/list", {id:item.id,number:item.number}, res => {
							console.log(res.data, "商品列表")
							uni.navigateTo({
								url:"../order/orderTrue?footId="+this.itemId
							})
						})
					})
				}
				
			},
			foot2Jia() {
				let item = this.itemDetail;
				++item.number;
				this.$getApi("/api/Cart/change", {id:item.id,number:item.number}, res => {
					console.log(res.data, "商品列表")
					this.jiaCar(item)
					this.$getApi("/api/Cart/list", {id:item.id,number:item.number}, res => {
						console.log(res.data, "商品列表")
						
					})
				})
			
			}
		}
	}
</script>

<style lang="scss" scoped>
	.bottom_btn_group_sy{
		display: flex;
		position:fixed;
		width: 750upx;
		bottom: 0;
		left: 0;
		z-index: 10;
		
		justify-content: space-between;
		box-sizing: border-box;
		padding-left: 10upx;
		background-color: #fff;
		align-items: center;
		.left{
			display: flex;
			.item{
				text-align: center;
				color: #999;
				width: 120upx;
				.iconfont{
					font-size: 44upx;
					position:relative;
					top:8upx;
				}
				&.active{
					color: $uni-or;
				}
			}
			.car{
				position:relative;
				.sm_text{
					background-color: #f00;
					color: #fff;
					position:absolute;
					width: 50upx;
					height: 50upx;
					top: -14upx;
					right: 0;
					line-height: 50upx;
					text-align: center;
					border-radius: 50%;
					font-size: 32upx;
					transform: scale(.7);
				}
			}
		}
		.btn_def{
			height: 100upx;
			line-height: 100upx;
			width: 258upx;
			text-align: center;
			font-size: 32upx;			
			color: #fff;
			&.btn_blue{
				background-color: $uni-bl;
			}
			&.btn_or{
				background-color: $uni-or;
			}
		}
		.btn_group{
			display: flex;
			
			color: #fff;
			height: 100upx;
			width: 330upx;
			.btn{
				width: 33%;
				display: inline-flex;
				align-items: center;
				justify-content: center;
				opacity: 0.9;
				background-color: $uni-bl;
				&.number{
					opacity: 1;
				}
			}
		}
	}
	
	.shop_info_sy{
		display: flex;
		align-items: center;
		padding: 20upx 26upx;
		.left_img{
			width: 140upx;
			height: 140upx;
		}
		.info{
			padding-left: 20upx;
			padding-bottom: 6upx;
			.title{
				color: #333;
				font-size: 30upx;
				margin-bottom: 10upx;
				.iconjiantou{
					font-size: 30upx;
					color: #666;
				}
			}
			.or{
				color: $uni-or;
			}
		}
	}
	.pingjia_box_sy{
		padding: 0 26upx;
		.pingjia_user{
			display: flex;
			justify-content: space-between;
			align-items: center;
			color: #666;
			padding-right: 20upx;
			.left{
				display: inline-flex;
				align-items: center;
				
				.img{
					width: 80upx;
					height: 80upx;
				}
				.name{
					font-size: 30upx;
					margin-left: 20upx;
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
			padding-bottom: 20upx;
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
	.detail {
		font-size: 26upx;

		.bgf20 {
			width: 750upx;
			height: 20upx;
			background-color: #f0f0f0;
		}

		.detail_info {
			padding: 0 26upx;

			.money_num {
				.left {
					display: flex;
					justify-content: space-between;
					align-items: baseline;
					.red {
						display: inline-flex;
						align-items: baseline;

						.m_n {
							font-weight: bold;
							font-size: 38upx;
						}
					}

					.old_m {
						text-decoration: line-through;
						color: #999;
						margin: 0 30upx;
					}

					.all_num {
						color: #999;
					}
				}

				.right {
					background-color: $uni-bl-bg;
					color: $uni-bl;
					padding: 8upx 20upx 0;
					border-radius: 30upx;
					display: inline-block;
					transform: scale(.9);

					.liucheng_img {
						width: 20upx;
						height: 20upx;
						margin-right: 10upx;
					}
				}
			}

			.t_title {
				font-size: 36upx;
				color: #666;
				padding: 20upx 0 40upx;
			}
		}

		.xingqing_title {
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 26upx 0;
			background-color: #f0f0f0;

			.v {
				width: 100upx;
				height: 2upx;
				background-color: #999;
			}

			.t {
				padding: 0 30upx;
				color: #666;
				font-size: 32upx;
			}
		}

		.swiper_box {
			position: relative;

			.show_bi_num {
				display: flex;
				justify-content: flex-end;
				padding: 0 26upx;
				position: absolute;
				bottom: 0;
				right: 0upx;

				.cbc {
					background-color: #999;
					padding: 6upx 30upx 8upx;
					border-radius: 40upx;
					color: #fff;
					transform: scale(.8);
					font-size: 32upx;
				}
			}
		}


		.h_lunbo {
			margin-bottom: 20upx;
			height: 700upx;

			.swiper-item {
				text-align: center;

				.img {
					width: 700upx;
					height: 700upx;
				}
			}
		}

		.img_bg_box {
			.img_c {
				line-height: inherit;

				.img {
					line-height: initial;
					width: 750upx;
					vertical-align: bottom
				}
			}
		}
		.weke_new {
			padding: 30upx 0 10upx;
			.weke_new_header_sy {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding-bottom: 10upx;
		
				.left {
					display: inline-flex;
					align-items: center;
		
					.t_img {
						width: 30upx;
						height: 30upx;
					}
		
					.title1 {
						font-size: 30upx;
						margin: 0 20upx;
						font-weight: bold;
					}
		
					.title2 {
						color: #999;
					}
				}
		
				.right {
					display: inline-flex;
					align-items: center;
					color: #999;
				}
			}
		
		
			.weke_box_item {
				width: 170upx;
				margin-right: 20upx;
				.t_img {
					width: 170upx;
					height: 170upx;
				}
		
				.title1 {
					color: #666;
					padding: 12upx 0 4upx;
				}
				.zhuijia{
					display: flex;
					justify-content: space-between;
					padding: 10upx 0;
					.m {
						font-weight: bold;
					}
					.iconjia1{
						color: $uni-bl;
					}
				}
				
			}
		
		}
		
	}
</style>
