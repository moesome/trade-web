<template>
    <div>
        <a-row justify="space-around">
            <a-col :offset="5" :span="14">
                <div style="background:#ECECEC; padding:10px">
                    <a-card :bordered="false">
                        <template slot="title">
                            <a-row type="flex" justify="space-between">
                                <a-col style="font-size: 20px;margin: 0">
                                    {{data.name}}
                                </a-col>
                                <a-col style="font-size: 10px;margin: 0">
                                    <a @click="reload"><a-icon :spin="onload" type="reload" style="font-size: 25px;"/></a>
                                </a-col>
                            </a-row>
                        </template>
                        <a-row>
                            <a-col style="font-size: 30px;margin: 0">
                                {{data.detail}}
                                <!--<a href="#"><a-icon type="reload" style="font-size: 27px;"/></a>-->
                            </a-col>
                        </a-row>
                        <a-row style="margin-top: 20px">
                            <a-col style="font-size: 16px;margin: 0">
                                售价：{{data.price}}
                                <!--<a href="#"><a-icon type="reload" style="font-size: 27px;"/></a>-->
                            </a-col>
                        </a-row>
                        <a-row style="margin-top: 10px">
                            <a-col style="font-size: 16px;margin: 0">
                                余量：{{data.stock}}
                                <!--<a href="#"><a-icon type="reload" style="font-size: 27px;"/></a>-->
                            </a-col>
                        </a-row>
                        <a-row style="margin-top: 10px">
                            <a-col style="font-size: 16px;margin: 0">
                                秒杀时间段：{{data.startAt}} ~ {{data.endAt}}
                                <!--<a href="#"><a-icon type="reload" style="font-size: 27px;"/></a>-->
                            </a-col>
                        </a-row>
                        <template class="ant-card-actions" slot="actions">
                            <div v-if="(data.remain === '已结束')">已结束</div>
                            <div v-else-if="(data.stock <= 0)">已售空</div>
                            <div v-else-if="data.remain !== undefined?data.remain.startsWith('距离开始还有'):false">{{data.remain}}</div>
                            <div v-else @click="spike(data)">购买</div>
                        </template>
                    </a-card>
                </div>
            </a-col>
        </a-row>
    </div>
</template>

<script>
    export default {
        name: "Detail",
        data () {
            return {
                data:{},
                loading: false,
                timer: null,  // 定时器名称
                onload: false,
            };
        },
        mounted() {
            this.fetchData(this.$route.params.id);
        },
        methods: {
            reload(){
                this.onload = true;
                this.fetchData(this.$route.params.id);
            },
            check(record){
                this.$axios.get("spike_orders/check/"+record.id,{withCredentials: true})
                    .then((response) => {
                        //console.log(response);
                        let data = response.data;
                        if (data.code === 0){
                            // 秒杀成功
                            record.loading = false;
                            clearInterval(this.timer);
                            this.timer = null;
                            record.stock--;
                            this.showSuccessMsg("秒杀成功！")
                        }else if (data.code === -513) {
                            record.loading = false;
                            clearInterval(this.timer);
                            this.timer = null;
                            this.showWrongMsg(data.message)
                        }
                    })
                    .catch(function () {
                        //console.log(e)
                    });
            },
            spike(record){
                let me = this;
                this.$modal.confirm({
                    title: '您即将秒杀商品： '+record.name,
                    content: '此操作将扣除您 '+record.price+' 个金币是否继续？',
                    onOk() {
                        if (me.$store.state.user.coin >= record.price){
                            me.doSpike(record)
                        } else {
                            me.showWrongMsg("没有足够金币")
                        }
                    },
                    onCancel() {},
                });
            },
            doSpike(record){
                //console.log(record.id)
                if (this.$store.state.isLogin === false) {
                    this.$router.push({name:"login"});
                }else{
                    record.loading = true;
                    this.$axios.patch("spike_orders",{"spikeId":record.id},{withCredentials: true})
                        .then((response) => {
                            let data = response.data;
                            if (data.code === 0){
                                this.showSuccessMsg("排队中...");
                                setTimeout(()=>{
                                    this.timer = setInterval(() => {
                                        // 某些操作
                                        this.check(record);
                                    }, 50)
                                },50)
                            }else{
                                record.loading = false;
                                this.showWrongMsg(data.message)
                            }
                        })
                        .catch(() => {
                            record.loading = false;
                        });
                }
            },
            fetchData (id) {
                // replace getPost with your data fetching util / API wrapper
                this.$axios.get('commodities/detail/'+id,{withCredentials: true})
                    .then((response) => {
                        if (response.data.code === 0){
                            let item = response.data.object[0];
                            let now = response.data.now;
                            item.key = item.id;
                            now = this.$dateFormat(now);
                            let startAt = this.$dateFormat(item.startAt);
                            let endAt = this.$dateFormat(item.endAt);
                            let remainStamp = endAt - now;
                            if (remainStamp < 0){
                                item.remain = "已结束";
                            }else{
                                let beforeStamp = startAt - now;
                                if (beforeStamp > 0){
                                    item.remain = "距离开始还有："+this.$convertTimestampToString(beforeStamp);
                                }else{
                                    item.remain = this.$convertTimestampToString(remainStamp);
                                }
                            }
                            this.data = item;
                        }else{
                            this.showMsg(response.data.message);
                        }
                    })
                    .catch(() => {
                        this.showMsg("未知错误")
                    }).finally(()=>{
                        setTimeout(() => {
                            this.onload = false;
                        },1000)
                    });
            },
            showWrongMsg(msg){
                this.$modal.error(({
                    title: '发生错误',
                    content: msg,
                }));
            },
            showSuccessMsg(msg){
                this.$modal.success(({
                    title: '成功',
                    content: msg,
                }));
            },
        }
    }
</script>

<style scoped>

</style>