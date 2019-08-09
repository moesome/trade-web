<template>
    <a-layout id="app">
        <a-layout-sider :collapsed="collapsed" width="200" style="background: #fff">
            <a-menu
                    mode="inline"
                    :defaultSelectedKeys="['1']"
                    :defaultOpenKeys="['']"
                    :style="{ height: '100%', borderRight: 0 }"
            >
                <a-menu-item key="index">
                    <router-link to="/commodities"><a-icon type="shopping-cart"/>秒杀</router-link>
                </a-menu-item>
                <a-menu-item key="order">
                    <router-link to="/orders"><a-icon type="gift"/>战果</router-link>
                </a-menu-item>
                <a-menu-item key="manage">
                    <router-link to="/commodities/manage"><a-icon type="setting"/>管理</router-link>
                </a-menu-item>
                <a-menu-item key="gift">
                    <router-link to="/gift"><a-icon type="gift"/>派奖</router-link>
                </a-menu-item>
                <a-menu-item key="account">
                    <router-link to="/account"><a-icon type="dollar"/>账户</router-link>
                </a-menu-item>
            </a-menu>
        </a-layout-sider>
        <a-layout style="padding: 0 10px 10px">
            <a-layout-header class="header" style="background-color:rgb(145,145,145)">
                <div>
                    <a-row>
                        <a-col :offset="20" :span="4">
                            <a-button v-show="!isLogin" type="dashed" ghost style="margin-right: 30px"><router-link :to="{ name: 'login'}">登录</router-link></a-button>
                            <a-button v-show="!isLogin" type="dashed" ghost><router-link :to="{ name: 'users.create'}">注册</router-link></a-button>
                            <span v-show="isLogin" id="nickname">
                                <a @click="editUser" style="color:black;">{{this.$store.state.user!==null?this.$store.state.user.nickname:""}}</a>
                                <a @click="exit" style="margin-left: 20px;color:white">退出</a>
                            </span>
                        </a-col>
                    </a-row>
                </div>
            </a-layout-header>
            <a-breadcrumb separator="/" style="margin: 5px 15px">
                <a-breadcrumb-item v-show="first">{{first}}</a-breadcrumb-item>
                <a-breadcrumb-item v-show="second">{{second}}</a-breadcrumb-item>
                <a-breadcrumb-item v-show="third">{{third}}</a-breadcrumb-item>
            </a-breadcrumb>
            <a-layout-content :style="{ background: '#fff', padding: '24px', margin: 0, minHeight: '280px' }">
                <router-view/>
            </a-layout-content>
        </a-layout>
    </a-layout>
</template>
<script>
    import Vue from 'vue'
    import { Layout } from 'ant-design-vue';
    Vue.use(Layout);
    import { Row } from 'ant-design-vue';
    Vue.use(Row);
    import { Col } from 'ant-design-vue';
    Vue.use(Col);
    import { Breadcrumb } from 'ant-design-vue';
    Vue.use(Breadcrumb);
    import { Icon } from 'ant-design-vue';
    Vue.use(Icon);
    import { Menu } from 'ant-design-vue';
    Vue.use(Menu);
    import { Button } from 'ant-design-vue';
    Vue.use(Button);
    import { Modal } from 'ant-design-vue';
    Vue.use(Modal);
    import { Form } from 'ant-design-vue';
    Vue.use(Form);
    import { Input } from 'ant-design-vue';
    Vue.use(Input);
    import { DatePicker } from 'ant-design-vue';
    Vue.use(DatePicker);
    import { TimePicker } from 'ant-design-vue';
    Vue.use(TimePicker);
    import { Table } from 'ant-design-vue';
    Vue.use(Table);
    import { InputNumber } from 'ant-design-vue';
    Vue.use(InputNumber);
    import { Card } from 'ant-design-vue';
    Vue.use(Card);

    Vue.prototype.$modal = Modal

    export default {
        name:"layout",
        data(){
            return {
                collapsed: false,
                first: "",
                second: "",
                third: "",
            }
        },
        mounted(){
            this.updateBreadcrumb();
            // 用 cookies 向服务器拉取用户数据存到 vuex 中
            this.$axios.get("users/check",{withCredentials: true})
                .then((response) => {
                    if (response.data.code === 0){
                        //console.log("login");
                        //console.log(response);
                        this.$store.commit("login",response.data.object);
                    }else{
                        this.$router.push({name:"home"});
                    }
                })
                .catch(() => {
                    // 不处理
                });
        },
        updated() {
            this.updateBreadcrumb();
        },
        computed: {
            isLogin () {
                return this.$store.state.isLogin
            }
        },
        methods: {
            editUser(){
                this.$router.push({name:"users.edit",params:{id:this.$store.state.user.id}});
            },
            updateBreadcrumb(){
                let param = this.$route.fullPath.split("/");
                let first = param[1];
                let second = param[2];
                let third = param[3];
                switch (first) {
                    case "commodities":
                        first = "秒杀";
                        break;
                    case "orders":
                        first = "战果";
                        break;
                    case "users":
                        first = "用户";
                        break;
                    case "gift":
                        first = "派奖";
                        break;
                    case "account":
                        first = "账户";
                        break;
                }
                switch (second) {
                    case "index":
                        second = "总览";
                        break;
                    case "login":
                        second = "登录";
                        break;
                    case "manage":
                        second = "管理";
                        break;
                    case "create":
                        second = "新增";
                        break;
                }
                switch (third) {
                    case "edit":
                        third = "修改";
                        break;
                }
                this.first = first;
                this.second = second;
                this.third = third;
            },
            exit(){
                this.$axios.post("users/logout",{},{withCredentials: true})
                    .then((response) => {
                        if (response.data.code === 0){
                            this.$store.commit("logout");
                        }
                    })
                    .catch(function () {
                        // 不处理
                    });
            },
            showWrongMsg(msg){
                this.$modal.error(({
                    title: '发生错误',
                    content: msg,
                }));
            },
        }
    }
</script>


<style scoped>
    #app{
        min-height:100%;
    }
    #nickname{
        font-size: 20px;
    }
</style>
