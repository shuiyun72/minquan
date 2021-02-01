<template>
	<view class="have_detail">
		<view class="have_detail_body">
			<view class="money_card">
				<view class="header_have">
					<view class="m_title_l">账户余额 (元)</view>
					<view class="cp2">
						<view class="money">{{myInfo.money}}</view>
						<view class="text_btn" @click="addMoney">充值</view>
					</view>
				</view>
			</view>

			<view class="c_pa2">
				<view class="tab_list_sy">
					<view class="item" v-for="(item, index) in tabList" :class="{ active: index == tabSel }" @click="selectTab(item, index)">{{ item.text }}</view>
				</view>
				<view class="people">
					<view class="item" v-for="item in moneyList" @click="showDetail(item)">
						<view class="l">
							<view class="phone">
								<view class="p" v-if="tabSel == '0'">配送收益</view>
								<view class="p" v-if="tabSel == '1'">订单编号:{{item.order_num}}</view>	
								<!-- <view class="time" v-if="tabSel == '0'">订单编号:{{item.order_num}}</view> -->
								<view class="time">{{item.ftime}}</view>
							</view>
						</view>
						<view class="l" v-if="tabSel == '0'">
							<view class="phone">
								<view class="name" >
									+{{item.money}}
								</view>
								<view class="time">{{memo}}</view>
							</view>
						</view>
						
						<view class="name" v-if="tabSel == '1'">-{{item.money}}元</view>
					</view>
				</view>
				<!-- <view class="more_btn">
					点击加载更多
				</view> -->
			</view>
		</view>
	</view>
</template>

<script>
	import _ from "../../until/lodash";
	export default {
		data() {
			return {
				tabSel: 0,
				tabList: [{
						text: '充值账单',
						type: 0
					},
					{
						text: '消费账单',
						type: 1
					}
				],
				subTime:"",
				
				moneyList:[],
				thisOrderItem:{},
				myInfo:{}
			};
		},
		onShow() {
			this.$getApi("/api/User/getInfo", {}, res => {
				// this.hisList = [];
				console.log(res.data,"个人信息")
				
				this.myInfo = res.data;
				this.selectTab("",0)
			})


		},
		computed:{
			userInfo(){
				return this.$store.state.userInfo;
			},
		},
		methods: {
			calcTixian(type){
				if(type == "1"){
					return  "银行卡提现"
				}
				if(type == "2"){
					return  "微信提现"
				}
				if(type == "3"){
					return  "支付宝提现"
				}
			},
			getDateTime(time){
				return this.$getDate(time,"s-s-s","c")
			},
			selectTab(el, i) {
				this.tabSel = i;
				let typeL = this.tabSel == 0 ? 'in' :'out'; 
				this.$getApi("/api/User/bill", {type:typeL,limit:1000}, res => {
					this.moneyList = res.data.data;
					console.log(res)
					
				})
			},
			showDetail(item){
				// this.$getApi("/App/User/getBalanceDetail", {id:item.id}, res => {
				// 	this.thisOrderItem = res.data;
				// 	this.$refs.orderPopup.open()
				// })
				
			},
			addMoney() {
				uni.navigateTo({
					url: '../order/orderPay?fromType=充值'
				});
			},
		}
	};
</script>

<style lang="scss" scoped>
	.o_it {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10upx 0;
	
		.content {
			min-width: 500upx;
		}
	
		.number {
			width: 60upx;
			text-align: right;
			flex-shrink: 0;
		}
	
		.iconfont {
			font-size: 42upx;
			width: 50upx;
			flex-shrink: 0;
			margin-left: 20upx;
		}
	
		.iconyduizhengqueshixin {
			color: #0f0;
		}
	}
	.qiangdan_pop{
		background-color: #fff;
		border-radius: 20upx;
		box-sizing: border-box;
		width: 680upx;
		padding: 20upx 26upx;
		.title_top{
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 0 20upx;
			.tit{
				font-size: 32upx;
				// color: $uni-bl;
			}
			.iconyduicuowushixin{
				color: #999;
				font-size: 44upx;
			}
		}
		.body_cc{
			.code_text {
				padding: 10upx 0;
				color: #999;
				display: flex;
				&.or{
					color: $uni-or;
					.text{
						color: $uni-or;
					}
				}
				.name{
					width: 160upx;
					flex-shrink: 0;
				}
				.text{
					display: inline-flex;
					align-items: center;
					color: #666;
					.iconfont{
						margin-left: 10upx;
						color: $uni-bl;
					}
				}
				// border-bottom: 1upx solid #f0f0f0;
			}
		}
	}
	
	.have_detail {
		color: #333;

		.money_card {
			// padding: 26upx;
		}

		.header_have {
			background: url(../../static/img/mine/yuebg.png) no-repeat center center;
			background-size: 750upx 360upx;
			padding: 80upx 60upx;
			border-radius: 12upx;
			width: 750upx;
			height: 360upx;
			box-sizing: border-box;

			.m_title_l {
				color: #fff;
				margin-bottom: 30upx;
			}

			.cp2 {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.money {
					font-size: 56upx;
					color: #fff;
				}

				.text_btn {
					// background-color: #fff;
					border: 1upx solid #fff;
					border-radius: 40upx;
					padding: 8upx 46upx;
					color: #fff;
				}
			}
		}

		.tab_list_sy {
			display: flex;
			font-size: 36upx;
			justify-content: space-around;
			background-color: #fff;
			border-top: 26upx solid #eee;

			.item {
				border-bottom: 6upx solid transparent;
				padding: 20upx 0 16upx;

				&.active {
					color: $uni-bl;
					border-bottom: 6upx solid $uni-bl;
				}
			}
		}

		.have_detail_body {
			font-size: 28upx;
			color: #666;

			.c_pa2 {
				background-color: #fff;

				.more_btn {
					font-weight: bold;
					text-align: center;
					color: #666;
					padding-bottom: 40upx;
					font-size: 32upx;
					letter-spacing: 22upx;
				}

				.people {
					padding: 26upx 0;

					.sel_month {
						background-color: #f0f0f0;
						display: flex;
						justify-content: space-between;
						padding: 26upx 26upx 26upx 44upx;
						.iconfont {
							font-size: 28upx;
							margin-left: 6upx;
						}
					}

					.item {
						display: flex;
						align-items: center;
						justify-content: space-between;
						padding: 20upx 26upx;

						&+.item {
							border-top: 1upx solid #eee;
						}

						.img {
							width: 70upx;
							height: 70upx;
						}

						.l {
							display: inline-flex;
							align-items: center;
						}

						.phone {
							margin-left: 20upx;

							.p {
								font-size: 34upx;
							}

							.time {
								color: #999;
								padding-top: 20upx;
							}
							.name {
								text-align: right;
							}
						}

						.name {
							font-weight: bold;
							font-size: 34upx;
							color: #777;
						}
					}
				}
			}
		}
	}
</style>
