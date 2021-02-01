<template>
	<view class="">
		
		<view v-if="phFromType=='classify'" class="search_box_sy">
			<view class="part2" v-if="searchList.length>1">
				<view class="fenlei_item" :class="{'active':index==search2Sel}" v-for="(item,index) in searchList" @click="search2Show(index,item)">
					{{item.name}}
				</view>
			</view>
		</view>
		<view v-if="phFromType=='shoucang'" class="tab_list_sy">
			<view class="item" v-for="(item,index) in tabList" :class="{'active':index == tabSel}" @click="selectTab(item,index)">{{item.text}}</view>
		</view>
		<view class="foot_list_show" v-if="tabSel == 0">
			<view class="buy_car iconfont icongouwuche" @click="toShopCar">
				<view class="text" v-if="carShowNum>0">
					{{carShowNum}}
				</view>
			</view>
			
			<view class="rec_body_sy">
				<sy-foot2 v-for="(item,index) in shopList" :item="item" @click="foot2Click" :isPaihang="isPaihang" :itemIndex="index">
					<view class="num_add_sy">
						<view class="iconfont iconjian" v-if="item.number > 0" @click.stop="foot2Jian(item)"></view>
						<view class="n" v-if="item.number > 0">{{ item.number }}</view>
						<view class="iconfont iconjia show" @click.stop="foot2Jia(item)"></view>
					</view>
				</sy-foot2>
			</view>
			
		</view>
		<view class="dianpu2_list"  v-if="tabSel == 1">
			<view class="dian2" v-for="item in dianpuList3i"  @click="shopNav(item)">
				<image :src="httpp + item.logo" mode="" class="dian2_img"></image>
				<view class="info">
					<view class="title">
						{{item.name}}
					</view>
					<view class="rate_h">
						<uni-rate :value="item.grade" color="#bbb" active-color="#FF8F3B" class="rate_fen" :margin="3" :size="12" :disabled="true"/> <text class="statr">{{item.grade}}</text> <text class="xiaoliang">月销{{item.month_sales}}</text>
					</view>
					<view class="jieshao shengluehao">
						{{item.desc}}
					</view>
					<view class="address">
						<text class="iconfont iconlocation"><text>{{item.address}}</text></text>
					</view>
				</view>
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
				tabSel: 0,
				tabList: [{
						text: "商品",
						type: 0
					}, {
						text: "店铺",
						type: 1
					}
				],
				dianpuList3i:[],
				search2Sel:0,
				searchList:[],
				classifyNav: [{
						name: "水果"
					},
					{
						name: "蔬菜"
					},
					{
						name: "肉禽"
					},
					{
						name: "海鲜水产"
					},
					{
						name: "粮油调料"
					}
				],
				classifyIndex: 0,
				shopList: [],
				isPaihang:false,
				phFromType:"",
				phSearchName:"",
				navId:"",
				page:1
			};
		},
		onShow() {
			this.tabSel = 0;
		},
		onLoad(ph) {
			this.page = 1;
			if(ph.fromType){
				this.phFromType = ph.fromType;
			}
			if(ph.searchName){
				this.phSearchName = ph.searchName;
				uni.setNavigationBarTitle({
					title: ph.searchName
				})
			}
			if(ph.searchName == "热销排行榜"){
				this.getHotList();
			}
			// 来自分类
			if (ph.fromType == 'classify') {
				
				this.navId = ph.navId;
				
				this.page = 1;
				this.$getApi("/api/Category/list", {pid:ph.navId}, res => {
					console.log(res.data, "二级分类")
					// this.footNav = res.data
					this.searchList = [{id:ph.navId,name:"全部"},...res.data]
				})
				this.getFootList(ph.navId);
				
			}
			if(ph.fromType == 'home'){
				
			}
			if(ph.fromType == 'shoucang'){
				this.selectTab("",0)
			}
			//search 来自搜索
			
			
			_.map(this.shopList, itemL => {
				_.map(this.shopCar, itemC => {
					if (itemL.id == itemC.id) {
						itemL.number = itemC.number
					}
				})
			})
		},
		onPageScroll() {

		},
		onReachBottom() { //上拉触底函数
			console.log("more")
			++this.page;
			if(this.phSearchName == "热销排行榜"){
				this.getHotList(true)
			}
			if(this.phFromType == 'classify'){
				this.getFootList("",true)
			}
			
			
		},
		watch:{
			shopCar: {
				handler: function(newVal, oldVal) {
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
				deep: true,
				immediate: true
			}
		},
		computed: {
			...mapState(["httpp", "SystemInfo", "userInfo", "shopCar"]),
			carShowNum() {
				let carShowNum = 0;
				_.map(this.shopCar, itemC => {
					carShowNum += itemC.number
				})
				return carShowNum;
			}
		},
		
		methods: {
			...mapMutations(["jiaCar", "jianCar"]),
			getHotList(isMore){
				if(!isMore){
					this.page = 1;
				}
				this.$getApi("/api/Goods/list", {order_field:"sales",page:this.page}, res => {
					console.log(res.data.data, "商品列表")
					let shopList = [];
					let resList = [];
					if(isMore){
						resList = [...this.shopList,...res.data.data]
					}else{
						resList = res.data.data
					}
					
					_.map(resList,item=>{
						item.number = 0;
						_.map(this.shopCar, (itemC, index) => {
							if (item.id == itemC.id) {
								item.number = itemC.number;
							}
						})
						shopList.push(item)
					})
					this.$nextTick(function(){
						this.shopList = shopList;
					})
					
				})
			},
			getFootList(navId,isMore){
				if(!isMore){
					this.page = 1
				}
				if(!navId){
					navId = this.navId;
				}
				this.$getApi("/api/Goods/list", {page:this.page,category_id:navId}, res => {
					console.log(res.data, "商品列表")
					let shopList = [];
					let resList = [];
					if(isMore){
						resList = [...this.shopList,...res.data.data]
					}else{
						resList = res.data.data
					}
					_.map(resList,item=>{
						item.number = 0;
						_.map(this.shopCar, (itemC, index) => {
							if (item.id == itemC.id) {
								item.number = itemC.number;
							}
						})
						shopList.push(item)
					})
					console.log(shopList)
					this.$nextTick(function(){
						this.shopList = shopList;
					})
				})
			},
			selectTab(el, i) {
				this.tabSel = i;
				console.log(el, i)
				if(i == 0){
					this.$getApi("/api/Favorites/list", {type:"goods"}, res => {
						console.log(res.data, "收藏列表")
						let shopList = [];
						_.map(res.data.data,item=>{
							item.number = 0;
							_.map(this.shopCar, (itemC, index) => {
								if (item.id == itemC.id) {
									item.number = itemC.number;
								}
							})
							shopList.push(item)
						})
						this.$nextTick(function(){
							this.shopList = shopList;
						})
					})
				}
				if(i == 1){
					this.$getApi("/api/Favorites/list", {type:"shop"}, res => {
						console.log(res.data, "收藏列表")
						this.dianpuList3i = res.data.data
					})
				}
				
			},
			search2Show(index,item){
				this.search2Sel = index;
				this.page = 1;
				console.log(item)
				this.navId = item.id;
				this.getFootList(item.id)
			},
			toShopCar() {
				uni.switchTab({
					url: "../shopCar/shopCar"
				})
			},
			foot2Click(item) {
				console.log(item)
				uni.navigateTo({
					url:"../detail/detail?id="+item.id
				})
			},
			foot2Jia(item) {
				console.log(item)
				++item.number;
				this.$getApi("/api/Cart/change", {id:item.id,number:item.number}, res => {
					console.log(res.data, "商品列表")
					this.jiaCar(item)
					this.$getApi("/api/Cart/list", {id:item.id,number:item.number}, res => {
						console.log(res.data, "商品列表")
						
					})
				})

			},
			foot2Jian(item) {
				console.log(item)
				--item.number;
				this.$getApi("/api/Cart/change", {id:item.id,number:item.number}, res => {
					console.log(res.data, "商品列表")
					this.jianCar(item)
					this.$getApi("/api/Cart/list", {id:item.id,number:item.number}, res => {
						console.log(res.data, "商品列表")
						
					})
				})
			},
			shopNav(item){
				uni.navigateTo({
					url:"../classify/shopClassify?shopId="+item.id
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
	.search_box_sy{
		// padding: 0 0 20upx;
		.part2{
			display: flex;
			padding: 10upx 26upx;
			flex-wrap: wrap;
			background-color: #fff;
			.fenlei_item{
				padding: 6upx 26upx 12upx;
				margin-right: 20upx;
				margin-bottom: 20upx;
				background-color: #f0f0f0;
				border-radius: 30upx;
				color: #666;
				&.active{
					color: $uni-bl;
					background-color: $uni-bl-bg;
				}
			}
		}
	}
	.foot_list_show {
		padding: 20upx 26upx 200upx;

		.num_add_sy {
			display: inline-flex;

			.n {
				width: 50upx;
				text-align: center;
				position: relative;
				top: 8upx;
			}

			.iconfont {
				padding: 6upx 8upx;
				border-radius: 50%;
			}

			.iconjian {
				// background-color: #f0f0f0;
				// color: #666;
				background-color: $uni-bl;
				color: #fff;
			}

			.iconjia {
				background-color: #f0f0f0;
				color: #666;

				&.show {
					background-color: $uni-bl;
					color: #fff;
				}
			}
		}

		.buy_car.icongouwuche {
			position: fixed;
			bottom: 40upx;
			right: 40upx;
			font-size: 70upx;
			background-color: $uni-bl;
			color: #fff;
			width: 120upx;
			height: 120upx;
			text-align: center;
			line-height: 120upx;
			border-radius: 50%;

			.text {
				background-color: $uni-or;
				position: absolute;
				top: 16upx;
				right: 16upx;
				font-size: 26upx;
				width: 36upx;
				height: 36upx;
				line-height: 36upx;
				border-radius: 50%;
				transform: scale(.8);
			}
		}

		.rec_body_sy {
			background-color: #fff;
			border-radius: 12upx;
			padding: 10upx 26upx;
		}
	}
	.tab_list_sy {
		display: flex;
		font-size: 32upx;
		justify-content: space-around;
		background-color: #fff;
		margin-bottom: 0upx;
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
	.dianpu2_list{
		padding: 10upx 26upx;
		background-color: #fff;
		margin-top: 20upx;
		.dian2{
			display: flex;
			padding: 20upx 0 26upx;
			&+.dian2{
				border-top: 1upx solid #f0f0f0;
			}
			.dian2_img{
				width: 160upx;
				height: 160upx;
				flex-shrink: 0;
				padding: 10upx 16upx 10upx 0upx;
			}
			.info{
				
				display: inline-flex;
				flex-direction: column;
				justify-content: space-between;
				.title{
					font-size: 30upx;
				}
				.rate_h{
					display: flex;
					align-items: baseline;
					.statr{
						color: #666;
						margin-left: 16upx;
					}
					.xiaoliang{
						color: #666;
						margin-left: 26upx;
					}
				}
				
				.jieshao{
					color: $uni-or;
					transform: scale(.9);
					position:relative;
					left: -16upx;
				}
				.address{
					color: #666;
					.iconlocation{
						font-size: 26upx;
						text{
							margin-left: 6upx;
						}
					}
				}
			}
		}
	}
	
</style>
