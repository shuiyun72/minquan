
import Vue from 'vue';
import store from '../store';
// let apiUrl = "http://39.100.62.29:9922";
let apiUrl = 'https://minquan.fatediy.cn';
import './lodash';
Vue.prototype.$apiUrl = apiUrl;
// import Qs from "qs";
Vue.prototype.$getApi = function(url, data, callsuc, token,err) {
	// url = 'System/Login?loginContent=admin&password=123456'
	token = token == "false" ? false : true;
	data = data ? data : {};
	// console.log("token", token);
	let userInfo = uni.getStorageSync('userInfo');
	if (token && userInfo) {
		data.token = userInfo.token;
		// data.page = 1;
		// data.paginate = 200;
	}
	// console.log("data", data)
	// uni.showLoading({
	//     title: '加载中'
	// });
	uni.request({
		url: apiUrl + url,
		method: 'post',
		data: data,
		header: {
			'content-type': 'application/x-www-form-urlencoded'
		},
		success: (res) => {
			// uni.hideLoading();
			console.log(res)
			if (res.data.code == 1) {
				callsuc instanceof Function && callsuc(res.data)
			} else
			if (res.data.code == 0) {
				this.$msg(res.data.msg)
				return false
			} else
			if (res.data.code == 401) {
				this.$msg("请重新登录")
				// #ifndef MP
					this.$store.commit("logout");
					uni.reLaunch({
						url: '../login/login',
						success(){
							// location.reload()
						} 
					})
				// #endif
				// #ifdef MP
					this.$store.commit("logout");
					setTimeout(()=>{
						uni.reLaunch({
							url: '../home/home',
							success(){
								// location.reload() 
							}
						})
					},1000)
				// #endif
			} 
		},
		fail: (err) => {
			this.$msg("网络请求出错")
		}
	});
}
Vue.prototype.$store = store;

const msg = (title, duration = 1500, mask = false, icon = 'none') => {
	//统一提示方便全局修改
	title = title || "请输入完整信息";
	uni.showToast({
		title,
		duration,
		mask,
		icon
	});
}
Vue.prototype.$msg = msg;

const getDate = (myDate,type,timec) => {
	if(!myDate){
		myDate = new Date()
	}else{
		if(timec == "c"){
			myDate = new Date(parseInt(myDate) * 1000)
		}else{
			myDate = new Date(myDate)
		}
	}
	let year = myDate.getFullYear();   //获取系统的年；
	let month = myDate.getMonth()+1;   //获取系统月份，由于月份是从0开始计算，所以要加1
	
	let date = myDate.getDate(); // 获取系统日，
	
	let hours = myDate.getHours(); //获取系统时，
	let min = myDate.getMinutes(); //分
	let sec = myDate.getSeconds(); //秒
	if(month<10){ month = "0"+month}
	if(date<10){ date = "0"+date }
	if(hours<10){ hours = "0"+hours}
	if(min<10){ min = "0"+min}
	if(sec<10){ sec = "0"+sec }
	
	if(type == '月-号'){
		return month+'月'+date+'号'
	}else
	if(type == '年-月-日'){
		return year+'年'+month+'月'+date+'日'
	}else
	if(type == 's-s-s'){
		return year+'-'+month+'-'+date
	}else
	if(type == 's:s:s'){
		return hours+':'+min+':'+sec
	}else
	if(type == 's-s-s s:s:s'){
		return year+'-'+month+'-'+date+" "+hours+':'+min+':'+sec
	}else{
		return year+'-'+month+'-'+date+" "+hours+':'+min+':'+sec
	}
}
Vue.prototype.$getDate = getDate;
const lastDate = (myDate,type) => {
	var date = new Date();
	var now = date.getTime();
	var str= myDate;
	var endDate = new Date(str);
	var end = endDate.getTime();
	var leftTime = end-now; 
	var d,h,m,s;
	d = Math.floor(leftTime/1000/60/60/24);
	h = Math.floor(leftTime/1000/60/60%24);  
	m = Math.floor(leftTime/1000/60%60);  
	s = Math.floor(leftTime/1000%60);
	if(d<10){ d = "0"+d}
	if(h<10){ h = "0"+h}
	if(m<10){ m = "0"+m}
	if(s<10){ s = "0"+s}
	if (leftTime>=0) {  
		if(type == 'd-s:s:s'){
			return d+"天" +h+":"+m+":"+s
		}else{
			return h+":"+m+":"+s
		}
	} else{
		return "00:00:00"
	}
}
Vue.prototype.$lastDate = lastDate;
const HaveFen= (myDate,type) => {
	console.log(myDate)
	let dateDay = getDate(new Date(),"s-s-s")
	let date = getDate(new Date(),"s:s:s")
	let chaTime = new Date(dateDay+" "+myDate+":00").getTime() - new Date().getTime();
	console.log(chaTime)
	if(chaTime > 0){
		var leave1=chaTime%(24*3600*1000)
		var hours=Math.floor(leave1/(3600*1000))
		console.log(hours)
		var leave2=leave1%(3600*1000)    //计算小时数后剩余的毫秒数 
		var minutes=Math.floor(leave2/(60*1000))
		minutes = minutes < 10?"0"+minutes:minutes;
		console.log(minutes)
		return hours+":"+ minutes
	}else{
		return "00:00"
	}
	
}
Vue.prototype.$haveFen = HaveFen;

