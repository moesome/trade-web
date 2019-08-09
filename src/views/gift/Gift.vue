<template>
    <div>
        <a-modal
                title="收货人信息"
                :visible="visible"
                @ok="handleOk"
                :confirmLoading="confirmLoading"
                @cancel="handleCancel"
        >
            <p>收货人邮箱：{{email}}</p>
            <p>收货人电话：{{phone}}</p>
            <template slot="footer">
                <a-button key="back" @click="handleCancel">以后再发</a-button>
                <a-button key="submit" type="primary" :loading="loading" @click="handleOk">我已发货</a-button>
            </template>
        </a-modal>
        <a-table
                :columns="columns"
                :dataSource="data"
                :loading="loading"
                :pagination="pagination"
                @change="handleTableChange"
        >
            <a-button :loading="record.loading"  type="primary" ghost slot="action" href="javascript:;" slot-scope="record" @click="send(record)">发货</a-button>
        </a-table>
    </div>
</template>

<script>
    const columns = [
        { title: '订单号', sorter: true,width: '20%',dataIndex: 'id', key: 'id' },
        { title: '收货人', width: '20%',dataIndex: 'receive_name', key: 'receive_name' },
        { title: '商品名称',width: '20%', dataIndex: 'name', key: 'name' },
        { title: '订单创建时间', width: '20%',dataIndex: 'createdAt', key: 'createdAt' },
        { title: '订单状态', width: '10%',dataIndex: 'status', key: 'status' },
        { title: '发货', width: '10%',dataIndex: '', key: 'send', scopedSlots: { customRender: 'action' } },
    ];

    export default {
        name: "Gift.vue",
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
                email: '',
                phone: '',
                visible: false,
                confirmLoading: false,
                record:null,
            }
        },
        methods:{
            handleOk() {
                this.visible = false;
                this.confirmLoading = false;
                this.$axios.patch('sends/'+this.record.id,{
                    },
                    {withCredentials: true}
                ).then((response) => {
                    if (response.data.code === 0){
                        this.showSuccessMsg("已发货！")
                        this.record.status = "已发货"
                    }else{
                        this.showWrongMsg(response.data.message);
                    }
                    this.record = null;
                }).catch(function (e) {
                    this.record = null;
                    //console.log(e)
                });
            },
            handleCancel() {
                this.record = null;
                this.visible = false
            },
            send(record){
                this.visible = true
                this.email = record.email;
                this.phone = record.phone;
                this.record = record
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

                this.$axios.get('sends?page='+page+"&order="+params.sortOrder,{withCredentials: true}
                ).then((response) => {
                    //console.log("index:")
                    //console.log(response)
                    const pagination = { ...this.pagination };
                    pagination.total = response.data.count;
                    this.loading = false;
                    let list = response.data.object;
                    let newList = [];
                    let pos = 0;
                    for (let i = 0;i < list.length;i++) {
                        let item = list[i];
                        if (item.username === null){
                            continue;
                        }
                        item.key = item.spikeOrderId;
                        item.id = item.spikeOrderId;
                        item.receive_name = item.username;
                        item.createdAt = this.$dateFormat(item.createdAt).toLocaleString();

                        /*
                        *         { title: '订单号', sorter: true,width: '10%',dataIndex: 'id', key: 'id' },
                                    { title: '收货人', width: '20%',dataIndex: 'receive_name', key: 'receive_name' },
                                    { title: '商品名称',width: '20%', dataIndex: 'name', key: 'name' },
                                    { title: '描述', width: '20%',dataIndex: 'detail', key: 'detail' },
                                    { title: '创建时间', width: '20%',dataIndex: 'createdAt', key: 'createdAt' },
                                    { title: '发货', width: '10%',dataIndex: '', key: 'send', scopedSlots: { customRender: 'action' } },
                            */
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
                        newList[pos++] = item;
                    }
                    this.data = newList;
                    this.pagination = pagination;
                }).catch(function (e) {
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