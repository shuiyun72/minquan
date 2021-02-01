<template>
	<view class="order">
		<uni-nav-bar color="#333333" background-color="#ffffff" :status-bar="true"  :title="barTitle" left-icon="arrowleft"
		 @clickLeft="back" />
		<view class="tab_list_sy">
			<view class="item" v-for="(item,index) in tabList" :class="{'active':index == tabSel}" @click="selectTab(item,index)">{{item.text}}</view>
		</view>
		<view class="order_list">
			<view class="order_box" v-for="parent in orderList" @click="toDetail(parent)">
				<view class="title_c">
					<view class="left" v-if="parent.status == 0">
						已取消
					</view>
					<view class="left or" v-if="parent.status == 1">
						等待支付
					</view>
					<view class="left blue" v-if="parent.status == 2">
						审核中
					</view>
					<view class="left blue2" v-if="parent.status == 3">
						发货中
					</view>
					<view class="left" v-if="parent.status == 4">
						待评价
					</view>
					<view class="left" v-if="parent.status == 5">
						已完成
					</view>
					
					<view class="right">
						{{parent.ftime}}
					</view>
				</view>
				<view class="o_item" v-for="item in parent.goods">
					<view class="left">
						<image :src="httpp + item.logo" class="img_c" mode=""></image>
						<view class="title shengluehao">
							{{item.name}}
						</view>
					</view>
					<view class="right">
						x{{item.number}}
					</view>
				</view>
				<view class="last_money">
					<view class="left">
						...
					</view>
					<view class="right">
						<view class="sm">
							共{{parent.total_num}}件 实付 :
						</view>
						<view class="money">
							<text class="red">{{parent.total_fee}}</text> 元
						</view>
					</view>
				</view>
				<view class="btn_box" v-if="parent.status == '1'">
					<view class="btn blue_n sm round" @click.stop="toNav('quxiao',parent)">
						取消订单
					</view>
					<view class="btn blue sm round" @click.stop="toNav('quzhifu',parent)">
						去支付
					</view>
				</view>
				<view class="btn_box" v-if="parent.status == '2'">
					<view class="btn blue sm round" @click.stop="toNav('zailai',parent)">
						再来一单
					</view>
				</view>
				<view class="btn_box" v-if="parent.status == '3'">
					<view class="btn blue_n sm round" @click.stop="toNav('kefu')">
						联系客服
					</view>
					<view class="btn blue sm round" @click.stop="toNav('zailai',parent)">
						再来一单
					</view>
				</view>
				<view class="btn_box" v-if="parent.status == '4'">
					<view class="btn blue_n sm round" @click.stop="toNav('zailai',parent)">
						再来一单
					</view>
					<view class="btn blue sm round" @click.stop="toNav('pingjia',parent)">
						去评价
					</view>
				</view>
				<view class="btn_box" v-if="parent.status == '5'">
					<view class="btn blue sm round" @click.stop="toNav('zailai',parent)">
						再来一单
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import _ from "../../until/lodash";
	export default {
		data() {
			return {
				barTitle:"订单",
				orderList:[],
				tabSel: 1,
				tabList: [{
						text: "全部",
						type: 0
					}, {
						text: "待付款",
						type: 1
					}, {
						text: "待收货",
						type: 2
					},
					{
						text: "待评价",
						type: 3
					}
				],
				page:1
			};
		},
		computed:{
			httpp(){
				return this.$store.state.httpp
			}
		},
		onLoad(ph) {
			this.tabSel = ph.ins;
			
			this.selectTab("",ph.ins)
		},
		onReachBottom() { //上拉触底函数
			console.log("more")
			++this.page;
			this.selectTab("",this.tabSel,true)
		},
		methods: {
			back(){
				uni.switchTab({
					url:"../home/home"
				})
			},
			toNav(el,item){
				if(el == 'quzhifu'){
					uni.navigateTo({
						url:'./orderPay?fromType=订单支付&outTradeNo='+item.out_trade_no+'&totalFee='+item.total_fee
					})
				}
				if(el == 'zailai'){
					uni.navigateTo({
						url:'./orderTrue?fromType=再来一单&outTradeNo='+item.out_trade_no+'&totalFee='+item.total_fee
					})
				}
				if(el == 'pingjia'){
					uni.navigateTo({
						url:'./pingjia?fromType=评价商品&outTradeNo='+item.out_trade_no+'&totalFee='+item.total_fee
					})
				}
				if(el == 'quxiao'){
					let this_ = this;
					uni.showModal({
						title: '取消订单',
						content: '是否确认取消订单',
						confirmColor:"#18B357",
						success: function (res) {
							if (res.confirm) {
								this_.$getApi("/api/Order/cancel", {out_trade_no:item.out_trade_no}, res => {
									this_.$msg('订单取消成功')
									this_.selectTab("",this_.tabSel)
								})
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
					});
					
				}
				
				
			},
			toDetail(items){
				uni.navigateTo({
					url:"./orderDetail?noCode="+items.out_trade_no
				})
			},
			selectTab(el, index,isMore) {
				this.tabSel = index;
				if(!isMore){
					this.page = 1;
				}
				
				let canType = ""
				if(index == 0 ){
					canType = "all"
				}
				if(index == 1 ){
					canType = "waitpay"
				}
				if(index == 2 ){
					canType = "waitreceive"
				}
				if(index == 3 ){
					canType = "waitcomment"
				}
				this.$getApi("/api/Order/list", {type:canType,page:this.page}, res => {
					console.log(res.data, "商品列表")
					
					if(isMore){
						this.orderList = [...this.orderList,...res.data.data];
					}else{
						this.orderList = res.data.data;
					}
				})
				
			},
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #f0f0f0;
	}
	.order_list{
		padding: 0upx 26upx 20upx;
		.order_box{
			background-color: #fff;
			padding: 20upx;
			border-radius: 16upx;
			margin-bottom: 20upx;
			.title_c{
				display: flex;
				justify-content: space-between;
				align-items: baseline;
				.left{
					font-weight: bold;
					font-size: 32upx;
					color: #666;
					&.or{
						color: $uni-or;
					}
					&.blue2{
						color: #72C9CB;
					}
				}
				.right{
					color: #999;
					font-size: 28upx;
				}
			}
			.o_item{
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 16upx 0;
				.left{
					display: inline-flex;
					align-items: center;
					.img_c{
						width: 80upx;
						height: 80upx;
					}
					.title{
						margin-left: 20upx;
						width: 520upx;
						color: #333;
					}
				}
			}
			.last_money{
				display: flex;
				justify-content: space-between;
				.left{
					color: #999;
				}
				.right{
					display: inline-flex;
					.sm{
						color: #999;
						transform: scale(.8);
						position: relative;
						top:4upx;
					}
				}
			}
			.btn_box{
				display: flex;
				justify-content: flex-end;
				padding: 20upx 0 0;
				.btn{
					padding: 10upx 0;
					width: 160upx;
					text-align: center;
					margin-left: 20upx;
					&+.btn{
						
					}
				}
			}
		}
	}
	.tab_list_sy {
		display: flex;
		font-size: 32upx;
		justify-content: space-around;
		background-color: #fff;
		margin-bottom: 26upx;
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
</style>
