<template>
	<view class="home">
		<view class="h_cord">
			<view class="pt1">
				<image :src=" httpp + userInfoRes.logo" class="p1_img" mode="" v-if="userInfoRes.logo"></image>
				<view class="pt1_rigth">
					<view class="u_info">
						<view class="title">
							{{userInfoRes.name}}
						</view>
						<view class="rate_bg_sy">
							<view class="rate_i_sy">
								<view class="rate_i iconfont iconxingxing yellow" v-for="ra in calcNum(userInfoRes.star)" @click="selStat(ra)"></view>
								<view class="rate_i iconfont iconxingxing" v-for="ra in calcNum(5 - userInfoRes.star)"  @click="selStat(userInfoRes.star+ra)"></view>
							</view>
							<view class="right">{{ userInfoRes.star }}.0</view>
						</view>
						<view class="info">
							{{userInfoRes.desc}}
						</view>
					</view>
					<view class="switch_f">
						 <view class="uni-list-cell-db">开关</view>
						<switch color="#A6D2FF" :checked="isOn" @change="changeOn" class="switch"/>
					</view>
				</view>
			</view>
			<view class="pt2">
				<view class="item">
					<view class="num">
						{{userInfoRes.today_salary}}元
					</view>
					<view class="text">
						今日收入
					</view>
				</view>
				<view class="item">
					<view class="num">
						{{userInfoRes.month_salary}}元
					</view>
					<view class="text">
						本月收入
					</view>
				</view>
				<view class="item">
					<view class="num">
						{{userInfoRes.total_salary}}元
					</view>
					<view class="text">
						累计收入
					</view>
				</view>
			</view>
		</view>
		<view class="ctrl_list">
			<view class="user_item" v-for="item in userList" @click="toNav(item)">
				<image :src="'../../static/img/'+item.img" class="home_img" mode=""></image>
				<view class="info">
					<view class="title">
						{{item.title}}
					</view>
					<view class="title2">
						{{item.title2}}
					</view>
				</view>
				<view class="iconfont iconjiantou"></view>
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
				userInfoRes:{},
				isOn:true,
				userList:[
					{
						img:"dingdgl.png",
						title:"商品管理",
						title2:"编辑上架下架管理商品",
						url:"shopAdmin/shopAdmin"
					},
					{
						img:"dingdgl.png",
						title:"订单管理",
						title2:"管理店铺订单",
						url:"order/order"
					},
					{
						img:"qianbgl.png",
						title:"钱包管理",
						title2:"收入与提现账单",
						url:"money/money"
					},
					{
						img:"dianpgl.png",
						title:"店铺管理",
						title2:"编辑管理我的店铺",
						url:"shopStore/shopStore"
					},
					{
						img:"shez.png",
						title:"我的设置",
						title2:"编辑管理我的店铺",
						url:"set/set"
					}
				]
			};
		},
		computed: {
			...mapState(["httpp", "shopInfo","userInfo"]),
		},
		onShow() {
			
			this.$getApi('/api/Merchant/info',{},res=>{
				console.log(res.data)
				this.isOn = res.data.status == 1 ? true : false;

				console.log(res.data.logo)
			})
			this.$getApi('/api/Merchant/income',{},resNum=>{
				console.log(resNum.data)

				this.userInfoRes = this.shopInfo;
				this.userInfoRes.today_salary = resNum.data.today;
				this.userInfoRes.month_salary = resNum.data.month;
				this.userInfoRes.total_salary = resNum.data.all;
				this.userInfoRes.star = 4;
			})
		},
		methods:{
			calcNum(num) {
				let arrayL = [];
				for (let i = 0; i < num; i++) {
					arrayL.push(i);
				}
				return arrayL;
			},
			changeOn(el){
				console.log(el)
				this.$getApi('/api/Merchant/switch',{},res=>{
					console.log(res.data)
					this.isOn = res.data.status == 1 ? true : false;
				})
			},
			toNav(item){
				uni.navigateTo({
					url:"../"+item.url
				})
			}
		}
	}
</script>
<style lang="scss">
	page {
		background-color: #f0f0f0;
	}
</style>
<style lang="scss">
	.home {
		background: url(../../static/img/bg.png) no-repeat top center;
		background-size: 750upx auto;	
		.h_cord {
			color: #f0f0f0;
			padding: 20upx 30upx;
			.rate_bg_sy {
				display: inline-flex;
				.rate_i_sy {
					display: inline-flex;
					// justify-content: space-around;
					align-items: center;
					.iconxingxing {
						color: #ccc;
						font-size: 20upx;
						margin-right: 6upx;
						&.yellow {
							color: $uni-or;
						}
					}
				}
				.right {
					color: #f0f0f0;
					font-size: 28upx;
					position:relative;
					top:-4upx;
					left: 10upx;
				}
			}
			.pt1{
				display: flex;
				align-items: center;
				.p1_img{
					width: 140upx;
					height: 140upx;
					margin-right: 20upx;
				}
				.pt1_rigth{
					display: inline-flex;
					flex:1;
					justify-content: space-between;
					align-items: flex-start;
					.u_info{
						padding: 10upx 0 20upx;
						height: 140upx;
						display: inline-flex;
						flex-direction: column;
						justify-content: space-around;
						.title{
							font-size: 32upx;
						}
					}
					.switch_f{
						display: inline-flex;
						align-items: center;
						position: relative;
						right: -28upx;
						.switch{
							transform: scale(.6);
						}
					}
				}
			}
			.pt2 {
				display: flex;
				justify-content: space-between;
				padding: 30upx 30upx 20upx;
				.item {
					text-align: center;
					color: #eee;
					.num {
						font-size: 38upx;
						margin-bottom: 10upx;
					}

					.text {
						font-size: 28upx;
					}
				}
			}
		}
		.ctrl_list{
			padding: 30upx 40upx 0;
			.user_item{
				display: flex;
				background-color: #fff;
				padding: 30upx 40upx;
				border-radius: 16upx;
				align-items: center;
				margin-bottom: 20upx;
				.home_img{
					width: 80upx;
					height: 90upx;
				}
				.info{
					margin-left: 40upx;
					flex:1;
					.title{
						font-size: 34upx;
						color: #666;
						margin-bottom: 10upx;
					}
					.title2{
						color: #999;
					}
				}
				.iconjiantou{
					color: #999;
				}
			}
		}
	}
</style>
