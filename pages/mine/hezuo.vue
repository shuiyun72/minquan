<template>
	<view class="about_mine">
		<view class="hezuo_img"><image :src="httpp  + hezuo.image" class="ab_logo"></image></view>
		<!-- <view class="text_p1" v-html="swMsg">{{swMsg.content}}</view> -->
		<view class="text_p1" v-html="hezuo.content"></view>
		<view class="s_phone">
			<view class="l">
				商务合作电话
			</view>
			<view class="r">
				{{hezuo.tel}}
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from "vuex";
export default {
	data() {
		return {
			swMsg: '',
			hezuo:{}
		};
	},
	computed:{
		...mapState(["httpp", "SystemInfo", "userInfo"]),
	},
	
	mounted() {
		this.$getApi("/api/Document/detail",{type:"bussiness"},res=>{
			console.log(res.data)
			this.hezuo = res.data
		})
		
		// this.$getApi("/api/user/my/hezuo",{},res=>{
		// 	let swM = res.data.content;
		// 	this.phone = res.data.tel;
		// 	// const regex = new RegExp('<img[\s\S]+?', 'gi')
		// 	// swM = swM.replace(regex, `<img style="width:100%;height:auto;display:block;margin:10px 0;"`);
		// 	this.swMsg = this.formatRichText(res.data.content);
		// })
	},
	methods: {
		formatRichText(html) {
			//控制小程序中图片大小
			let newContent = html.replace(/<img[^>]*>/gi, function(match, capture) {
				console.log(match.search(/style=/gi));

				if (match.search(/style=/gi) == -1) {
					match = match.replace(/\<img/gi, '<img style=""');
				}
				return match;
			});

			newContent = newContent.replace(/style="/gi, '$& max-width:100% !important; ');
			newContent = newContent.replace(/<br[^>]*\/>/gi, '');
			return newContent;
		}
	}
};
</script>

<style lang="scss" scoped>
.about_mine {
	background-color: #f0f0f0;
	min-height: 100vh;
	font-size: 32upx;
	color: #666;
	.s_phone{
		padding: 26upx;
		background-color: #fff;
		display: flex;
		margin-top: 20upx;
		justify-content: space-between;
	}
	.p10_l {
		margin: 20upx 0;
	}
	.hezuo_img {
		text-align: center;
		padding: 50upx 0;
		background-color: #fff;
		.ab_logo {
			width: 160upx;
			height: 160upx;
		}
	}
	.text_p1 {
		background-color: #fff;
		padding: 20upx 36upx;
		line-height: 80upx;
	}
}
</style>
