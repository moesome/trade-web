<template>
    <div>
        <a-row justify="space-around">
            <a-col :offset="8" :span="6">
                <div style="background:#ECECEC; padding:10px">
                    <a-card title="余额" :bordered="false">
                        <a-row type="flex" justify="space-around">
                            <a-col style="font-size: 30px;margin: 0">
                                {{this.$store.state.user!=null?this.$store.state.user.coin:""}}
                                <!--<a href="#"><a-icon type="reload" style="font-size: 27px;"/></a>-->
                            </a-col>
                        </a-row>
                        <template class="ant-card-actions" slot="actions">
                            <span @click="recharge"><a-icon type="plus"/> 充值</span>
                        </template>
                    </a-card>
                </div>
            </a-col>
        </a-row>
        <a-modal
                title="Title"
                :visible="visible"
                @ok="handleOk"
                :confirmLoading="confirmLoading"
                @cancel="handleCancel"
        >
            请输入充值金额：<a-input-number
                    :min="0.01" :max="999999.99" v-model="amount"
            />
        </a-modal>
    </div>
</template>

<script>
    export default {
        name: "Recharge",
        data() {
            return {
                visible: false,
                confirmLoading: false,
                amount:1.00
            }
        },
        mounted(){
            this.$axios.get("users/"+this.$store.state.user.id,{withCredentials: true})
                .then((response) => {
                    if (response.data.code === 0){
                        this.$store.commit("login",response.data.object);
                    }else{
                        this.$router.push({name:"home"});
                    }
                })
                .catch(() => {
                    // 不处理
                });
        },
        methods:{
            recharge(){
                this.showModal();
            },
            showModal() {
                this.visible = true
            },
            handleOk() {
                this.confirmLoading = true;
                window.location="https://api.moesome.com/recharge/"+this.amount;
            },
            handleCancel() {
                this.visible = false
            },
            showMsg(msg){
                this.$modal.error(({
                    title: '发生错误',
                    content: msg,
                }));
            },
        }
    }
</script>

<style scoped>

</style>