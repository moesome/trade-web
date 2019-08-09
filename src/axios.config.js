import Vue from 'vue'
import axios from 'axios'
import md5 from 'blueimp-md5'

axios.defaults.baseURL = "http://api.moesome.com"
Vue.prototype.$axios = axios;
Vue.prototype.$md5 = md5;
