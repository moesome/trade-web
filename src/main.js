import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

import './axios.config.js';

Vue.prototype.$dateFormat = function (dateString){
    let subStr = dateString.split(" ");
    let ymd = subStr[0].split("-");
    let hms = subStr[1].split(":");
    let date = new Date();
    date.setFullYear(ymd[0]);
    date.setMonth(ymd[1] - 1);
    date.setDate(ymd[2]);
    date.setHours(hms[0]);
    date.setMinutes(hms[1]);
    date.setSeconds(hms[2]);
    return date;
}

Vue.prototype.$convertTimestampToString = function(usedTime){
    let days=Math.floor(usedTime/(24*3600*1000));
    //计算出小时数
    let leave1=usedTime%(24*3600*1000);    //计算天数后剩余的毫秒数
    let hours=Math.floor(leave1/(3600*1000));
    //计算相差分钟数
    let leave2=leave1%(3600*1000);        //计算小时数后剩余的毫秒数
    let minutes=Math.floor(leave2/(60*1000));
    //let seconds=Math.floor(leave3/1000);
    let time = days + " 天 "+hours+" 时 "+minutes+" 分 ";
    return time;
}

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
