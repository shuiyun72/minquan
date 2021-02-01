<template>
	<view class="add_foot">
		<uni-list>
			<sy-list-item title="商品分类" :showArrow="true" :point="true" @click="handleClassify" :clickable="true">
				<template v-slot:right="">
					<picker mode="multiSelector" @columnchange="bindMultiPickerColumnChange" :value="multiIndex" :range="multiArray"
					 class="picker_cc" range-key="name">
						<view class="peisong_timje" :class="calcText == '选择商品分类'?'isno':''">{{calcText}}</view>
					</picker>
				</template>
			</sy-list-item>
			<sy-list-item title="商品名称" :point="true">
				<template v-slot:right="">
					<input type="text" v-model="footName" maxlength="16" placeholder="请输入商品名称" class="addr_input" />
				</template>
			</sy-list-item>
			<sy-list-item title="商品售价" :point="true">
				<template v-slot:right="">
					<input type="text" v-model="footPrice" maxlength="6" placeholder="请输入商品售价(元)" class="addr_input" />
				</template>
			</sy-list-item>
			<sy-list-item title="商品库存" :point="true">
				<template v-slot:right="">
					<input type="text" v-model="footNum" maxlength="6" placeholder="请输入商品库存数量" class="addr_input" />
				</template>
			</sy-list-item>
			<sy-list-item title="商品标语" :point="true">
				<template v-slot:right="">
					<input type="text" v-model="footTitle" maxlength="16" placeholder="请输入商品标语,最多16个字" class="addr_input" />
				</template>
			</sy-list-item>
			<sy-list-item title="商品主图" :point="true" note="最多1张,图片为等比例大小尺寸(750x750)"></sy-list-item>
			<view class="photo_list">
				<view class="photo_btn t1" @click="upImg('list0')">
					<image src="../../static/img/shangcxqt.png" class="img_photp" mode=""></image>
					<view class="text">
						上传主图
					</view>
				</view>
				<view class="photo_btn" v-for="(item,index) in imgList0">
					<image :src="httpp+item" class="img_photp" mode=""></image>
					<view class="iconfont iconyduicuowushixin" @click="delList(index,'list0')"></view>
				</view>
			</view>
			<sy-list-item title="商品轮播主图" :point="true" note="最低3张最多6张,图片为等比例大小尺寸(750x750)"></sy-list-item>
			<view class="photo_list">
				<view class="photo_btn t1" @click="upImg('list1')">
					<image src="../../static/img/shangcxqt.png" class="img_photp" mode=""></image>
					<view class="text">
						上传主图
					</view>
				</view>
				<view class="photo_btn" v-for="(item,index) in imgList1">
					<image :src="httpp+item" class="img_photp" mode=""></image>
					<view class="iconfont iconyduicuowushixin" @click="delList(index,'list1')"></view>
				</view>
			</view>
			<sy-list-item title="商品详情图" :point="true" note="最低3张,图片为等比例大小尺寸(750x750)"></sy-list-item>
			<view class="photo_list">
				<view class="photo_btn" @click="upImg('list2')">
					<image src="../../static/img/shangcxqt.png" class="img_photp" mode=""></image>
					<view class="text">
						上传详情图
					</view>
				</view>
				<view class="photo_btn" v-for="(item,index) in imgList2">
					<image :src="httpp+item" class="img_photp" mode=""></image>
					<view class="iconfont iconyduicuowushixin" @click="delList(index,'list2')"></view>
				</view>
			</view>
		</uni-list>
		<view class="sub_top m26">
			<button class="btn  ms" @click="next">提交</button>
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
				footName: "",
				footPrice: "",
				footNum: "",
				footTitle: "",
				multiIndex: [0, 0, 0],
				multList1: [],
				multList2: [],
				multList3: [],
				mult1: [],
				mult2: [],
				mult3: [],
				imgList0:[],
				imgList1: [],
				imgList2: [],
				phFootId: "",
				isShopPri:false,
				record_classify:""
			};
		},
		onLoad(ph) {
			if (ph.footId) {
				this.phFootId = ph.footId;
				uni.setNavigationBarTitle({
					title: "编辑商品"
				})
				this.$getApi("/api/Goods/detail", {id:this.phFootId}, res => {
					console.log(res.data,"商品详情")
					this.footName = res.data.name,
					this.footPrice = res.data.price,
					this.footNum = res.data.price,
					this.footTitle = res.data.desc,
					this.imgList0 = res.data.logo.split(','),
					this.imgList1 = res.data.banner_images.split(','),
					this.imgList2 = res.data.content_images.split(',')
					// this.record_classify = JSON.parse(res.data.record_classify)
					this.record_classify = {
						name:"水果-实惠量贩装-橘子套装",
						id:15
					}
				})
				console.log("来自编辑")
			}else{
				this.phFootId = "";
			}
		},
		onShow() {
			this.clacMut1();
		},
		computed: {
			...mapState(["httpp", "shopInfo","userInfo"]),
			multiArray() {
				return [this.mult1, this.mult2, this.mult3]
			},
			calcText() {
				console.log(this.multiIndex, this.multiArray)
				if(!this.isShopPri){
					
					if(this.record_classify != ""){
						return this.record_classify.name
					}else{
						return "选择商品分类"
					}
					
				}else{
					if (this.multiArray[0][this.multiIndex[0]]
						&& this.multiArray[1][this.multiIndex[1]]
						&& this.multiArray[2][this.multiIndex[2]]
					) {
						return this.multiArray[0][this.multiIndex[0]].name + "-" + this.multiArray[1][this.multiIndex[1]].name + "-" +
							this.multiArray[2][this.multiIndex[2]].name
					}else
					if (this.multiArray[0][this.multiIndex[0]]
						&& this.multiArray[1][this.multiIndex[1]]
					) {
						return this.multiArray[0][this.multiIndex[0]].name + "-" + this.multiArray[1][this.multiIndex[1]].name
					}else
					if (this.multiArray[0][this.multiIndex[0]]
					) {
						return this.multiArray[0][this.multiIndex[0]].name
					}else{
						return "选择商品分类"
					}
				}
			}
		},
		methods: {
			handleClassify() {
				console.log("1212")
				this.isShopPri = true;
				this.record_classify = "";
			},
			next() {
				let sanjiClassid  = this.record_classify ? this.record_classify.id : this.multList3[this.multiIndex[2]].id;
				let record_classify = {
					name:this.calcText,
					id:sanjiClassid
				}
				let dataL = {
					category_id: sanjiClassid,
					logo: this.imgList0.toString(),
					name: this.footName,
					price: this.footPrice,
					stock: this.footNum,
					desc: this.footTitle,
					banner_images: this.imgList1.toString(),
					content_images:this.imgList2.toString(),
					id:this.phFootId,
					record_classify:JSON.stringify(record_classify)
				}
				console.log(dataL)
				this.$getApi("/api/Merchant/goodsSave", dataL, res1 => {
					console.log(res1.data)
					uni.navigateBack({
						delta: 1
					})
				})
				
			},
			delList(index, el) {
				let this_ = this;
				if (el == "list0") {
					this_.imgList0 = [];	
				}
				if (el == "list1") {
					this_.imgList1.splice(index, 1);
					this_.imgList1 = this_.imgList1;
					console.log(this_.imgList1)
				}
				if (el == "list2") {
					this_.imgList2.splice(index, 1);
					this_.imgList2 = this_.imgList2;
				}
			},
			upImg(el) {
				let this_ = this;
				uni.chooseImage({
					count: 1,
					sizeType: ['copressed'],
					success(res) {
						//因为有一张图片， 输出下标[0]， 直接输出地址
						var imgFiles = res.tempFilePaths[0]
						if(!imgFiles)
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
								if (el == "list0") {
									this_.imgList0 = [imgRest.data.url];
								}
								if (el == "list1") {
									this_.imgList1.push(imgRest.data.url);
								}
								if (el == "list2") {
									this_.imgList2.push(imgRest.data.url);
								}		
							}
						})
					},
					fail(err){
						this_.$msg("不支持您上传的图片格式")
					}
				})
			},
			async clacMut1() {
				this.$getApi("/api/Category/list", {}, res1 => {
					console.log(res1.data, "获取一级菜单")
					this.multList1 = res1.data;
					let mult1 = []
					_.map(this.multList1, item => {
						mult1.push(item.name)
					})
					this.mult1 = this.multList1;
					this.multiArray[this.multiIndex[0]] = this.multList1;
					this.clacMut2(this.multList1[this.multiIndex[0]].id)

				})
			},
			async clacMut2(id) {
				this.$getApi("/api/Category/list", {
					pid: id
				}, res2 => {
					console.log(res2.data, "获取2级菜单")
					this.multList2 = res2.data;

					let mult2 = []
					_.map(this.multList2, item => {
						mult2.push(item.name)
					})
					this.multiArray[1] = this.multList2;
					this.mult2 = this.multList2
					console.log(mult2)
					console.log(this.multList2)
					if (this.multList2.length > 0) {
						this.clacMut3(this.multList2[this.multiIndex[1]].id)
					} else {
						this.multiArray[2] = []
					}

				})
			},
			async clacMut3(id) {
				this.$getApi("/api/Category/list", {
					pid: id
				}, res3 => {
					console.log(res3.data, "获取3级菜单")
					this.multList3 = res3.data;
					let mult3 = []
					_.map(this.multList3, item => {
						mult3.push(item.name)
					})
					this.multiArray[2] = this.multList3;
					this.mult3 = this.multList3;
					console.log("3333")

				})
			},
			bindMultiPickerColumnChange: function(el) {
				console.log(el)
				
				if (el.detail.column == 0) {
					this.multiIndex[0] = el.detail.value;
					this.multiIndex.splice(1, 1, 0)
					this.multiIndex.splice(2, 1, 0)
					// this.multList1[this.multiIndex[0]].id

					this.clacMut2(this.multList1[this.multiIndex[0]].id)

				}
				if (el.detail.column == 1) {
					this.multiIndex[1] = el.detail.value;
					this.multiIndex.splice(2, 1, 0)
					this.clacMut3(this.multList2[this.multiIndex[1]].id)
				}
				if (el.detail.column == 2) {
					this.multiIndex[2] = el.detail.value;
					this.multiIndex.splice(2, 1, el.detail.value)
				}
				this.$forceUpdate()
			},
		}
	}
</script>

<style lang="scss">
	.add_foot {
		.sub_top {
			margin-top: 60upx;
			padding-bottom: 80upx;

			.btn {
				background-color: $uni-bl;
				color: #fff;
			}
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

		.picker_cc {
			flex: 1;
		}

		.addr_input {
			color: $uni-bl;
			font-size: 26upx;
			flex: 1;
		}

		.peisong_timje {
			color: $uni-bl;
			font-size: 26upx;

			&.isno {
				color: #777;
			}
		}
	}
</style>
