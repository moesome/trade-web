<template>
    <a-table
            :columns="columns"
            :dataSource="data"
            :loading="loading"
            :pagination="pagination"
            @change="handleTableChange"
    >
        <a-button :loading="record.loading" v-if="record.status === '待发货'" type="primary" ghost slot="action" href="javascript:;" slot-scope="record" @click="get(record)">提醒发货</a-button>
        <a-button :loading="record.loading" v-else-if="record.status === '所有者已发送奖品'" type="primary" ghost slot="action" href="javascript:;" slot-scope="record" @click="received(record)">确认收货</a-button>
    </a-table>
</template>

<script>
    const columns = [
        { title: 'ID', sorter: true,width: '10%',dataIndex: 'id', key: 'id' },
        { title: '名称',width: '10%', dataIndex: 'name', key: 'name' },
        { title: '描述', width: '30%',dataIndex: 'detail', key: 'detail' },
        { title: '创建时间', width: '20%',dataIndex: 'createdAt', key: 'createdAt' },
        { title: '状态', width: '20%',dataIndex: 'status', key: 'status' },
        { title: '获取奖励', width: '10%',dataIndex: '', key: 'spike', scopedSlots: { customRender: 'action' } },
    ];
    export default {
        name: "Order.vue",
        mounted() {
            if (this.$store.state.isLogin === false) {
                this.$router.push({name:"login"});
            }
            this.fetch();
        },
        data() {
            return {
                data:[],
                columns,
                selectedRowKeys: [],
                pagination: {},
                loading: false,
            }
        },
        methods:{
            get(record){
                let spikeOrderId = record.id;
                this.$axios.patch('sends/remind/'+spikeOrderId,{},{withCredentials: true}
                ).then((response) => {
                    if (response.data.code === 0){
                        this.showSuccessMsg("已提醒项目发起者发货！")
                        record.status = "已申请兑奖"
                    }else{
                        this.showWrongMsg(response.data.message);
                    }
                }).catch(function () {
                    //console.log(e)
                });

            },
            received(record){
                let spikeOrderId = record.id;
                this.$axios.patch('sends/received/'+spikeOrderId,{},{withCredentials: true}
                ).then((response) => {
                    if (response.data.code === 0){
                        record.status = "已收货"
                    }else{
                        this.showWrongMsg(response.data.message);
                    }
                }).catch(function () {
                    //console.log(e)
                });
            },
            handleTableChange (pagination, filters, sorter) {
                //console.log(pagination);
                //console.log(filters);
                //console.log(sorter);
                const pager = { ...this.pagination };
                pager.current = pagination.current;
                this.pagination = pager;
                this.fetch({
                    results: pagination.pageSize,
                    page: pagination.current,
                    sortField: sorter.field,
                    sortOrder: sorter.order,
                    ...filters,
                });
            },
            fetch (params = {}) {
                this.loading = true
                let page;
                if (params.page === undefined){
                    page = 1;
                }else{
                    page = params.page;
                }
                if (params.sortOrder === undefined){
                    params.sortOrder = 'descend'
                }
                this.$axios.get('spike_orders?page='+page+"&order="+params.sortOrder,{withCredentials: true}
                ).then((response) => {
                    //console.log("index:")
                    //console.log(response)
                    const pagination = { ...this.pagination };
                    pagination.total = response.data.count;
                    this.loading = false;
                    let list = response.data.object;
                    for (let i = 0;i < list.length;i++) {
                        let item = list[i];
                        item.key = item.spikeOrderId;
                        item.id = item.spikeOrderId;
                        item.name = item.spikeName;
                        item.createdAt = this.$dateFormat(item.spikeOrderCreatedAt).toLocaleString();
                        /**
                         *   1.待发货
                         2.用户催单
                         3.所有者已发送奖品
                         4.完成订单
                         5.订单异常
                         */
                        switch (item.status) {
                            case 1:
                                item.status = "待发货";
                                break;
                            case 2:
                                item.status = "用户催单";
                                break;
                            case 3:
                                item.status = "所有者已发送奖品";
                                break;
                            case 4:
                                item.status = "完成订单";
                                break;
                            case 5:
                                item.status = "订单异常";
                                break;
                        }
                        item.loading = false;
                    }
                    this.data = list;
                    this.pagination = pagination;
                }).catch(function () {
                    //console.log(e)
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