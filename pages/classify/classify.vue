<template>
	<view class="classify">
		<searchSy @click="searchCom" :placeholder="'请输入商品名称'"></searchSy>
		<view class="body">
			<view class="left_classify">
				<view class="item" :class="{'active':index == homeNavSel}" v-for="(item,index) in homeNav" @click="selClass(item,index)">
					<view class="border">
						{{item.name}}
					</view>
				</view>
			</view>
			<view class="right_show">
				<view class="img_show" @click="toSearchR"> 
					<!-- <image :src="httpp+classify.image" class="img" mode=""></image> -->
					<image src="../../static/img/xuanct.png" class="img" mode=""></image>
				</view>
				<view class="shop_list">
					<view class="item" v-for="item in footNav" @click="toClassify(item)">
						
						<image :src="httpp + item.image" class="img" mode=""></image>
						<view class="text">
							{{item.name}}
						</view>
					</view>
					<view class="item"  @click="toAllClassify(classItem.id,'全部'+classItem.name)">
						<image src="../../static/img/shuigqb.png" class="img" mode=""></image>
						<view class="text">
							全部{{classItem.name}}
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import searchSy from "../sycom/searchSy.vue";
	import _ from "../../until/lodash";
	import {
		mapState,
		mapMutations
	} from "vuex";
	export default {
		components: {
			searchSy
		},
		computed: {
			...mapState(['classify',"shopCar","httpp"])
		},
		watch:{
			shopCar: {
				handler: function(newVal, oldVal) {
					this.initShopCar()
				},
				deep: true,
				immediate: true
			}
		},
		onShow() {
			this.initShopCar()
			console.log(this.classify)
			this.classItem = this.classify;
			this.$getApi("/api/Category/list", {}, res => {
				console.log(res.data, "一级分类")
				this.homeNav = res.data;
				let classifySelindex = _.findIndex(this.homeNav, item => {
					return item.name == this.classify.name
				})
				console.log(classifySelindex)
				if (classifySelindex > 0) {
					this.homeNavSel = classifySelindex;
					this.selClass(this.classify,classifySelindex)
				}else{
					this.selClass(this.homeNav[0],0)
				}
			})
			this.$getApi("/api/Banner/list", {pos:"CATEGORY_TOP"}, res => {
				console.log(res.data, "轮播图")
				// this_.lunboList = res.data
				this.classLunboList = res.data;
			})
			
		},
		data() {
			return {
				homeNav:[],
				homeNavSel: 0,
				footNav:[],
				allFoot:{
					name:"全部水果"
				},
				footList:[],
				classItem:"",
				classLunboList:[]
			};
		},
		methods: {
			initShopCar(){
				let numb = 0;
				_.map(this.shopCar, item => {
					numb += item.number
				})
				if (numb > 0) {
					let numbStr = numb.toString();
					uni.setTabBarBadge({
						index: 2,
						text: numbStr
					})
				} else {
					uni.removeTabBarBadge({
						index: 2
					})
				}
			},
			searchCom() {
				console.log("ccc")
				uni.navigateTo({
					url:'../home/search'
				})
			},
			selClass(item, index) {
				this.homeNavSel = index;
				this.classItem = item;
				console.log(item)
				this.$getApi("/api/Category/list", {pid:item.id}, res => {
					console.log(res.data, "二级分类")
					this.footNav = res.data
				})
			},
			toClassify(item){
				uni.navigateTo({
					url:"../home/searchResult?searchName="+item.name+'&fromType=classify&navId='+item.id
					
				})
			},
			toAllClassify(id,name){
				uni.navigateTo({
					url:"../home/searchResult?searchName="+name+'&fromType=classify&navId='+id
					
				})
			},
			toSearchR(){
				uni.navigateTo({
					url:"../home/searchResult?fromType=sgTop10"
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.classify {
		.body {
			display: flex;
			padding-top: 20upx;

			.left_classify {
				background-color: #f0f0f0;
				height: calc(100vh);
				/* #ifdef H5 */
				height: calc(100vh - 310upx);
				/* #endif */
				overflow-y: auto;
				width: 180upx;
				box-sizing: border-box;
				.item {
					padding: 26upx 0 26upx 14upx;
					font-weight: bold;
					color: #666;

					.border {
						border-left: 8upx solid transparent;
						width: 160upx;
						text-align: center;
						line-height: 28upx;
					}

					&.active {
						background-color: #fff;

						.border {
							border-left: 8upx solid $uni-bl;
							color: $uni-bl;
						}
					}

				}
			}

			.right_show {
				padding: 0 26upx 0 10upx;
				flex: 1;
				/* #ifdef MP */
				height: calc(100vh);
				/* #endif */
				/* #ifndef MP */
				height: calc(100vh - 310upx);
				/* #endif */
				overflow-y: auto;
				box-sizing: border-box;

				.img_show {
					text-align: center;
					.img {
						width: 520upx;
						height: 140upx;
					}
				}

				.shop_list {
					display: flex;
					flex-wrap: wrap;
					padding: 0 0upx 20upx 0upx;

					.item {
						width: 28%;
						text-align: center;
						margin-left: 20upx;
						padding: 26upx 0;

						.img {
							width: 100upx;
							height: 100upx;
						}

						.text {
							color: #333;
							padding-top: 6upx;
						}
					}
				}
			}
		}
	}
</style>
