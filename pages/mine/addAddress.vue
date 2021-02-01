<template>
	<view class="add_address">
		<uni-nav-bar color="#333333" background-color="#ffffff"
		:status-bar="true" left-icon="arrowleft" :title="fromTitle" @clickLeft="back" />
		<uni-list>
			<sy-list-item title="联系人" note="" :showArrow="false">
				<template v-slot:right="">
					<input type="text" v-model="name" placeholder="联系人姓名" class="addr_input"/>
				</template>
			</sy-list-item>
			<sy-list-item title="联系电话" note="" :showArrow="false">
				<template v-slot:right="">
					<input type="text" v-model="phone" placeholder="联系人电话" class="addr_input"/>
				</template>
			</sy-list-item>
			<sy-list-item title="所在地区" note="" :showArrow="false">
				<template v-slot:right="">
					<text class="text_bl">商丘市民权县</text>
				</template>
			</sy-list-item>
			<sy-list-item title="所在乡镇" note="" :showArrow="true" @click="selAddress">
				<template v-slot:right="">
					<text class="text_bl2">定位</text>
				</template>
			</sy-list-item>
			<textarea v-model="addressDetail" placeholder="详细地址 : 如道路 门牌号 位置描述 店铺名称等" class="address_textarea"/>
		</uni-list>
		<view class="sub_top">
			<button class="btn blue ms round vx_login" @click="submit">
				 <text>保存</text>
			</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				name:"",
				phone:"",
				fromTitle:"新增配送地址",
				addressDetail:"",
				lngLat:{},
				addressId:""
			};
		},
		onLoad(ph) {
			if(ph.fromTitle){
				this.fromTitle = ph.fromTitle;
			}
			if(ph.fromTitle == "编辑配送地址"){
				uni.setNavigationBarTitle({
					title:"编辑配送地址"
				})
				this.addressId = ph.addressId;
				this.$getApi("/api/Address/detail",{id:ph.addressId},resl=>{
					// this.$refs['juan0'].close();
					console.log(resl.data)
					let addInfo = resl.data;
					this.name = addInfo.name;
					this.phone = addInfo.tel;
					this.addressDetail = addInfo.detail;
				})
			}
		},
		onShow() {
			let this_ = this;
			uni.getLocation({
				type: 'wgs84',
				altitude: true,
				success: function(res) {
					console.log(res,JSON.stringify(res),"76hang")
					console.log('当前位置的经度：' + res);
					// console.log('当前位置的纬度：' + res.latitude);
					this_.lngLat = [res.longitude,res.latitude]
				}
			});
		},
		methods:{
			back(){
				uni.switchTab({
					url:"../mine/mine"
				})  
				return true;
			},
			selAddress(){
				console.log("cc")
				let this_ = this;
				uni.chooseLocation({
					success: (res) => {
						console.log(res,JSON.stringify(res),"94hang")
						this_.addressDetail =res.address?res.address:res.name;
						this_.lngLat = [res.longitude,res.latitude];
					}
				})
			},
			submit(){
				let dataL = {
					name:this.name,
					tel:this.phone,
					province:"河南省",
					city:"商丘市",
					area:"民权县",
					detail:this.addressDetail,
					lng:this.lngLat[0],
					lat:this.lngLat[1]
				}
				if(this.fromTitle == '地址选择'){
					this.$getApi("/api/Address/add", dataL, res => {
						console.log(res.data, "add地址")
						uni.navigateBack({
							delta:1
						})
					})
				}else
				if(this.fromTitle == '编辑配送地址'){
					dataL.id = this.addressId;
					this.$getApi("/api/Address/edit", dataL, res => {
						console.log(res.data, "add地址")
						this.$msg("地址修改成功")
						setTimeout(()=>{
							uni.navigateBack({
								delta:1
							})
						},500)
						
					})
				}else{
					this.$getApi("/api/Address/add", dataL, res => {
						console.log(res.data, "add地址")
						this.$msg("地址添加成功")
						setTimeout(()=>{
							uni.navigateBack({
								delta:1
							})
						},500)
						
					})
				}
				
				
				
				
			}
		}
	}
</script>

<style lang="scss" scoped>
.add_address{
	min-height: 100vh;
	background-color: #f0f0f0;
	color: #666;
	.text_bl{
		color: $uni-bl;
		font-size: 30upx;
		width: 100%;
		text-align: right;
	}
	.text_bl2{
		font-size: 28upx;
		width: 100%;
		text-align: right;
	}
	.address_textarea{
		padding: 20upx 0upx;
		font-size: 30upx;
		border-top: 1upx solid #f0f0f0;
		margin: 0 26upx;
	}
	.addr_input{
		font-size: 30upx;
		width: 90%;
		text-align: right;
	}
	.sub_top{
		margin: 200upx 36upx 10upx;
	}
}
</style>
