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
                    placeholder="登录名"
                    v-decorator="['username',{rules: [{ required: true, message: '请输入用户名!' }]}]"
            />
        </a-form-item>

        <a-form-item
                label="昵称"
                :label-col="{ span: 8 }"
                :wrapper-col="{ span: 8 }"
        >
            <a-input
                    placeholder="展示名"
                    v-decorator="['nickname',{rules: [{ required: true, message: '请输入昵称!' }]}]"
            />
        </a-form-item>

        <a-form-item
                label="密码"
                :label-col="{ span: 8 }"
                :wrapper-col="{ span: 8 }"
        >
            <a-input
                    v-decorator="[
          'password',
          {
            rules: [{
               message: '请输入密码!',
            }, {
              validator: validateToNextPassword,
            }],
          }
        ]"
                    type="password"
                    placeholder="不修改密码则不填"
            />
        </a-form-item>
        <a-form-item
                label="再次输入密码"
                :label-col="{ span: 8 }"
                :wrapper-col="{ span: 8 }"
        >
            <a-input
                    v-decorator="[
          'confirm',
          {
            rules: [{
              message: '请再次输入密码!',
            }, {
              validator: compareToFirstPassword,
            }],
          }
        ]"
                    type="password"
                    @blur="handleConfirmBlur"
                    placeholder="不修改密码则不填"
            />
        </a-form-item>
        <a-form-item
                label="邮箱"
                :label-col="{ span: 8 }"
                :wrapper-col="{ span: 8 }"
        >
            <a-input
                    v-decorator="['email',
                                  {
                                    rules: [{
                                      type: 'email', message: 'E-mail 格式错误!',
                                    }, {
                                      required: true, message: '请输入邮箱!',
                                    }]
                                  }]"
                    placeholder="用于接收战果，务必填写正确"
            />
        </a-form-item>
        <a-form-item
                label="电话"
                :label-col="{ span: 8 }"
                :wrapper-col="{ span: 8 }"
        >
            <a-input
                    v-decorator="['phone',
                                    {
                                        rules: [{validator: phoneValidator},{ required: true, message: '请输入电话!'
                                    }]
                                 }]"
                    placeholder="用于接收战果，务必填写正确"

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
                提交
            </a-button>
        </a-form-item>
    </a-form>
</template>

<script>
    export default {
        name: "Edit",
        data () {
            return {
                thisForm: this.$form.createForm(this),
                btnLoading: false,
                confirmDirty:null,
            };
        },
        created () {
            // 组件创建完后获取数据，
            // 此时 data 已经被 observed 了
            this.fetchData()
        },
        methods: {
            fetchData () {
                // replace getPost with your data fetching util / API wrapper
                this.$axios.get('users/'+this.$route.params.id,{withCredentials: true})
                    .then((response) => {
                        if (response.data.code === 0){
                            let data = response.data.object;
                            console.log(data)
                            this.thisForm.setFieldsValue({
                                username: data.username,
                                nickname: data.nickname,
                                email: data.email,
                                phone: data.phone,
                            });
                        }else{
                            this.showMsg(response.data.message);
                            this.$router.push({name:"commodities"});
                        }
                    })
                    .catch(() => {
                        this.btnLoading = false;
                        this.showMsg("未知错误")
                    });
            },
            showMsg(msg){
                this.$modal.error(({
                    title: '发生错误',
                    content: msg,
                }));
            },
            phoneValidator  (rule, value, callback) {
                if (value.length !== 11) {
                    callback("电话长度必须为 11");
                } else {
                    callback();
                }
            },
            handleSubmit(e) {
                e.preventDefault();
                this.thisForm.validateFields((err, values) => {
                    if (values.phone.length !== 11){
                        this.thisForm
                    }
                    if (!err) {
                        this.btnLoading = true;
                        this.$axios.patch('users/'+this.$store.state.user.id, {
                            "username" : values.username,
                            "nickname" : values.nickname,
                            "password" : ((values.password!=undefined)&&(values.password!=""))?this.$md5(values.password):"",
                            "email" : values.email,
                            "phone" : values.phone,
                        },{withCredentials: true})
                            .then((response) => {
                                this.btnLoading = false;
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
            handleConfirmBlur  (e) {
                const value = e.target.value;
                this.confirmDirty = this.confirmDirty || !!value;
            },
            compareToFirstPassword  (rule, value, callback) {
                const form = this.thisForm;
                if (value && value !== form.getFieldValue('password')) {
                    callback('两次输入的密码不一致!');
                } else {
                    callback();
                }
            },
            validateToNextPassword  (rule, value, callback) {
                const form = this.thisForm;
                if (value && this.confirmDirty) {
                    form.validateFields(['confirm'], { force: true });
                }
                callback();
            },
        }
    }
</script>

<style scoped>

</style>