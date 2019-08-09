<template>
    <a-form
            :form="thisForm"
            @submit="handleSubmit"
    >

        <a-form-item
                label="用户名"
                :label-col="{ span: 8 }"
                :wrapper-col="{ span: 8 }"
        >
            <a-input
                    placeholder="测试账户：1"
                    v-decorator="['username',{rules: [{ required: true, message: '请输入用户名!' }]}]"
            />
        </a-form-item>

        <a-form-item
                label="密码"
                :label-col="{ span: 8 }"
                :wrapper-col="{ span: 8 }"
        >
            <a-input
                    placeholder="测试密码：1"
                    v-decorator="['password',{rules: [{ required: true, message: '请输入密码!' }]}]"
            />
        </a-form-item>
        <a-form-item
                :wrapper-col="{ span: 12, offset: 8}"
        >
            <a-button
                    type="primary"
                    html-type="submit"
                    size = "large"
                    style="width: 30%"
                    :loading="btnLoading"
            >
                登录
            </a-button>

            <a-button
                    type="primary"
                    style="margin-left: 40px;width: 30%"
                    size = "large"
                    @click="register"
            >
                注册
            </a-button>
        </a-form-item>
    </a-form>
</template>

<script>
    export default {
        name: "Login",
        data () {
            return {
                thisForm: this.$form.createForm(this),
                btnLoading: false
            };
        },

        mounted(){
            if (this.$store.state.user !== null) {
                this.$router.push({name:"commodities"});
            }
        },
        methods: {
            register(){
                this.$router.push({name:"users.create"});
            },
            showMsg(msg){
                this.$modal.error(({
                    title: '发生错误',
                    content: msg,
                }));
            },
            handleSubmit(e) {
                e.preventDefault();
                this.thisForm.validateFields((err, values) => {
                    if (!err) {
                        this.btnLoading = true;
                        this.$axios.post('users/login', {
                            "username" : values.username,
                            "password" : this.$md5(values.password),
                            },{withCredentials: true})
                            .then((response) => {
                                this.btnLoading = false;
                                console.log("login success:")
                                console.log(response)
                                if (response.data.code === 0){
                                    this.$router.push({name:"commodities"});
                                    this.$store.commit("login",response.data.object);
                                }else{
                                    this.showMsg(response.data.message);
                                }
                            })
                            .catch(() => {
                                this.btnLoading = false;
                                this.showMsg("未知错误")
                            });
                    }
                });
            },
        }
    }
</script>

<style scoped>

</style>