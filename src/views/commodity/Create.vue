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
            <a-date-picker v-model="startAtDate" placeholder="选择开始日期"/>
            <a-time-picker format="HH:mm:ss" v-model="startAtTime"  placeholder="选择开始时间" style="margin-left: 10px"/>
        </a-form-item>
        <a-form-item
                label="结束时间"
                :label-col="{ span: 8 }"
                :wrapper-col="{ span: 8 }"
                v-decorator="['endAt',{rules: [{ required: true, message: '请输入密码!' }]}]"
        >
            <a-date-picker  v-model="endAtDate" placeholder="选择结束日期"/>
            <a-time-picker format="HH:mm:ss" v-model="endAtTime"  placeholder="选择结束时间" style="margin-left: 10px"/>
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
        name: "Add.vue",
        data () {
            return {
                thisForm: this.$form.createForm(this),
                btnLoading: false,
                startAtDate: null,
                endAtDate: null,
                startAtTime: null,
                endAtTime: null,
            };
        },
        mounted(){
            if (this.$store.state.isLogin === false) {
                this.$router.push({name:"login"});
            }
        },
        methods:{
            showMsg(msg){
                this.$modal.error(({
                    title: '发生错误',
                    content: msg,
                }));
            },
            showWrongMsg(msg){
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
                        if (this.startAtTime === null || this.startAtDate === null ||this.endAtDate===null||this.endAtTime===null){
                            this.showWrongMsg("请填写日期！")
                            this.btnLoading = false;
                            return;
                        }
                        let startAt = this.startAtDate.format("YYYY-MM-DD") +" "+ this.startAtTime.format("HH:mm:ss");
                        let endAt = this.endAtDate.format("YYYY-MM-DD") +" "+ this.endAtTime.format("HH:mm:ss");

                        this.$axios.post('commodities', {
                            "name" : values.name,
                            "detail" : values.detail,
                            "stock" : values.stock,
                            "startAt" : startAt,
                            "endAt" : endAt,
                            "price" : values.price,
                        },{withCredentials: true})
                            .then((response) => {
                                this.btnLoading = false;
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



