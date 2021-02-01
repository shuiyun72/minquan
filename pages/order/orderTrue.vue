<template>
	<view class="order_true">
		<view class="sel_address">
			<image src="../../static/img/dizhi.png" class="add_img" mode=""></image>
			<view class="title" v-if="!address" @click="selItem('dizhi')">
				请选择地址
			</view>
			<view class="user_info" v-if="address" @click="selItem('dizhi')">
				<view class="pt1">
					<view class="name">
						{{address.name}}
					</view>
					<view class="phone">
						{{address.tel}}
					</view>
				</view>
				<view class="pt2">
					{{address.receive_address}}{{address.address?address.address:''}}
				</view>
			</view>
			<view class="iconfont iconjiantou"></view>
		</view>
		<view class="order_msg">
			<view class="title">
				<view class="left">
					商品
				</view>
				<view class="number">
					{{allNum}}件
				</view>
			</view>
			<view class="i_item" v-for="item in orList">
				<view class="left">
					<image :src="httpp+ item.logo" class="img_m" mode=""></image>
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
			<view class="last_calc">
				共{{allNum}}件商品 小计￥:<text class="number">{{allMoney}}</text>
			</view>
		</view>
		<view class="h20"></view>
		<uni-list>
			<sy-list-item title="备注" note="" @click="selItem('beizhu')" :showArrow="false">
				<template v-slot:right="">
				
						<input type="text" class="beizhu_input_text" v-model="beizhuC" placeholder="请填写备注"/>
					
				</template>
			</sy-list-item>
		</uni-list>
		<view class="h20">
			
		</view>
		<view class="">
			<uni-list>
				<sy-list-item title="支付方式" :showArrow="false"></sy-list-item>
			</uni-list>
			<radio-group class="block" @change="RadioChange">
				<label class="cu-form-group">
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
		<view class="bottom_btn_zu_sy">
			<view class="btn1">
				<view>应付 :</view>
				<view class="red">
					￥<text class="big">{{allMoney}}</text>
				</view>
			</view>
			<view class="btn_b bl" @click="toNav('pay')">
				去支付
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
				beizhuC:"",
				radio: "A",
				money:23.88,
				peisongM:0,
				timeText:"",
				orList:[],
				userMoney:""
			};
		},
		computed:{
			...mapState(["httpp", "SystemInfo", "userInfo", "shopCar", "address"]),
			allMoney(){
				let aM = 0
				_.map(this.orList,item=>{
					aM += (Number(item.price)*1000) *  item.number;
				})
				return aM/1000;
			},
			allNum(){
				let aM = 0
				_.map(this.orList,item=>{
					aM +=  item.number;
				})
				return aM;
			}
		},
		onBackPress(e){
		  console.log("监听返回按钮事件",e);
		  uni.switchTab({
		  	url:"../home/home"
		  })
		  return true;
		},
		onShow() {
			console.log(this.address,"地址151")
			this.$getApi("/api/Cart/list", {}, res => {
				console.log(res.data, "购物车列表")
				
				// this.dataList = res.data;
			})
			this.$getApi("/api/User/getInfo", {}, res => {
				console.log(res.data, "余额")
				this.userMoney = Number(res.data.money);
				// this.dataList = res.data;
			})
			
		},
		onLoad(ph) {
			if(ph.payFootList){
				console.log(ph.payFootList)
				this.orList = JSON.parse(ph.payFootList)
			}
			if(ph.footId){
				this.orList = _.filter(this.shopCar,item=>{
					return item.id == ph.footId
				})
			}
			if(ph.outTradeNo){
				this.$getApi("/api/Order/again", {out_trade_no:ph.outTradeNo}, res => {
					console.log(res.data, "再来一单")
					this.orList = res.data.goods;
					this.beizhuC = res.data.remark;
					let itemAddress = {
						address: res.data.address,
						area: "民权县",
						city: "商丘市",
						detail: res.data.address,
						id:  res.data.address_id,
						lat: res.data.lat,
						lng: res.data.lng,
						name: res.data.name,
						province: "河南省",
						tel: res.data.tel
					}
					this.$store.commit("setAddress",itemAddress)
					// this.dataList = res.data;
				})
			}
			
		},
		mounted() {
			this.$getApi("/api/Address/list", {}, res => {
				console.log(res.data, "地址列表")
				_.map(res.data,item=>{
					if(item.is_default == "1"){
						console.log(item)
						this.$store.commit("setAddress",item)
					}
				})
				// this.dataList = res.data;
			})
		},
		methods:{
			...mapMutations(["jiaCar", "jianCar"]),
			isDikouC(){	
				if(this.isDikou){
					this.isDikou = false
				}else{
					this.isDikou = true
				}
			},
			selItem(el){
				// 'dizhi'
				console.log(el)
				if(el == 'dizhi'){
					uni.navigateTo({
						url:"../mine/address?title=地址选择"
					})
				}
				if(el == 'beizu'){
					// this.$refs.songTime.open()
				}
			},
			RadioChange(el){
				this.radio = el.detail.value;
			},
			toNav(el){
				console.log(this.address)
				let footId = []
				_.map(this.orList,item=>{
					footId.push(item.id)
				})
				if(!this.address.id){
					this.$msg("请选择地址")
					return false;
				}
				let data1 = {
					address_id:this.address.id,
					goods_ids:footId.toString(),
					remark:this.beizhuC
					// money:this.allMoney
				}
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
					if(this.userMoney  < this.allMoney ){
						this.$msg("您的余额为"+this.userMoney+'元,请使用其他方式支付')
						return false;
					}
				}
				this.$getApi("/api/Order/createGoodsOrder", data1, res => {
					console.log(res.data, "创建商品订单")
					_.map(this.orList,item=>{
						item.number = 0;
						this.jianCar(item)
					})
					
					let data2 = {
						out_trade_no:res.data.out_trade_no,
						pay_type:payType,
						order_type:"goods"
					}
					this.$getApi("/api/Order/pay", data2, resPay => {
						console.log(resPay.data, "支付")
						if(this.radio == "A"){
							uni.reLaunch({
								url:"../home/msg?title=支付完成"
							})
						}
						if(this.radio == "B"){
							uni.navigateTo({
								url:"./eweima?code="+resPay.data.payinfo+"&titleName=微信支付&allM"+this.allMoney+"&outCode="+res.data.out_trade_no+"&money="+resPay.data.total_fee
							})
						}
						if(this.radio == "C"){
							uni.navigateTo({
								url:"./eweima?code="+resPay.data.payinfo+"&titleName=支付宝支付&allM"+this.allMoney+"&outCode="+res.data.out_trade_no+"&money="+resPay.data.total_fee
							})
						}
						if(this.radio == "D"){
							uni.navigateTo({
								url:"./eweima?codeName="+resPay.data.payinfo.name+"&codeNum="+resPay.data.payinfo.code+"&titleName=银行卡支付&allM"+this.allMoney+"&outCode="+res.data.out_trade_no+"&money="+resPay.data.total_fee
							})
						}
					})
					// this.dataList = res.data;
				})
			},
		}
	}
</script>
<style>
	page{
		background-color: #f0f0f0;
	}
</style>
<style lang="scss" scoped>
.order_true{
	padding-bottom: 200upx;
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
	
			}
		}
	
		.iconjiantou {
			color: #ccc;
			width: 12upx;
			flex-shrink: 0;
			font-size: 44upx;
		}
	}
	.h120{
		height: 120upx;
		background-color: #f0f0f0;
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
	.peisong_timje{
		background-color: $uni-bl;
		color: #fff;
		padding: 0 20upx 3upx;
		border-radius: 20upx;
	}
	.dikou{
		display: flex;
		color: #666;
		background-color: #f0f0f0;
		padding: 10upx 26upx;
		.iconyduizhengqueshixin{
			color: $uni-bl;
			margin-right: 10upx;
		}
		.iconyk_yuanquan{
			color: #666;
			margin-right: 10upx;
		}
	}
	.list_youhuiquan{
		color: #666;
		font-size: 30upx;
	}
	.beizhu_input_text{
		text-align: right;
		width: 100%;
		font-size: 28upx;
	}
	.tishi{
		background-color: $uni-or;
		padding: 10upx 26upx;
		color: #fff;
	}
	.order_msg{
		background-color: #fff;
		margin-top: 20upx;
		padding: 20upx 26upx;
		.last_calc{
			text-align: right;
			color: #666;
			.number{
				font-size: 32upx;
			}
		}
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
