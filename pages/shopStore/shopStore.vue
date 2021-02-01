<template>
	<view class="shop_store">
		<view class="header_t">
			<image :src="httpp + shopDetail.logo" class="h_img" mode="" @click="upImg('logo')"></image>
			<view class="text" v-if="noEdit">
				{{shopDetail.name}}
			</view>
			<view class="text"  v-if="!noEdit">
				上传批发商logo或门头照
			</view>
		</view>
		<view class="m26_title_sy">
			<view class="iconfont iconaishenghuo-shanghuzhongxin"> <text class="cc">批发商信息 </text></view>
		</view>
		<uni-list>
			<sy-list-item title="商家名称">
				<template v-slot:right="">
					<input :disabled="noEdit" type="text" v-model="shopDetail.name" maxlength="16" placeholder="请输入商家名称" class="addr_input" />
				</template>
			</sy-list-item>
			<sy-list-item title="商家地址" :showArrow="true">
				<template v-slot:right="">
					<view class="addr_input">
						{{shopDetail.address}}
					</view>
				</template>
			</sy-list-item>
			<sy-list-item title="商家宣传语">
				<template v-slot:right="">
					<input :disabled="noEdit" type="text" v-model="shopDetail.desc" maxlength="26" placeholder="请输入商家宣传语" class="addr_input" />
				</template>
			</sy-list-item>
			
			<sy-list-item title="营业执照" :point="true" note="请确保证件完整,<text style='color:#FF8F3B'>编号</text>,<text style='color:#FF8F3B'>印章</text>,<text style='color:#FF8F3B'>文字</text>,照片均清晰可见 (一张)"></sy-list-item>
			<view class="photo_list">
				<view class="photo_btn" @click="upImg('zhizhao')" v-if="!noEdit">
					<image src="../../static/img/shangc.png" class="img_photp" mode=""></image>
					<view class="text">
						上传营业执照
					</view>
				</view>
				<view class="photo_btn"  v-for="(item,index) in imgList1" >
					<image :src="httpp + item" class="img_photp" mode=""></image>
					<view class="iconfont iconyduicuowushixin" @click="delList(index,'zhizhao')" v-if="!noEdit"></view>
				</view>
			</view>
		</uni-list>
		<view class="m26_title_sy">
			<view class="iconfont iconpersonnone"> <text class="cc">店主信息 </text></view>
		</view>
		<uni-list>
			<sy-list-item title="店主姓名">
				<template v-slot:right="">
					<input :disabled="noEdit" type="text" v-model="shopDetail.boss_name" maxlength="16" placeholder="请输入店主姓名" class="addr_input" />
				</template>
			</sy-list-item>
			<sy-list-item title="手机号码">
				<template v-slot:right="">
					<input :disabled="noEdit" type="text" v-model="shopDetail.tel" maxlength="16" placeholder="请输入手机号码" class="addr_input" />
				</template>
			</sy-list-item>
			<sy-list-item title="身份证号码">
				<template v-slot:right="">
					<input :disabled="noEdit" type="text" v-model="shopDetail.idcard" maxlength="16" placeholder="请输入身份证号码" class="addr_input" />
				</template>
			</sy-list-item>
			
			<sy-list-item title="身份证" :point="true" note="请确保证件完整,<text style='color:#FF8F3B'>上传正反两面</text>,身份证照片 (两张)"></sy-list-item>
			<view class="photo_list">
				<view class="photo_btn" @click="upImg('shenfen')" v-if="!noEdit">
					<image src="../../static/img/shenfz.png" class="img_photp" mode=""></image>
					<view class="text">
						上传身份证照片
					</view>
				</view>
				
				<view class="photo_btn"  v-for="(item,index) in imgList2" >
					<image :src="httpp + item" class="img_photp" mode=""></image>
					<view class="iconfont iconyduicuowushixin" @click="delList(index,'shenfen')" v-if="!noEdit"></view>
				</view>
				
				
				
				
			</view>
		</uni-list>
		<view class="sub_top m26">
			<button class="btn  ms" @click="next" v-if="noEdit">编辑店铺</button>
			<button class="btn  ms" @click="next" v-if="!noEdit">提交</button>
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
				noEdit:true,
				imgList1:[],
				imgList2:[],
				shopDetail:{}
			};
		},
		onShow() {
			this.$getApi('/api/Merchant/info', {}, res => {
				console.log(res.data)
				// this.resData = res.data
				this.shopDetail = res.data;
				this.imgList1 = this.shopDetail.business_images.split(',');
				this.imgList2 = this.shopDetail.idcarrd_images.split(',');
			})
		},
		computed: {
			...mapState(["httpp", "shopInfo","userInfo"]),
		},
		watch:{
			shopDetail(val) {
				this.shopDetail = this.shopDetail;
			 }
		},
		methods:{
			delList(index, el) {
				let this_ = this;
				if (el == "zhizhao") {
					this_.imgList1.splice(index, 1);
				}
				if (el == "shenfen") {
					this_.imgList2.splice(index, 1);
				}
				
			},
			upImg(el) {
				if(!this.noEdit){
				let this_ = this;
				uni.chooseImage({
					count: 1,
					sizeType: ['copressed'],
					success(res) {
						//因为有一张图片， 输出下标[0]， 直接输出地址
						var imgFiles = res.tempFilePaths[0]			
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
								if (el == "logo") {
									this_.shopDetail.logo = imgRest.data.url;
								}
								if (el == "zhizhao") {
									this_.imgList1.splice(0, 1,imgRest.data.url);
									
								}
								if (el == "shenfen") {
									this_.imgList2.push(imgRest.data.url);
								}
							}
						})	
					},
					fail(err){
						this_.$msg("不支持您上传的图片格式")
					}
				})
				}
			},
			next(){
				console.log(this.shopDetail)
				if(this.noEdit){
					this.noEdit = false;
				}else{
					this.noEdit = true;
					let dataL = {
						type:"2",
						logo:this.shopDetail.logo,
						name:this.shopDetail.name,
						// address:this.shopAddress,
						address:this.shopDetail.address,
						desc:this.shopDetail.desc,
						business_images:this.imgList1.toString(),
						boss_name:this.shopDetail.boss_name,
						tel:this.shopDetail.tel,
						idcard:this.shopDetail.idcard,
						idcarrd_images:this.imgList2.toString()
					}
					console.log(dataL)			
					this.$getApi("/api/Merchant/apply", dataL, res => {
						console.log(res.data,"入驻/修改 申请")
						uni.reLaunch({
							url:"../home/msg?title=修改完成"
						})
						
					})
					// uni.reLaunch({
					// 	url:"../home/msg?title=完成"
					// })
				}
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #f0f0f0;
	}
	.m26_title_sy{
		margin: 0 26upx;
		padding: 20upx 0;
		.iconfont{
			font-size: 30upx;
			color: #666;
			.cc{
				margin-left: 10upx;
			}
		}
	}
.shop_store{
	.sub_top {
		margin-top: 60upx;
		padding-bottom: 80upx;
		.btn{
			background-color: $uni-bl;
			color: #fff;
		}
	}
	.photo_list {
		display: flex;
		flex-wrap: wrap;
		padding: 20upx 0upx 20upx 26upx;
	
		.photo_btn {
			width: 300upx;
			height: 160upx;
			margin:0 20upx 20upx 0;
			position: relative;
	
			.text {
				width: 300upx;
				position: absolute;
				text-align: center;
				bottom: 30upx;
				color: #999;
				transform: scale(.9);
			}
	
			.iconyduicuowushixin {
				position: absolute;
				top: 0;
				right: 0;
				color: $uni-bl;
			}
	
			.img_photp {
				width: 300upx;
				height: 160upx;
			}
		}
	}
	.addr_input{
		flex:1;
		text-align: right;
		font-size: 28upx;
		color: #777;
	}
	.header_t{
		background-color: $uni-bl;
		padding: 30upx 0;
		text-align: center;
		color: #f0f0f0;
		.h_img{
			width: 140upx;
			height: 140upx;
		}
		.text{
			font-size: 30upx;
			padding-top: 10upx;
		}
	}
	
}
</style>
