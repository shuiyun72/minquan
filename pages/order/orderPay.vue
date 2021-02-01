<template>
	<view class="order_true">
		<view class="pay_money" v-if="fromType != '充值'">
			<view class="bg_img">
				<view class="name">
					应付 :
				</view>
				<view class="money">
					￥<text class="number">{{allM}}</text>
				</view>
			</view>
		</view>
		<view class="add_money" v-if="fromType == '充值'">
			<view class="chongzhi">
				<view class="name">
					充值金额
				</view>
				<view class="money">
					￥ <input type="text"  placeholder="请输入充值金额" class="chong_input" v-model="chongMoney" />
				</view>
			</view>
		</view>
		<view class="pey_type">
			<uni-list>
				<sy-list-item title="支付方式" :showArrow="false"></sy-list-item>
			</uni-list>
			<radio-group class="block" @change="RadioChange">
				<label class="cu-form-group" v-if="fromType != '充值'">
					<view class="item">
						<image style="width: 44rpx;height: 44rpx;" src="../../static/img/yue.png" mode=""></image><text class="margin-left-xs">余额支付</text>
					</view>
					<view>
						<radio :class="radio=='A'?'checked':''" :checked="radio=='A'?true:false" value="A" class="radio" :color="'#18B357'"></radio>
					</view>
				</label>
				<label class="cu-form-group">
					<view class="item">
						<image style="width: 44rpx;height: 44rpx;" src="../../static/img/weixin.png" mode=""></image><text class="margin-left-xs">微信支付</text>
					</view>
					<radio :class="radio=='B'?'checked':''" :checked="radio=='B'?true:false" value="B" class="radio" :color="'#18B357'"></radio>
				</label>
				<label class="cu-form-group">
					<view class="item">
						<image style="width: 44rpx;height: 44rpx;" src="../../static/img/zhifb.png" mode=""></image><text class="margin-left-xs">支付宝支付</text>
					</view>
					<view>
						<radio :class="radio=='C'?'checked':''" :checked="radio=='C'?true:false" value="C" class="radio" :color="'#18B357'"></radio>
					</view>
				</label>
				<label class="cu-form-group">
					<view class="item">
						<image style="width: 44rpx;height: 30rpx;" src="../../static/img/yinhk.png" mode=""></image><text class="margin-left-xs">银行卡支付</text>
					</view>
					<view>
						<radio :class="radio=='D'?'checked':''" :checked="radio=='D'?true:false" value="D" class="radio" :color="'#18B357'"></radio>
					</view>
				</label>

			</radio-group>
		</view>
		<view class="sub_top" v-if="fromType == '充值'">
			<button class="btn blue ms round" @click="toNav('pay')">立即充值</button>
		</view>
		<view class="bottom_btn_zu_sy" v-if="fromType != '充值'">
			<view class="btn1">
				<view>应付 :</view>
				<view class="red">
					￥<text class="big">{{allM}}</text>
				</view>
			</view>
			<view class="btn_b bl" @click="toNav('pay')">
				确认支付
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				radio: "A",
				fromType:"",
				chongMoney:"",
				allM:"",
				orderCode:"",
				userMoney:""
			};
		},
		onLoad(ph) {
			if(ph.fromType){
				this.fromType = ph.fromType;
				if(this.fromType == "充值"){
					this.radio = 'B';
					uni.setNavigationBarTitle({
						title:ph.fromType
					})
				}
			}
			if(this.fromType == "订单支付"){
				this.orderCode = ph.outTradeNo;
				this.allM = ph.totalFee
			}
			this.$getApi("/api/User/getInfo", {}, res => {
				console.log(res.data, "余额")
				this.userMoney = Number(res.data.money);
				// this.dataList = res.data;
			})
		},
		methods:{
			toNav(el){
				let payType = "";
				if(this.radio == "A"){
					payType = "balance"
				}
				if(this.radio == "B"){
					payType = "wechat"
				}
				if(this.radio == "C"){
					payType = "alipay"
				}
				if(this.radio == "D"){
					payType = "bank"
				}
				if(payType == "balance"){
					if(this.userMoney  < this.allM ){
						this.$msg("您的余额为"+this.userMoney+'元,请使用其他方式支付')
						return false;
					}
				}
				if(this.fromType == "订单支付"){
					let dataL = {
						out_trade_no:this.orderCode,
						pay_type:payType,
						order_type:"goods"
					}
					this.$getApi("/api/Order/pay", dataL, resCode => {
						if(this.radio == "A"){
							uni.reLaunch({
								url:"../home/msg?title=支付完成"
							})
						}
						if(this.radio == "B"){
							uni.navigateTo({
								url:"./eweima?code="+resCode.data.payinfo+"&titleName=微信支付&allM="+this.allM+"&outCode="+this.orderCode
							})
						}
						if(this.radio == "C"){
							uni.navigateTo({
								url:"./eweima?code="+resCode.data.payinfo+"&titleName=支付宝支付&allM="+this.allM+"&outCode="+this.orderCode
							})
						}
						if(this.radio == "D"){
							uni.navigateTo({
								url:"./eweima?codeName="+resCode.data.payinfo.name+"&codeNum="+resCode.data.payinfo.code+"&titleName=银行卡支付&allM="+this.allM+"&outCode="+this.orderCode
							})
						}
						
					})
					
				}
				if(this.fromType == "充值"){
					this.$getApi("/api/Order/createChargeOrder", {money:this.chongMoney}, resCode => {
						// this.hisList = [];
						console.log(resCode.data,"创建充值订单")
						let datal = {
							out_trade_no:resCode.data.out_trade_no,
							pay_type:payType,
							order_type:"charge"
						}
						this.$getApi("/api/Order/pay", datal, res => {
							// this.hisList = [];
							console.log(res.data,"充值")
							if(this.radio == "B"){
								
								uni.navigateTo({
									url:"./eweima?chongzhi=chong&code="+res.data.payinfo+"&titleName=微信支付&allM="+this.chongMoney+"&outCode="+resCode.data.out_trade_no
								})
							}
							if(this.radio == "C"){
								uni.navigateTo({
									url:"./eweima?chongzhi=chong&code="+res.data.payinfo+"&titleName=支付宝支付&allM="+this.chongMoney+"&outCode="+resCode.data.out_trade_no
								})
							}
							if(this.radio == "D"){
								uni.navigateTo({
									url:"./eweima?chongzhi=chong&codeName="+res.data.payinfo.name+"&codeNum="+res.data.payinfo.code+"&titleName=银行卡支付&allM="+this.chongMoney+"&outCode="+resCode.data.out_trade_no
								})
							}
						})
					})
				}
				
					
				
			},
			RadioChange(el){
				console.log(el.detail.value)
				this.radio = el.detail.value
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
	.order_true {
		min-height: 100vh;
		.sub_top {
			margin: 200upx 26upx 0;
		}
		.bottom_btn_zu_sy{
			display: flex;
			position:fixed;
			bottom: 0;
			left: 0;
			width: 750upx;
			align-items: center;
			background-color: #fff;
			.btn1{
				flex:1;
				display: inline-flex;
				padding-left: 26upx;
				align-items: center;
				color: #666;
				.big{
					font-size: 36upx;
				}
			}
			.btn_b{
				width: 230upx;
				color: #fff;
				text-align: center;
				font-size: 34upx;
				padding: 30upx 0;
				&.or{
					background-color: $uni-or;
				}
				&.bl{
					background-color: $uni-bl;
				}
			}
		}
		.pay_money {
			background-color: #fff;
			padding: 20upx 26upx;
			margin-bottom: 20upx;
			.bg_img {
				background: url(../../static/img/zfbg.png) no-repeat center center;
				background-size: 698upx 260upx;
				color: #fff;
				text-align: center;
				padding: 60upx 0 0;
				height: 260upx;
				box-sizing: border-box;
				.name{
					font-size: 36upx;
					margin-bottom: 12upx;
				}
				.money{
					position:relative;
					left: -16upx;
					.number{
						font-size: 46upx;
						margin-left: 6upx;
						// font-weight: bold;
					}
				}
				
			}
		}
		.add_money{
			background-color: #fff;
			padding: 20upx 26upx;
			margin-bottom: 20upx;
			.chongzhi{
				.name{
					font-size: 32upx;
					color: #999;
				}
				.money{
					font-size: 32upx;
					padding: 40upx 0;
					display: flex;
					align-items: center;
					color: #999;
					.chong_input{
						padding-left: 20upx;
						color: #333;
					}
				}
			}
		}
		.cu-form-group {
			display: flex;
			justify-content: space-between;
			padding: 16upx 26upx;
			background-color: #fff;
			border-top: 1upx solid #f0f0f0;

			.item {
				display: inline-flex;
				align-items: center;

				.margin-left-xs {
					margin-left: 10upx;
					font-size: 28upx;
					color: #666;
				}
			}

			.radio {
				transform: scale(.8);
			}
		}
	}
</style>
