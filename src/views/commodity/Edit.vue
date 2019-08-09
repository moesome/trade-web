<template>
    <a-form
            :form="thisForm"
            @submit="handleSubmit"
    >

        <a-form-item
                label="名称"
                :label-col="{ span: 8 }"
                :wrapper-col="{ span: 8 }"
        >
            <a-input
                    v-decorator="['name',{rules: [{ required: true, message: '请输入名称!' }]}]"
            />
        </a-form-item>

        <a-form-item
                label="描述"
                :label-col="{ span: 8 }"
                :wrapper-col="{ span: 8 }"
        >
            <a-input
                    v-decorator="['detail',{rules: [{ required: true, message: '请输入描述!' }]}]"
            />
        </a-form-item>
        <a-form-item
                label="库存"
                :label-col="{ span: 8 }"
                :wrapper-col="{ span: 8 }"
        >
            <a-input-number
                    :min="0" :max="2147483647"
                    v-decorator="['stock',{rules: [{ required: true, message: '请输入库存!' }]}]"
            />
        </a-form-item>
        <a-form-item
                label="售价"
                :label-col="{ span: 8 }"
                :wrapper-col="{ span: 8 }"
        >
            <a-input-number
                    :min="0" :max="999999.99"
                    v-decorator="['price',{rules: [{ required: true, message: '请输入售价!' }]}]"
            />
        </a-form-item>
        <a-form-item
                label="开始时间"
                :label-col="{ span: 8 }"
                :wrapper-col="{ span: 8 }"
        >
            <a-input
                    v-decorator="['startAt',{rules: [{ required: true, message: '请输入开始时间!' }]}]"
            />
        </a-form-item>
        <a-form-item
                label="结束时间"
                :label-col="{ span: 8 }"
                :wrapper-col="{ span: 8 }"
                v-decorator="['endAt',{rules: [{ required: true, message: '请输入密码!' }]}]"
        >
            <a-input
                    v-decorator="['endAt',{rules: [{ required: true, message: '请输入结束时间!' }]}]"
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
        data () {
            return {
                thisForm: this.$form.createForm(this),
                btnLoading: false,
            };
        },
        created () {
            if (this.$store.state.isLogin === false) {
                this.$router.push({name:"login"});
            }
            // 组件创建完后获取数据，
            // 此时 data 已经被 observed 了
            this.fetchData()
        },
        watch: {
            // 如果路由有变化，会再次执行该方法
            '$route': 'fetchData'
        },
        methods: {
            fetchData () {
                // replace getPost with your data fetching util / API wrapper
                this.$axios.get('commodities/'+this.$route.params.id,{withCredentials: true})
                    .then((response) => {
                        if (response.data.code === 0){
                            let data = response.data.object[0];
                            //console.log(data)
                            this.thisForm.setFieldsValue({
                                name: data.name,
                                detail: data.detail,
                                stock: data.stock,
                                startAt: data.startAt,
                                endAt: data.endAt,
                                price: data.price,
                            });
                        }else{
                            this.showMsg(response.data.message);
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
            handleSubmit(e) {
                e.preventDefault();
                this.thisForm.validateFields((err, values) => {
                    if (!err) {
                        this.btnLoading = true;
                        let re = /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9]/;
                        if (!re.test(values.startAt) || !re.test(values.endAt)){
                            this.showMsg("日期格式错误！");
                            this.btnLoading = false;
                            return;
                        }
                        if (values.startAt.match(""))
                        this.$axios.patch('commodities/'+this.$route.params.id, {
                            "name" : values.name,
                            "detail" : values.detail,
                            "stock" : values.stock,
                            "startAt" : values.startAt,
                            "endAt" : values.endAt,
                            "price" : values.price,
                        },{withCredentials: true})
                            .then((response) => {
                                this.btnLoading = false;
                                //console.log("login success:");
                                //console.log(response);
                                if (response.data.code === 0){
                                    this.$router.push({name:"commodities.manage"});
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