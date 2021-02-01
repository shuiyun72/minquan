import Vue from 'vue'
import Vuex from 'vuex'
import _ from "../until/lodash"
Vue.use(Vuex)
console.log(uni.getStorageSync("userInfo"))
let hasLogin = (uni.getStorageSync("userInfo") && uni.getStorageSync("userInfo").id) ? true : false;
let shopCar = uni.getStorageSync("shopCar") ? uni.getStorageSync("shopCar") : [];
console.log("111", hasLogin)
const store = new Vuex.Store({
	state: {
		hasLogin: hasLogin,
		userInfo: uni.getStorageSync("userInfo") || undefined,
		httpp: "https://minquan.fatediy.cn",
		selCity: "郑州",
		location:{
			name:"",
			address:"选择定位"
		},
		back: 1,
		SystemInfo: "",
		shopCar: shopCar,
		itemHg:"",
		classify:"",
		address:""
	},
	mutations: {
		login(state, provider) {
			console.log("change login")
			state.hasLogin = true;
			state.userInfo = provider;
			uni.setStorage({ //缓存用户登陆状态
				key: 'userInfo',
				data: provider
			})
		},
		setAddress(state,item){
			state.address = item
		},
		setItemHg(state,item){
			state.itemHg = item
			console.log(item,"37hang")
		},
		setClassify(state,item){
			state.classify = item
		},
		setLocation(state,item){
			state.location = item
		},
		delCar(state,items){
			state.shopCar = _.filter(items,fil=>{
				return fil.sel == 0
			})
			uni.setStorageSync('shopCar',state.shopCar)
		},
		setCar(state,items){
			console.log(items)
			state.shopCar = items;
			uni.setStorageSync('shopCar',state.shopCar)
		},
		jiaCar(state,item) {
			console.log("我是加")
			let thisIndex = _.filter(state.shopCar,fil=>{
				return fil.id == item.id
			})
			if(thisIndex.length == 0){
				state.shopCar.push(item)	
			}else{
				let index = _.findIndex(state.shopCar,thisIndex[0]);
				console.log(index,"34")
				state.shopCar[index].number = item.number;
			}
			_.uniq(state.shopCar);
			console.log(state.shopCar)
			uni.setStorageSync('shopCar',state.shopCar)
		},
		jianCar(state,item) {
			console.log("我是减")
			let thisIndex = _.filter(state.shopCar,fil=>{
				return fil.id == item.id
			})
			let index = _.findIndex(state.shopCar,thisIndex[0]);
			if(item.number == 0){
				state.shopCar.splice(index,1)
			}else{
				state.shopCar[index].number = item.number;
			}
			
			console.log(index,"51")
			_.uniq(state.shopCar);
			uni.setStorageSync('shopCar',state.shopCar)
		},
		logout(state) {
			state.hasLogin = false;
			state.userInfo = {};
			uni.removeStorage({
				key: 'userInfo'
			})
		},
		setCity(state, data) {
			state.selCity = data;
			uni.setStorageSync('carBrand', data);
		},
		setSystemInfo(state, el) {
			state.SystemInfo = el;
		},
	},
	actions: {

	}
})

export default store
