<template>
	<view>
		<view class="tab_list_sy">
			<view class="item" v-for="(item,index) in tabList" :class="{'active':index == tabSel}" @click="selectTab(item,index)">{{item.text}}</view>
		</view>
		<view class="home_body">
			<view class="no_list" v-if="orderList.length == 0">
				列表为空
			</view>
			<view class="order_item_sy" v-for="orderItem in orderList" v-if="orderList.length > 0">
				<view class="o_title">
					<view class="time_l blue" v-if="orderItem.status == 0">
						待配货
					</view>
					<view class="time_l blue" v-if="orderItem.status == 1">
						配送中
					</view>
					<view class="time_l green" v-if="orderItem.status == 2">
						平台配送中
					</view>
					<view class="time_l" v-if="orderItem.status == 3">
						已完成
					</view>
					<view class="time_2">
						{{orderItem.createtime}}
					</view>
				</view>
				<view class="code_text">
					送件码 : <text class="blue">{{orderItem.code}}</text> 
				</view>
				<view class="o_it" v-for="item in orderItem.goods">
					<view class="content">
						{{item.name}}
					</view>
					<view class="num">
						x{{item.number}}
					</view>
				</view>
				<view class="code_text">
					订单编号 : {{orderItem.out_trade_no}}
				</view>
				<view class="code_text">
					用户留言 : {{orderItem.remark}}
				</view>
				
				<view class="" v-if="orderItem.state == 3">
					<view class="code_text">
						送达中心时间 : {{orderItem.code}}
					</view>
					<view class="code_text">
						配送完成时间 : {{orderItem.code}}
					</view>
				</view>
				<view class="order_num_info">
					共2件 预计货款 : <text class="money">{{orderItem.total_fee}} 元</text>
				</view>
				<view class="btn_box">
					<view class="btn blue sm round" @click.stop="toNav('peisong',orderItem)" v-if="orderItem.status == 0">
						配送完成
					</view>
					<view class="btn blue sm round" @click.stop="toNav('songda',orderItem)" v-if="orderItem.status == 1">
						已送达中心
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
				tabList: [{
						text: "待配货",
						type: 1
					}, {
						text: "配送中",
						type: 2
					},
					{
						text: "已完成",
						type: 3
					}, {
						text: "全部",
						type: 0
					}
				],
				tabSel: 0,
				orderList: [],
				page:1
			};
		},
		onReachBottom() { //上拉触底函数
			console.log("more")
			++this.page;
			this.selectTab("",this.tabSel,true)
		},
		onShow() {
			this.page = 1;
			this.selectTab("",this.tabSel)
		},
		methods: {
			selectTab(el, index,isMore) {
				this.tabSel = index;
				if(!isMore){
					this.page = 1;
				}
				
				let canType = ""
				
				if(index == 0 ){
					canType = "waitship"
				}
				if(index == 1 ){
					canType = "shiping"
				}
				if(index == 2 ){
					canType = "complete"
				}
				if(index == 3 ){
					canType = "all"
				}
				this.$getApi("/api/Merchant/orderList", {type:canType,page:this.page}, res => {
					console.log(res.data, "商品列表")
					
					if(isMore){
						this.orderList = [...this.orderList,...res.data.data];
					}else{
						this.orderList = res.data.data;
					}
				})
				
			},
			getOrder(state){
				console.log(state)
			},
			toNav(el,item){
				let this_ = this;
				if(el=="peisong"){
					uni.showModal({
						title:"确认配送完成",
						content:"是否确认配送完成",
						success(res) {
							if(res.confirm == true){
								this_.$getApi("/api/Merchant/orderStep", {out_trade_no:item.out_trade_no}, res => {
									// console.log(res.data, "商品列表")
									this_.$msg("配送完成")
									this_.selectTab("",this_.tabSel)
								})
							}else{
								console.log("down")
							}
						}
					})
				}
				if(el=="songda"){
					uni.showModal({
						title:"确认送达中心",
						content:"是否确认送达中心",
						success(res) {
							if(res.confirm == true){
								this_.$getApi("/api/Merchant/orderStep", {out_trade_no:item.out_trade_no}, res => {
									// console.log(res.data, "商品列表")
									this_.$msg("已送达中心")
									this_.selectTab("",this_.tabSel)
								})
							}else{
								console.log("down")
							}
						}
					})
				}
			}
		}
	}
</script>
<style>
	page{
		background-color: #f0f0f0;
	}
</style>
<style lang="scss" scoped>
	.btn_box{
		display: flex;
		justify-content: flex-end;
		padding: 20upx 0 0;
		.btn{
			padding: 10upx 0;
			width: 160upx;
			text-align: center;
			margin-left: 20upx;
			
		}
	}
	.tab_list_sy {
		display: flex;
		font-size: 32upx;
		justify-content: space-around;
		background-color: #fff;
		border-top: 2upx solid #eee;
		color: #999;

		.item {
			border-bottom: 6upx solid transparent;
			padding: 20upx 0 16upx;

			&.active {
				color: $uni-bl;
				border-bottom: 6upx solid $uni-bl;
			}
		}
	}

	.home_body {
		height: calc(100vh - 320upx);
		overflow-y: auto;
		padding: 20upx 26upx;
		background-color: #f0f0f0;
	}
	.order_num_info{
		text-align: right;
		padding: 16upx 0;
		font-size: 26upx;
		color: #666;
		.money{
			font-size: 30upx;
			margin-left: 10upx;
		}
	}
	.order_item_sy {
		padding: 26upx;
		font-size: 30upx;
		color: #666;
		margin-bottom: 20upx;
		background-color: #fff;
		border-radius: 20upx;

		&.pop {
			width: 640upx;
		}
		
		.o_title {
			display: flex;
			justify-content: space-between;
			border-bottom: 1upx solid #f0f0f0;
			padding-bottom: 10upx;
			margin-bottom: 10upx;

			.time_l {
				color: #333;
				&.blue{
					color:$uni-bl;
				}
				&.green{
					color:$uni-color-success;
				}
			}
			.time_2{
				color: #666;
				font-size: 28upx;
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

		.code_text {
			padding: 10upx 0;
			color: #999;
			.blue{
				color: $uni-red;
				margin-left: 20upx;
			}
			// border-bottom: 1upx solid #f0f0f0;
		}

		.btn_grow {
			display: flex;
			justify-content: flex-end;
			padding-top: 20upx;

			.btn {
				border: 1upx solid #999;
				background-color: #999;
				color: #fff;

				&.blue {
					background-color: #007AFF;
					border: 1upx solid #007AFF;
				}
			}
		}
	}
</style>
