<template>
    <a-table
            :columns="columns"
            :dataSource="data"
            :loading="loading"
            :pagination="pagination"
            @change="handleTableChange"
    >
        <a-button :loading="record.loading" v-if="record.commodityOrderStatus === '待发货'" type="primary" ghost slot="action" href="javascript:;" slot-scope="record" @click="get(record)">提醒发货</a-button>
        <a-button :loading="record.loading" v-else-if="record.commodityOrderStatus === '所有者已发送奖品'" type="primary" ghost slot="action" href="javascript:;" slot-scope="record" @click="received(record)">确认收货</a-button>
    </a-table>
</template>

<script>
    const columns = [
        { title: 'ID', sorter: true,width: '10%',dataIndex: 'commodityOrderId', key: 'commodityOrderId' },
        { title: '名称',width: '10%', dataIndex: 'commodityName', key: 'commodityName' },
        { title: '描述', width: '30%',dataIndex: 'commodityDetail', key: 'commodityDetail' },
        { title: '创建时间', width: '20%',dataIndex: 'commodityOrderCreatedAt', key: 'commodityOrderCreatedAt' },
        { title: '状态', width: '20%',dataIndex: 'commodityOrderStatus', key: 'commodityOrderStatus' },
        { title: '获取奖励', width: '10%',dataIndex: '', key: 'get', scopedSlots: { customRender: 'action' } },
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
                let commodityOrderId = record.id;
                console.log(commodityOrderId)
                this.$axios.patch('commodity_orders/sends/remind/'+commodityOrderId,{},{withCredentials: true}
                ).then((response) => {
                    if (response.data.code === 0){
                        this.showSuccessMsg("已提醒项目发起者发货！")
                        record.commodityOrderStatus = "已申请兑奖"
                    }else{
                        this.showWrongMsg(response.data.message);
                    }
                }).catch(function () {
                    //console.log(e)
                });

            },
            received(record){
                let commodityOrderId = record.id;
                console.log(commodityOrderId)
                this.$axios.patch('commodity_orders/sends/received/'+commodityOrderId,{},{withCredentials: true}
                ).then((response) => {
                    if (response.data.code === 0){
                        record.commodityOrderStatus = "已收货"
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
                this.$axios.get('commodity_orders?page='+page+"&order="+params.sortOrder,{withCredentials: true}
                ).then((response) => {
                    //console.log("index:")
                    //console.log(response)
                    const pagination = { ...this.pagination };
                    pagination.total = response.data.count;
                    this.loading = false;
                    let list = response.data.object;
                    for (let i = 0;i < list.length;i++) {
                        let item = list[i];
                        item.key = item.commodityOrderId;
                        item.id = item.commodityOrderId;
                        item.name = item.commodityName;
                        item.createdAt = this.$dateFormat(item.commodityOrderCreatedAt).toLocaleString();
                        /**
                         *
                         *
                         */
                        if (item.commodityOrderStatus < 10 && item.commodityOrderStatus > 0){
                            item.commodityOrderStatus = "处理中"
                        }else{
                            switch (item.commodityOrderStatus) {
                                case 0:
                                    item.commodityOrderStatus = "待发货";
                                    break;
                                case 10:
                                    item.commodityOrderStatus = "已申请兑奖";
                                    break;
                                case 20:
                                    item.commodityOrderStatus = "所有者已发送奖品";
                                    break;
                                case 30:
                                    item.commodityOrderStatus = "完成订单";
                                    break;
                                default:
                                    item.commodityOrderStatus = "订单异常";
                                    break;
                            }
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