<template>
	<view class="have_detail">
		<view class="have_detail_body">
			<view class="money_card">
				<view class="header_have">
					<view class="m_title_l">钱包余额 (元)</view>
					<view class="money">{{myMoney}}</view>
					<view class="text_btn" @click="addMoney">提现</view>
					<view class="text">
						余额超过500.0便可提现
					</view>
				</view>
			</view>

			<view class="c_pa2">
				<view class="m26">
					<view class="iconfont icontianxiegongdan-kuozhan-hebing"> <text class="cc">资产明细 </text></view>
				</view>
				<view class="tab_list_cc_sy">
					<view class="item" v-for="(item, index) in tabList" :class="{ active: index == tabSel }" @click="selectTab(item, index)">{{ item.text }}</view>
				</view>
				<view class="people">
					<view class="sel_month">

						<picker mode="multiSelector" @columnchange="bindMultiPickerColumnChange" :value="multiIndex" :range="multiArray">
							<view class="peisong_timje">{{timeText}}<text class="iconfont iconai-arrow-down"></text></view>
						</picker>

						<view class="">
							<view class="" v-if="tabSel != 2 && resData.sum_in">
								{{resData.sum_in}}元
							</view>
							<view class="" v-if="tabSel != 1 && resData.sum_out">
								{{resData.sum_out}}元
							</view>
						</view>
					</view>
					<view class="item" v-for="item in resData.list">
						<view class="l">
							<view class="phone">
								<!-- <view class="p" v-if="tabSel == '0'">订单号:{{item.memo}}</view>
								<view class="p" v-if="tabSel == '1'">微信提现</view> -->
								<view class="p" >{{item.memo}}</view>
								<view class="time">{{item.ftime}}</view>
							</view>
						</view>

						<!-- <view class="name" v-if="tabSel == '0'">{{resData.sum_in}}</view>
						<view class="name" v-if="tabSel == '1'">{{resData.sum_out}}</view> -->
						<view class="name">{{item.money}}</view>
						
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabSel: 0,
				tabList: [{
						text: '全部',
						type: "all"
					}, {
						text: '收入',
						type: "in"
					},
					{
						text: '提现',
						type: "out"
					}
				],
				multiArray: [
					["2020", "2021", "2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029"],
					["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]
				],
				multiIndex: [1, 0],
				timeText: "2020-12",
				myMoney: 0,
				resData: {}

			};
		},
		onShow() {
			this.getDate();
			this.$getApi('/api/Merchant/info', {}, res => {
				console.log(res.data)
				// this.resData = res.data
				this.myMoney = res.data.money;
				// this.myMoney = 5000
			})
			this.selectTab("", this.tabSel)
		},
		onHide() {

		},
		methods: {
			selectTab(el, i) {
				this.tabSel = i;
				let dataL = {
					year: this.multiArray[0][this.multiIndex[0]],
					month: this.multiArray[1][this.multiIndex[1]],
					type: this.tabList[this.tabSel].type
				};
				
				this.$getApi('/api/Merchant/bill', dataL, res => {
					console.log(res.data)
					// this.resData = res.data
				})
				
			},
			addMoney() {
				if (Number(this.myMoney) > 500) {
					uni.navigateTo({
						url: './tixian'
					});
				} else {
					this.$msg("您的金额不足以提现!")
				}

			},
			bindMultiPickerColumnChange: function(el) {
				// console.log(el)
				if (el.detail.column == 0) {
					this.multiIndex[0] = el.detail.value
					this.getDate()
				} else
				if (el.detail.column == 1) {
					this.multiIndex[1] = el.detail.value;
					this.getDate()
				}
			},
			getDate() {
				this.timeText = this.multiArray[0][this.multiIndex[0]] + "-" + this.multiArray[1][this.multiIndex[1]];

			}
		}
	};
</script>

<style lang="scss">
	page {
		background-color: #f0f0f0;
	}



	.have_detail {
		color: #333;

		.qiangdan_pop {
			background-color: #f0f0f0;
			border-radius: 20upx;
			box-sizing: border-box;
			width: 680upx;
			padding: 20upx 26upx;

			.title_top {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 0 0 20upx;

				.tit {
					font-size: 32upx;
					// color: $uni-bl;
				}

				.iconyduicuowushixin {
					color: #999;
					font-size: 44upx;
				}
			}

			.body_cc {
				.code_text {
					padding: 10upx 0;
					color: #999;
					display: flex;

					&.or {
						color: $uni-or;

						.text {
							color: $uni-or;
						}
					}

					.name {
						width: 160upx;
						flex-shrink: 0;
					}

					.text {
						display: inline-flex;
						align-items: center;
						color: #666;

						.iconfont {
							margin-left: 10upx;
							color: $uni-bl;
						}
					}

					// border-bottom: 1upx solid #f0f0f0;
				}
			}
		}

		.o_it {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 10upx 0;

			.content {
				min-width: 500upx;
			}

			.num {
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

		.money_card {
			// padding: 26upx;
		}

		.header_have {
			background-color: $uni-bl;
			padding: 50upx 60upx;
			// border-radius: 12upx;
			width: 750upx;
			height: 360upx;
			box-sizing: border-box;
			color: #fff;
			text-align: center;

			.m_title_l {
				margin-bottom: 10upx;
			}

			.money {
				font-size: 46upx;

			}

			.text_btn {
				border: 1upx solid #fff;
				border-radius: 16upx;
				padding: 8upx 0;
				width: 160upx;
				margin: 20upx auto;
			}


		}

		.tab_list_cc_sy {
			display: flex;
			font-size: 28upx;

			background-color: #fff;

			padding: 20upx 26upx;

			.item {
				// border-bottom: 6upx solid transparent;
				padding: 8upx 30upx 6upx;
				border: 1upx solid #999;
				border-radius: 40upx;
				color: #999;
				margin-right: 26upx;

				&.active {
					color: #f0f0f0;
					background-color: $uni-bl;
					border: 1upx solid $uni-bl;
					// border-bottom: 6upx solid $uni-bl;
				}
			}
		}

		.have_detail_body {
			font-size: 28upx;
			color: #666;

			.c_pa2 {
				background-color: #fff;

				.icontianxiegongdan-kuozhan-hebing {
					font-size: 30upx;
					padding: 26upx 0 10upx;

					.cc {
						margin-left: 10upx;
					}
				}

				.more_btn {
					font-weight: bold;
					text-align: center;
					color: #666;
					padding-bottom: 40upx;
					font-size: 32upx;
					letter-spacing: 22upx;
				}

				.people {
					.sel_month {
						background-color: #f0f0f0;
						display: flex;
						justify-content: space-between;
						padding: 26upx 26upx 26upx 26upx;

						.peisong_timje {
							background-color: #fff;
							padding: 6upx 20upx;
							border-radius: 20upx;
						}

						.iconfont {
							font-size: 28upx;
							margin-left: 6upx;
							transform: scale(.8);
							display: inline-block;
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
								font-size: 28upx;
							}

							.time {
								color: #999;
								padding-top: 20upx;
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
