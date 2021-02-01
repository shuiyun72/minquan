<template>
	<view class="order_detail">
		<view class="order_header">
			<view class="sel_address">
				<image src="../../static/img/dizhi.png" class="add_img" mode=""></image>
				<view class="user_info">
					<view class="pt1">
						<view class="name">
							{{orderItem.name}}
						</view>
						<view class="phone">
							{{orderItem.tel}}
						</view>
					</view>
					<view class="pt2">
						{{orderItem.address}}
					</view>
				</view>
				<!-- <view class="iconfont iconjiantou"></view> -->
			</view>
<!-- 			<view class="part3">
				<view class="btn del round" v-if="orderItem.status == -1" @click="quxiaoOrder">
					取消订单
				</view>
				<view class="btn blue round" v-if="orderItem.status == -1" @click="quzhifu">
					去支付
				</view>
				<view class="btn blue round" v-if="orderItem.status == 1 || orderItem.status == 6 || orderItem.status == 8" @click="zailaiOrder">
					再来一单
				</view>
				<view class="btn del round" v-if="orderItem.status == 2 || orderItem.status == 3  "  @click="zailaiOrder">
					再来一单
				</view>
				<view  @click="lianxiKF" class="btn del round">
					联系客服
				</view>
			</view> -->
		</view>
		<!-- <view class="user_msg">
			<view class="row_c">
				<view class="attr">
					期望时间 :
				</view>
				<view class="value">
					{{orderItem.receive_time}}
				</view>
			</view>
			<view class="row_c">
				<view class="attr">
					收件人 :
				</view>
				<view class="value">
					{{orderItem.user_name}}
				</view>
			</view>
			<view class="row_c">
				<view class="attr">
					收件人电话 :
				</view>
				<view class="value">
					{{orderItem.user_phone}}
				</view>
			</view>
			<view class="row_c">
				<view class="attr">
					收货地址 :
				</view>
				<view class="value" v-if="orderItem.user_address">
					{{orderItem.user_address.split("undefined")[0]}}
				</view>
			</view>
		</view> -->
		<view class="order_msg">
			<view class="title">
				<view class="left">
					商品
				</view>
				<view class="num">
					{{orderItem.total_num}}件
				</view>
			</view>
			<view class="i_item" v-for="item in orderItem.goods">
				<view class="left">
					<!-- <image :src="item.goods_thumb" class="img_m" mode=""></image> -->
					<view class="info_cc">
						<view class="in1 shengluehao">
							{{item.name}}
						</view>
						<view class="in2">
							x <text>{{item.price}}</text> 
						</view>
					</view>
				</view>
				<view class="right">
					x{{item.number}}
				</view>
			</view>
		</view>
		<view class="user_msg">
			<view class="title">
				<view class="left">
					订单明细
				</view>
				<view class="num"></view>
			</view>
			<view class="row_c">
				<view class="attr">
					订单总价 :
				</view>
				<view class="value">
					{{orderItem.real_fee}}
				</view>
			</view>
			<view class="row_c" >
				<view class="attr">
					配送费 :
				</view>
				<view class="value">
					{{orderItem.postage}}
				</view>
			</view>
			<view class="row_c">
				<view class="attr">
					实付 :
				</view>
				<view class="value">
					{{(Number(orderItem.real_fee) + Number(orderItem.postage))}}
				</view>
			</view>
		</view>
		<view class="user_msg">
			<view class="title">
				<view class="left">
					订单信息
				</view>
				<view class="num"></view>
			</view>
			<view class="row_c">
				<view class="attr">
					订单编号 :
				</view>
				<view class="value">
					{{orderItem.out_trade_no}}
				</view>
			</view>
			<view >
				<view class="row_c">
					<view class="attr">
						支付方式 :
					</view>
					<view class="value" v-if="orderItem.status > 1">
						{{clacPayType(orderItem.pay_type)}}
					</view>
					<view class="value" v-if="orderItem.status <= 1">
						--
					</view>
				</view>
			</view>
			<view class="row_c">
				<view class="attr">
					备注信息 :
				</view>
				<view class="value">
					{{orderItem.remark}}
				</view>
			</view>
			<view class="row_c">
				<view class="attr">
					下单时间 :
				</view>
				<view class="value">
					{{orderItem.createtime}}
				</view>
			</view>
			<view v-if="orderItem.status > 1">
				<view class="row_c">
					<view class="attr">
						确认时间 :
					</view>
					<view class="value">
						{{orderItem.pay_time}}
					</view>
				</view>
			</view>
			<view v-if="orderItem.status > 2">
				<view class="row_c">
					<view class="attr">
						完成时间 :
					</view>
					<view class="value">
						{{orderItem.completetime}}
					</view>
				</view>
			</view>
			
			<!-- <view class="row_c" v-if="orderState==2">
				<view class="attr">
					取消时间:
				</view>
				<view class="value">
					2020-10-21 17:08
				</view>
			</view> -->
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
				orderState:1,
				orderItem:{},
				peisongfei:0,
				xitongMsg:[],
				noCode:0,
				timerL:""
			};
		},
		onLoad(ph) {
			this.noCode = ph.noCode;
			this.getDetail(ph.noCode);
		},
		computed:{
			...mapState(["httpp", "SystemInfo", "userInfo", "shopCar", "address"]),
		},
		watch:{

		},
		methods:{
			clacPayType(el){
				if(el == 'wechat'){
					return "微信支付"
				}
				if(el == 'alipay'){
					return "支付宝支付"
				}
				if(el == 'bank'){
					return "银行卡支付"
				}
				if(el == 'balance'){
					return "余额支付"
				}
			},
			getDetail(code){
				this.$getApi("/api/Order/detail",{out_trade_no:code}, res => {
					console.log(res.data,"订单详情")
					this.orderItem = res.data;
				})
			},
			quzhifu(){
				uni.navigateTo({
					url:'./orderPay?orderId='+this.orderId
				})
			},
			quxiaoOrder(){
				let this_ = this;
				uni.showModal({
				    title: '取消订单',
				    content: '是否确认取消订单',
				    success: function (res) {
				        if (res.confirm) {
				            this_.$getApi("/App/Goods/cancelOrder",{id:this_.orderId}, res => {
				            	console.log(res.data,"订单取消")
								this_.$msg("订单已取消")
								setTimeout(()=>{
									uni.navigateBack({
										delta:1
									})
								},500)
				            })
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			},
			lianxiKF(){
				let phoneL  = _.filter(this.xitongMsg,item=>{
					return item.remark.indexOf("客服电话") != -1
				})[0].value;
				console.log(phoneL)
				uni.makePhoneCall({
					phoneNumber: phoneL
				});	
			},
			zailaiOrder(){
				uni.navigateTo({
					url:"./orderTrue?orderId="+this.orderId
				})
			},
			getDateL(date){
				return this.$getDate(date,'s-s-s s:s:s',"c")
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
.order_detail{
	background-color: #f0f0f0;
	font-size: 28upx;
	padding-bottom: 40upx;
	.sel_address {
		display: flex;
		align-items: center;
		padding: 10upx 62upx 10upx 32upx;
		background-color: #fff;
		.add_img {
			width: 54upx;
			height: 54upx;
			flex-shrink: 0;
		}
	
		.title {
			font-size: 34upx;
			color: #666;
			flex: 1;
			padding-left: 20upx;
		}
	
		.user_info {
			flex: 1;
			padding-left: 20upx;
			color: #666;
	
			.pt1 {
				display: flex;
				align-items: center;
				margin-bottom: 6upx;
	
				.name {
					font-size: 32upx;
					font-weight: bold;
				}
	
				.phone {
					font-size: 32upx;
					margin-left: 30upx;
				}
			}
	
			.pt2 {
				font-size: 28upx;
				text-align: left;
			}
		}
	
		.iconjiantou {
			color: #ccc;
			width: 12upx;
			flex-shrink: 0;
			font-size: 44upx;
		}
	}
	.order_msg{
		background-color: #fff;
		margin-top: 20upx;
		padding: 20upx 26upx;
		.title{
			display: flex;
			justify-content: space-between;
			font-size: 32upx;
			color: #333;
			margin-bottom: 10upx;
		}
		.i_item{
			display: flex;
			justify-content: space-between;
			align-items: center;
			color: #666;
			padding: 20upx 0;
			.left{
				display: inline-flex;
				align-items: center;
				.img_m{
					width: 90upx;
					height: 90upx;
				}
				.info_cc{
					margin-left: 20upx;
					display: inline-flex;
					flex-direction: column;
					justify-content: space-between;
					.in1{
						width: 540upx;
						margin-bottom: 10upx;
					}
				}
			}
		}
	}
	.user_msg{
		background-color: #fff;
		margin-top: 20upx;
		padding: 20upx 26upx;
		.title{
			display: flex;
			justify-content: space-between;
			font-size: 32upx;
			color: #333;
			padding-bottom: 26upx;
		}
		.row_c{
			display: flex;
			font-size: 28upx;
			padding-bottom: 20upx;
			color: #666;
			.attr{
				width: 160upx;
				flex-shrink: 0;
			}
			.value{
				
			}
		}
	}
	.order_header{
		padding: 20upx 0 10upx;
		text-align: center;
		// background: url(../../static/img/ts2.png) no-repeat center bottom;
		background-size: 750upx auto;
		.part1{
			.d_t1{
				font-size: 34upx;
				font-weight: bold;
				color: #666;
				letter-spacing:1px;
			}
			.d_t2{
				color: $uni-or;
				font-size: 32upx;
				margin-left: 10upx;
			}
		}
		.d_t3{
			font-size: 30upx;
			font-weight: bold;
			color: #666;
			letter-spacing:1px;
			padding: 30upx 0;
		}
		.part2{
			font-size: 30upx;
			color: #999;
			padding: 10upx 0 10upx;
		}
		.part3{
			display: flex;
			justify-content: center;
			padding: 20upx 26upx;
			.btn{
				width: 200upx;
				padding: 12upx 0 14upx;
				&+.btn{
					margin-left: 30upx;
				}
				&.del{
					border: 1upx solid #f0f0f0;
					color: #666;
				}
			}
		}
	}
}
</style>
