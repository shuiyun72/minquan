<template>
	<view class="shop_admin">
		<view class="tab_list_sy">
			<view class="item" v-for="(item,index) in tabList" :class="{'active':index == tabSel}" @click="selectTab(index)">{{item.text}}</view>
		</view>
		<view class="foot_list">
			<view class="no_list" v-if="footList.length == 0">
				列表为空
			</view>
			<view class="foot_item" v-for="item in footList" v-if="footList.length > 0">
				<image :src="httpp + item.logo" class="foot_img" mode=""></image>
				<view class="info">
					<view class="title1">
						{{item.name}}
					</view>
					<view class="title2">
						{{item.desc}}
					</view>
					<view class="title2">
						库存{{item.stock}}
					</view>
					<view class="money">
						￥{{item.price}}
					</view>
				</view>
				<view class="ctrl_btn" v-if="tabSel==0 || tabSel==2">
					<view class="ctrl_item c1" @click="handleC('shangjia',item)">
						<view class="iconfont iconshopshoppingco"></view>上架
					</view>
					<view class="ctrl_item c2"  @click="handleC('edit',item)">
						<view class="iconfont icontianxiegongdan-kuozhan-hebing"></view>编辑
					</view>
					<view class="ctrl_item c3"  @click="handleC('del',item)">
						<view class="iconfont iconqingkongshanchu"></view>删除
					</view>
				</view>
				<view class="ctrl_btn" v-if="tabSel == 1">
					<view class="ctrl_item c1"  @click="handleC('xiajia',item)">
						<view class="iconfont iconshopshoppingco"></view>下架
					</view>
				</view>
			</view>
		</view>
		<view class="add_btn" @click="addFoot">
			<view class="">
				<view class="iconfont iconjia"></view>
				<view class="text">
					添加
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
				tabList: [
					{
						text: "未上架",
						type: 2
					}, 
					{
						text: "已上架",
						type: 1
					}
					,{
						text: "已下架",
						type: 2
					}
				],
				footList:[],
				page:1
			};
		},
		onShow() {
			this.selectTab(this.tabSel);
		},
		computed: {
			...mapState(["httpp", "shopInfo","userInfo"]),
		},
		onReachBottom() { //上拉触底函数
			console.log("more")
			++this.page;
			this.selectTab(this.tabSel,true)
		},
		methods:{
			selectTab(i,isMore) {
				console.log("sel")
				this.tabSel = i;
				if(!isMore){
					this.page = 1;
				}
				
				this.$getApi('/api/Merchant/goodsList',{page:this.page,type:this.tabList[this.tabSel].type},res=>{
					console.log(res.data,"商品列表")
					if(isMore){
						this.footList =[...this.footList,...res.data.data] 
					}else{
						this.footList = res.data.data
					}
					
				})
			},
			addFoot(){
				uni.navigateTo({
					url:"./addFoot"
				})
			},
			handleC(el,item){
				let this_ = this;
				if(el == "shangjia"){
					uni.showModal({
						title:"上架商品",
						content:"是否确认上架商品",
						success(res) {
							if(res.confirm == true){
								this_.$getApi('/api/Merchant/goodsSwitch',{id:item.id},res=>{
									console.log(res.data,"商品上架")
									this_.selectTab(this_.tabSel);
									
								})
							}else{
								console.log("down")
							}
						}
					})
				}
				if(el == "xiajia"){
					uni.showModal({
						title:"下架商品",
						content:"是否确认下架商品",
						success(res) {
							if(res.confirm == true){
								this_.$getApi('/api/Merchant/goodsSwitch',{id:item.id},res=>{
									console.log(res.data,"商品下架")
									this_.selectTab(this_.tabSel);
									
								})
							}else{
								console.log("down")
							}
						}
					})
				}
				if(el == "edit"){
					uni.navigateTo({
						url:"./addFoot?footId="+item.id
					})
				}
				if(el == "del"){
					uni.showModal({
						title:"删除商品",
						content:"是否确认删除商品",
						success(res) {
							if(res.confirm == true){
								this_.$getApi('/api/Merchant/goodsDel',{id:item.id},res=>{
									console.log(res.data,"商品删除")
									this_.selectTab(this_.tabSel);
									
								})
							}else{
								console.log("down")
							}
						}
					})
				}
			}
		}
	}
</script>
<style lang="scss">
page{
	background-color: #f0f0f0;
}
</style>
<style lang="scss" scoped>
	.shop_admin {
		.add_btn{
			position: fixed;
			width: 120upx;
			height: 120upx;
			background-color: $uni-bl;
			color: #f0f0f0;
			text-align: center;
			border-radius: 50%;
			box-sizing: border-box;
			display: flex;
			justify-content: center;
			align-items: center;
			transform: scale(.9);
			right: 20upx;
			bottom:30vh;
			.iconjia{
				font-size: 50upx;
			}
			.text{
				position: relative;
				top:-10upx;
			}
		}
		.foot_list{
			.foot_item{
				display: flex;
				background-color: #fff;
				margin-bottom: 10upx;
				align-items: center;
				padding: 10upx 26upx;
				.foot_img{
					width: 160upx;
					height: 160upx;
					flex-shrink: 0;
				}
				.info{
					flex:1;
					margin-left: 20upx;
					.title1{
						font-size: 32upx;
						color: #333;
					}
					.title2{
						color: #999;
					}
					.money{
						color: $uni-red;
						font-size: 32upx;
						font-weight: bold;
						opacity: .7;
					}
				}
				.ctrl_btn{
					display: inline-flex;
					flex-direction: column;
					flex-shrink: 0;
					justify-content: space-around;
					height: 160upx;
					.ctrl_item{
						display: inline-flex;
						font-size: 28upx;
						align-items: center;
						&.c1{
							color: $uni-bl;
						}
						&.c2{
							color: $uni-color-success;
						}
						&.c3{
							color: $uni-or;
						}
						.iconfont{
							font-size: 28upx;
							margin-right: 6upx;
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
			margin-bottom: 10upx;
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
	}
</style>
