<template>
	<view>
		<view class="erweima" v-if="isFirstPage">
			<view class="weapp_evm">
				<view class="title">
					平台收款二维码
				</view>
				<view class="pd2">
					<view v-if="evmImg">
						<image :src="httpp + evmImg" class="evm" ></image>
						<view class="te_evm">
							扫描二维码付款
						</view>
					</view>
					
					<view class="code_yihang" v-if="codeNum">
						<view class="code_n">
							{{codeName}}
						</view>
						<view class="code_n">
							{{codeNum}}					
						</view>
					</view>
					
				</view>
				<view class="m_info">
					扫描二维码支付订单,上传支付完成凭证,审核通过,完成订单
				</view>
			</view>
			<view class="sub_top_absolute">
				<button class="btn blue ms round" @click="next">上传凭证</button>
			</view>
		</view>

		<view class="pingcheng" v-if="!isFirstPage">
			<view class="money_info">
				<view class="p1">
					总金额 : <text class="blue">{{payMoney}}</text>
				</view>
				<view class="text_sm">
					请确保截图中含有支付金额、支付结果等信息,最多可上传2张截图
				</view>
			</view>
			<view class="photo_list">
				<view class="photo_btn pinput" @click="upImg('shenfen')">
					<image src="../../static/img/tianjtp.png" class="img_photp" mode="widthFix"></image>
					<view class="text">
						上传凭证
					</view>
				</view>
				<view class="photo_btn" v-for="(item,index) in imgList2">
					<image :src="item" class="img_photp" mode="widthFix"></image>
					<view class="iconfont iconyduicuowushixin" @click="delList('shenfen',index)"></view>
				</view>
			</view>
			<view class="sub_top_absolute">
				<button class="btn blue ms round" @click="nextSubmit">提交凭证</button>
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
				evmImg: "",
				allM: "",
				imgList2:[],
				imgList2Url:[],
				codeNum:"",
				codeName:"",
				isFirstPage: true,
				outCode:"",
				payMoney:"",
				isChong:false
			};
		},
		onLoad(ph) {
			if (ph.titleName) {
				uni.setNavigationBarTitle({
					title: ph.titleName
				})
				this.evmImg = ph.code;
				this.codeNum = ph.codeNum;
				this.codeName = ph.codeName;
				this.allM = ph.allM;
			}
			if(ph.chongzhi == 'chong'){
				this.isChong = true
			}else{
				this.isChong = false
			}
			this.outCode = ph.outCode;
			if(ph.money){
				this.payMoney = ph.money
			}
			if(ph.allM){
				this.payMoney = ph.allM
			}
		},
		computed: {
			...mapState(["httpp", "SystemInfo", "userInfo", "shopCar", "location"]),
		},
		methods: {
			submitNext() {
				// uni.reLaunch({
				// 	url:"../home/msg?title=付款成功"
				// })
			},
			next() {
				this.isFirstPage = false;
			},
			nextSubmit() {
				let dataL = {
					out_trade_no:this.outCode,
					images:this.imgList2Url.toString(),
					order_type:this.isChong ? "charge" : "goods"
				}
				this.$getApi("/api/Order/upPaidImages", dataL, res => {
					console.log(res.data,"提交支付凭证")
					uni.reLaunch({
						url:"../home/msg?title=凭证提交成功"
					})
				})
			},
			upImg(el) {
				if(this.imgList2.length >= 2){
					this.$msg("最多上传两张")
					return false
				}
				let this_ = this;
				uni.chooseImage({
					count: 1,
					sizeType: ['copressed'],
					success(res) {
						//因为有一张图片， 输出下标[0]， 直接输出地址
						let imgFiles = res.tempFilePaths[0]
						uni.uploadFile({
							url: this_.httpp+'/api/Common/upload', //仅为示例，非真实的接口地址
							filePath: imgFiles,
							name: 'file',
							formData: {
								'token': this_.userInfo.token
							},
							success: (uploadFileRes) => {
								let imgRest = JSON.parse(uploadFileRes.data)
								console.log(imgRest.data.url)
								this_.imgList2.push(imgFiles);
								this_.imgList2Url.push(imgRest.data.url);
							}
						});
								
						
					},
					fail(err){
						this_.$msg("不支持您上传的图片格式")
					}
				})
				
			},
			delList(el,index){
				this.imgList2.splice(index,1)
				this.imgList2Url.splice(index,1)	
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f0f0f0;
	}

	.pingcheng {
		.money_info{
			background-color: #fff;
			padding: 20upx 26upx;
			.p1{
				font-size: 32upx;
				color: #666;
				.blue{
					padding-left: 20upx;
				}
			}
			.text_sm{
				color: #999;
				padding: 10upx 0;
			}
		}
		.photo_list {
			display: flex;
			flex-wrap: wrap;
			padding: 20upx 0upx 20upx 26upx;

			.photo_btn {
				width: 230upx;
				// height: 160upx;
				margin: 0 20upx 20upx 0;
				position: relative;
				&.pinput{
					width: 200upx;
					height: 200upx;
					.text {
						width: 200upx;
						position: absolute;
						text-align: center;
						top: 130upx;
						color: #999;
						transform: scale(.9);
					}
				}
				

				.iconyduicuowushixin {
					position: absolute;
					top: 0;
					right: 0;
					color: $uni-bl;
					overflow: hidden;
					border-radius: 50%;
					background-color: #fff;
				}

				.img_photp {
					width: 100%;
					
				}
			}
		}
	}
	.sub_top_absolute {
		margin-top: 240upx;
		
		position:absolute;
		width: 600upx;
		bottom:60upx;
		left: 50%;
		margin-left: -300upx;
	}
	.erweima {
		

		padding: 40upx;

		.weapp_evm {
			.title {
				background-color: $uni-bl;
				color: #fff;
				padding: 20upx 40upx;
				border-radius: 20upx 20upx 0 0;
				font-size: 32upx;
			}

			.pd2 {
				text-align: center;
				background-color: #fff;
				padding: 60upx 0 40upx;
				border-radius: 0 0 20upx 20upx;
				.code_yihang{
					font-size: 32upx;
					color: $uni-bl;
					padding: 20upx 0 100upx;
					.code_n{
						line-height: 60upx;
					}
				}
				.evm {
					width: 360upx;
					height: 360upx;
				}

				.te_evm {
					color: $uni-bl;
					font-size: 32upx;
					padding-top: 20upx;
				}
			}

			.m_info {
				padding: 10upx 100upx;
				color: #666;
				text-align: center;
			}
		}
	}
</style>
