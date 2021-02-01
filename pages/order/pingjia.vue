<template>
	<view class="appraise">
		<view class="raise_foot" v-for="(item,indexCC) in allList">
			<view class="i_item">
				<view class="left">
					<image :src="httpp+ item.logo" class="img_m" mode=""></image>
					<view class="info_cc">
						<view class="in1 shengluehao">
							{{item.name}}
						</view>
					</view>
				</view>
				<view class="right">
					x{{item.number}}
				</view>
			</view>
			<view class="pt_p1">
				<view class="t3">评价</view>
				<view class="rate_bg_sy">
					<view class="rate_i_sy">
						<view class="rate_i iconfont iconxingxing yellow" v-for="ra in calcNum(item.grade)" @click="selStat(ra,indexCC)"></view>
						<view class="rate_i iconfont iconxingxing" v-for="ra in calcNum(5 - item.grade)"  @click="selStat(item.grade+ra,indexCC)"></view>
					</view>
					<!-- <view class="right">{{ star }}.0</view> -->
				</view>
			</view>
			<view class="bgff">
				
			
			<view class="">
				<textarea v-model="item.content" class="textarea_t" placeholder="请写下对订单的评价" />
			</view>
			<view class="p26">
				<view class="photo_list_sy">
					<view class="item" @click="upImg(indexCC)">
						<image src="../../static/img/tianjtp.png" class="img_f" mode=""></image>
						<view class="text_po">
							添加图片
						</view>
					</view>
					<view v-for="itemImg in item.imgList">
						<view class="item_l" :style="'background-image: url('+httpp+itemImg+');'">
					</view>
					</view>
				</view>
			</view>
			</view>
			
		</view>
		<view class="bh80">
			
		</view>
		<view class="bg_btn_sub_sy"><view class="btn" @click="nativeTo">提交</view></view>
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
				allList:[],
				outTradeNo:""
			}
		},
		computed:{
			...mapState(["httpp", "SystemInfo", "userInfo", "shopCar", "address"]),
		},
		onLoad(ph) {
			if(ph.outTradeNo){
				this.outTradeNo = ph.outTradeNo;
				this.$getApi("/api/Order/detail", {out_trade_no:ph.outTradeNo}, res => {
					console.log(res.data, "订单详情")
					let allList = [];
					// res.data.goods
					// let cccList = [
					// 	{image:res.data.goods[0].image,name:"xsw"},
					// 	{image:res.data.goods[0].image,name:"cscs"}
					// ]
					_.map(res.data.goods,(item,indexL)=>{
						item.imgList = [];
						item.content = "质量好,下次会再来,好评";
						item.grade = 5;
						item.pc = indexL;
						allList.push(item);
					})
					console.log(allList)
					this.allList = allList;
				})
			}
		},
		methods: {
			calcNum(num) {
				let arrayL = [];
				for (let i = 0; i < num; i++) {
					arrayL.push(i);
				}
				return arrayL;
			},
			selStat(star,indexCC){
				console.log(star)
				this.allList[indexCC].grade = star+1
			},
			nativeTo(){
				console.log(this.allList)
				// let imgList = this.imgList.length > 0 ?this.imgList.join(";"):""
				// let data = {
				// 	order_id:this.orderItem.id,
				// 	goods_id:this.orderItem.goods_list[0].goods_id,
				// 	content:this.textT,
				// 	pic:imgList,
				// 	star:this.star
				// }
				let subStr=[];
				_.map(this.allList,item=>{
					let foot1 = {
						"id":item.id,
						"grade":item.grade,
						"content":item.content,
						"images":item.imgList.toString()
					}
					subStr.push(foot1)
				})
				let subJson = JSON.stringify(subStr)
				this.$getApi("/api/Order/addComments", {comments:subJson,out_trade_no:this.outTradeNo}, res => {
					console.log(res.data,"ccccc3161")
					uni.reLaunch({
						url:"../home/msg?title=评价成功"
					})				
				})
				
			},
			upImg(indexCC){
				let this_ = this;
				
				console.log(this_.userInfo.token)
				uni.chooseImage({
				    count: 3, //默认9
				    sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
				    sourceType: ['camera','album'], //从相册选择
				    success: function (resImg) {
						console.log(resImg);
				        console.log(JSON.stringify(resImg.tempFilePaths));
				
						let beiyongLIst = resImg.tempFilePaths;
						console.log(beiyongLIst,beiyongLIst.length)
											
						
						for(let i=0;i< beiyongLIst.length;i++){
							console.log(beiyongLIst[i])
							uni.uploadFile({
								url:this_.$apiUrl + '/api/Common/upload',
								filePath: beiyongLIst[i],
								name: 'file',
								formData: {
									'token': this_.userInfo.token
								},
								success(uploadFileRes) {
									let imgRest = JSON.parse(uploadFileRes.data)
							
									this_.allList[indexCC].imgList.push(imgRest.data.url)
									this_.allList[indexCC].imgList = this_.allList[indexCC].imgList.slice(0,3)
									this_.$msg("图片上传成功")
								}
							});
						}
				    },
					fail(err){
						this_.$msg("不支持您上传的图片格式")
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
.bh80{
		height: 80upx;
	}
.appraise {
	font-size: 28upx;
	color: #666;
	padding: 0 26upx;
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
	.bgff{
		background-color: #f0f0f0;
		border-radius: 10upx;
		margin: 0 26upx;
		.p26{
			padding: 26upx;
		}
	}
	.photo_list_sy{
		display: flex;
		flex-wrap: wrap;
		.item_l{
			width: 120upx;
			height: 120upx;
			background: no-repeat center center;
			background-size: 120upx auto;
			margin-right: 20upx;
		}
		.item{
			width: 120upx;
			height: 120upx;
			margin-right: 20upx;
			position: relative;
			.text_po{
				text-align: center;
				position:absolute;
				bottom: 20upx;
				width: 120upx;
				left: 0;
				color: #999;
				transform: scale(.8);
			}
			.img_f{
				width: 100%;
				height: 100%;
			}
		}
	}
	.bg_btn_sub_sy {
		padding: 0 52upx;
		.btn {
			background-color: $uni-bl;
			color: #fff;
			padding: 32upx;
			text-align: center;
			border-radius: 60upx;
		}
	}
	.textarea_t{
		font-size: 28upx;
		padding: 26upx;
		// border: 1upx solid #ccc;
		width: 100%;
		box-sizing: border-box;
		border-radius: 10upx;
	}
	.rate_bg_sy {
		display: flex;
		.rate_i_sy {
			display: flex;
			justify-content: space-around;
			flex:1;
			
			.iconxingxing {
				color: #ccc;
				font-size: 46upx;
				margin-right: 20upx;
				&.yellow {
					color: #fec40b;
				}
			}
		}
		.right {
			color: #999;
			font-size: 28upx;
		}
	}
	.pt_p1{
		padding: 0upx 10upx 20upx;
		text-align: center;
		display: flex;
		align-items: center;
		.t1{
			font-size: 44upx;
			margin-bottom: 20upx;
			color: #333;
		}
		.t2{
			border-bottom: 1upx dashed #999;
			padding-bottom: 40upx;
			margin-bottom: 40upx;
		}
		.t3{
			color: #999;
			margin:0 30upx;
			font-size: 36upx; 
		}
	}
}
</style>
