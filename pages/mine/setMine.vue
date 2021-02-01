<template>
	<view class="set_mine">
		<view class="touxiang_info">
			<view class="cc_img">
				编辑头像 :
			</view>
			<view class="photo_list">
				<view class="photo_btn" @click="upImg('zhengjian')">
					<image src="../../static/img/tianjtp.png" class="img_photp" mode=""></image>
					<view class="text">
						修改头像
					</view>
				</view>
				<view class="photo_btn" v-if="zhengjianImg != ''">
					<image :src="zhengjianImgL" class="img_photp" mode=""></image>
					<!-- <view class="iconfont iconyduicuowushixin" @click="delList('zhengjian')"></view> -->
				</view>
			</view>
		</view>
		<view class="icon_input_sy">
			<view class="iconfont iconyonghuming"></view>
			<input class="input" type="text" v-model="name" placeholder="编辑姓名" />
		</view>
		<view class="sub_top">
			<button class="btn blue ms round" @click="next">确定提交</button>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from "vuex";
	export default {
		data() {
			return {
				zhengjianImg:"",
				zhengjianUrl:"",
				name:""
			};
		},
		computed: {
			...mapState(["httpp", "SystemInfo", "userInfo", "shopCar", "location"]),
			zhengjianImgL(){
				return this.zhengjianImg;
			}
		},
		onShow() {
			console.log(this.userInfo)
			this.zhengjianImg = this.userInfo.avatar;
			this.name = this.userInfo.nickname;
		},
		methods:{
			next(){
				let data = {
					nickname:this.name,
					avatar:this.zhengjianUrl ? this.zhengjianUrl : this.zhengjianImg
				}
				this.$getApi('/api/User/profile',data,res=>{
					console.log(res)
					this.$msg("编辑成功")
					setTimeout(()=>{
						uni.navigateBack({
							delta:1
						})
					},500)
					
				})
			},
			upImg(el) {
			
				let this_ = this;
				uni.chooseImage({
					count: 1,
					sizeType: ['copressed'],
					success(res) {
						//因为有一张图片， 输出下标[0]， 直接输出地址
						console.log(res)
						let imgFiles = res.tempFilePaths[0]
						// tempFiles
						// console.log(this_.zhengjianImg)
					
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
								this_.zhengjianUrl = imgRest.data.url;
								this_.zhengjianImg = res.tempFilePaths[0];
							}
						});
					},
					fail(err){
						this_.$msg("不支持您上传的图片格式")
					}
				})
				
			},
		}
	}
</script>

<style lang="scss">
	.set_mine {
		padding: 20upx 26upx;
		.sub_top{
			padding: 160upx 40upx 0;
		}
		.icon_input_sy {
			.input {
				width: 300upx;
			}
		}
		.touxiang_info {
			display: flex;

			// border-bottom: 1upx solid #f0f0f0;
			.cc_img {
				padding-top: 20upx;
				color: #999;
				font-size: 30upx;
			}
		

		.photo_list {
			display: flex;
			flex-wrap: wrap;
			padding: 20upx 0upx 20upx 26upx;

			.photo_btn {
				width: 160upx;
				height: 160upx;
				margin: 0 20upx 20upx 0;
				position: relative;

				.text {
					width: 160upx;
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
					width: 160upx;
					height: 160upx;
				}
			}
		}
		}
	}
</style>
