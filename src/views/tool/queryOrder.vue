<template>
    <div>
        <Row :gutter="16">
            <Col span="12">
                <Row :gutter="16">
                    <Col span="12">
                        <Input v-model="current.env" >
                        <Select v-model="current.env" slot="prepend" prefix="ios-home"  placeholder="选择环境" style="width:120px">
                            <Option v-for="(d,k) in tools_env" :value="d.url" :key="k">{{ d.name }}</Option>
                        </Select>
                        </Input>
                    </Col>
                    <Col span="12">
                        <Cascader :data="database" v-model="current.query_table"  trigger="hover"></Cascader>
                    </Col>
                </Row>
            </Col>
            <Col v-if="current.query_table[0] == 'order_center' && current.query_table[1] == 't_order_state'" span="6">
                <Input v-model="current.offerid" >

                    <Select slot="prepend" placeholder="OfferID" style="width:100px" not-found-text="请输入OfferID">

                    </Select>
                </Input>
            </Col>

            <Col v-if="current.query_table[0] == 'order_center' && current.query_table[1] == 't_order_refund'"  span="6">
                <Input v-model="current.query_value">
                    <Select v-model="current.query_field" slot="prepend" placeholder="查询条件" style="width:100px" not-found-text="请选择查询条件">
                        <Option value="FRefundId">midas退款单号</Option>
                        <Option value="FChannelRefundId">渠道退款单号</Option>

                    </Select>
                </Input>
            </Col>

            <Col v-if="current.query_table[0] == 'order_center' && current.query_table[1] == 't_order_withdraw'"  span="6">
                <Input v-model="current.query_value">
                    <Select v-model="current.query_field" slot="prepend" placeholder="查询条件" style="width:100px" not-found-text="请选择查询条件">
                        <Option value="FWithdrawId">提现单号</Option>
                    </Select>
                </Input>
            </Col>

            <Col v-if="current.query_table[0] == 'db_sett'"  span="8">
                <Input v-model="current.query_value">
                    <Select v-model="current.query_field" slot="prepend" placeholder="查询条件" style="width:150px" not-found-text="请选择查询条件">
                        <Option value="outer_order_no">外部订单号</Option>
                        <Option value="inner_channelorderid">内部渠道单号</Option>
                        <Option value="inner_order_no">内部订单号</Option>
                        <Option value="channelexternalorderid">外部渠道订单号</Option>
                    </Select>
                </Input>
            </Col>

            <Col v-if="current.query_table[0] != 'db_sett' && current.query_table[1] != 't_order_refund' && current.query_table[1] != 't_order_withdraw'"  span="6">
                <Input v-model="current.orderid">
                    <Select slot="prepend" placeholder="订单号" style="width:100px" not-found-text="请输入订单号">

                    </Select>
                </Input>
            </Col>

        </Row>

        <div>
        <option-block>
            <FormItem>
                <Button type="primary" @click="handle();">查询</Button>
                <Button type="dashed" style="margin-left: 16px" @click="clear();">清除缓存</Button>
            </FormItem>
        </option-block>
        </div>

        <div>
            <!-- 过度动画 -->
            <Spin fix v-if="loadShow">
                <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                <div>Loading</div>
            </Spin>
            <!--结果展示-->
            <!--<Tabs style="margin-bottom: 16px">-->
                <!--&lt;!&ndash;标签页: order_center、 sync_order_center、 wechat_channel&ndash;&gt;-->
                <!--<TabPane :label="index" :key="index" v-for="(res, index) in current.result.database">-->
                    <!--<div :label="index"  :key="table" v-for="(table_data, table) in res">-->
                        <!--<h3>{{table}}</h3>-->
                        <!--<div slot="content">-->
                            <!--<i-table v-if="table==='t_order_refund'" border :columns="t_order_refund_columns" :data="table_data"></i-table>-->
                            <!--<i-table v-if="table==='t_order_state'" border :columns="t_order_state_columns" content="$parent" @on-row-click="show_row" :data="table_data" ></i-table>-->
                            <!--<i-table v-if="table==='t_order_subinfo'" border :columns="t_order_subinfo_columns" :data="table_data"></i-table>-->
                            <!--<i-table v-if="table==='t_upay_order'" border :columns="t_upay_order_columns" :data="table_data"></i-table>-->
                            <!--<i-table v-if="table==='t_upay_data'" border :columns="t_upay_data_columns" :data="table_data"></i-table>-->
                            <!--<i-table v-if="table==='t_logs'" border :columns="t_logs_columns" :data="table_data"></i-table>-->
                            <!--<i-table v-if="table==='t_logs2'" border :columns="t_logs_columns" :data="table_data"></i-table>-->
                            <!--<i-table v-if="table==='t_ota_detail_water'" border :columns="t_ota_detail_water_columns" :data="table_data"></i-table>-->
                            <!--<i-table v-if="table==='t_order_withdraw'" border :columns="t_order_withdraw_columns" :data="table_data"></i-table>-->
                        <!--</div>-->
                    <!--</div>-->
                    <!--&lt;!&ndash;</div>&ndash;&gt;-->
                <!--</TabPane>-->
            <!--</Tabs>-->

            <Tabs v-if="current.resultflag===true" type="card" closable :active-key="current.query_value">
                <Tab-pane :label="query_index"  :key="query_index" v-for="(query_info, query_index) in current.result2">
                        <Collapse :active-key="query_info.database">

                            <Panel :label="index" :key="index" v-for="(res, index) in query_info.database">
                                {{index}}
                                <div slot="content" key="res" :label="index"  :key="table" v-for="(table_data, table) in res">
                                    <h3>{{table}}</h3>
                                    <i-table v-if="table==='t_order_refund' && table_data!==false" border :columns="t_order_refund_columns" :data="table_data"></i-table>
                                    <i-table v-if="table==='t_order_state' && table_data!==false" border :columns="t_order_state_columns" content="$parent" @on-row-click="show_row" :data="table_data" ></i-table>
                                    <i-table v-if="table==='t_order_subinfo' && table_data!==false" border :columns="t_order_subinfo_columns" :data="table_data"></i-table>
                                    <i-table v-if="table==='t_upay_order' && table_data!==false" border :columns="t_upay_order_columns" :data="table_data"></i-table>
                                    <i-table v-if="table==='t_upay_data' && table_data!==false" border :columns="t_upay_data_columns" :data="table_data"></i-table>
                                    <i-table v-if="table==='t_logs' && table_data!==false" border :columns="t_logs_columns" :data="table_data"></i-table>
                                    <i-table v-if="table==='t_logs2' && table_data!==false" border :columns="t_logs_columns" :data="table_data"></i-table>
                                    <i-table v-if="table==='t_ota_detail_water' && table_data!==false" border :columns="t_ota_detail_water_columns" :data="table_data"></i-table>
                                    <i-table v-if="table==='t_order_withdraw' && table_data!==false" border :columns="t_order_withdraw_columns" :data="table_data"></i-table>
                                </div>
                            </Panel>

                        </Collapse>
                </Tab-pane>
            </Tabs>
        </div>


    </div>   
</template>
<script>
    import axios from 'axios'
    import config from "../../tool/config"

    export default {
        computed: {
            show_result(){
                console.log(this.current);
                return this.current.action;
            }
        },

        created() {



            this.current = Object.assign(this.current, this.$getToolData());
            if(this.current.query_value) {
                this.current.resultflag = true;
            }

            console.log(this.current);
            // console.log(this.current);
            //console.log(config.open_tools_env);
        },
        methods: {
            clear(){
                this.current ={
                        env: '',
                        query_field:'outer_order_no',
                        query_value:'',
                        offerid: '',
                        orderid: '',
                        query_table:['order_center', 't_order_state'],
                        result: [{},],
                        result2:{},
                        resultflag:false
                };
                this.$saveToolData(this.current);
                this.open();
            },
            handle(){
               this.loadShow = true;
                setTimeout(() => {
                    this.loadShow = false
                }, 3000)
                if (this.current.env) {
                    // console.log(this.current);
                    if(!this.current.query_table[0]){
                        this.warning('请选择查询条件');
                        this.loadShow = false;
                        return;
                    }
                    if(!this.current.orderid && !this.current.query_value){
                        this.warning('请输入订单号');
                        this.loadShow = false;
                        return;
                    }
                    this.loadShow = true;
                    let tables = ['t_order_state', 't_upay_order', 't_logs2', 't_logs', 't_upay_data'];
                    if (tables.indexOf(this.current.query_table[1]) !== -1){
                        this.current.query_value = this.current.orderid;
                    }
                    // console.log(this.current);
                    let query_string = `action=${this.current.query_table[0]}&FOfferID=${this.current.offerid}&FOrderID=${this.current.orderid}&database=${this.current.query_table[0]}&table=${this.current.query_table[1]}&query_filed=${this.current.query_field}&query_value=${this.current.query_value}`;
                    let encoded_string=config.simple_encode(query_string);
                    // console.log('---------query_string-----------');
                    // console.log(query_string);
                    // let post_data = {'func':'GetOrder','encode_data':encoded_string, 'data_length':query_string.length};
                    let post_data = new FormData();
                    post_data.append('func', 'GetOrder');
                    post_data.append('encode_data', encoded_string);
                    // console.log(encoded_string);
                    post_data.append('data_length', query_string.length);

                    axios.post(this.current.env, post_data)
                        .then((response) => {
                            this.loadShow = false;
                            // this.$saveToolData(this.current);
                            if (response.data.iRet != 0){
                                // console.log('324234234'+response.data.iRet);
                                this.warning(response.data.errmsg);
                                this.loadShow = false;
                                return;
                            }else {
                                // this.current.result = response.data.data;
                                this.current.result2[this.current.query_value] = response.data.data;
                                console.log(this.current.result);
                                console.log(this.current.result2);
                                this.$saveToolData(this.current);
                                this.current.resultflag=true;
                            }
                        })
                        .catch(function (error) {
                            console.log(error);
                        });

                    //this.current.output = this.current.env + this.current.key1 + this.current.key2;
                }else{
                    this.warning('请选择环境');
                    this.loadShow = false;
                    return;
                }
                this.$saveToolData(this.current);
            },
            warning (message) {
                this.$Message.warning(message);
            },
            open (nodesc) {
                this.$Notice.success({
                    title: '清理成功',
                    desc: nodesc ? '' : ''
                });
            },
            show (index) {
                let contentStr='';
                for ( let ikey in index.row ){
                    contentStr = contentStr+`<p style='margin:5px auto;'><b>${ikey}</b>: ${index.row[ikey]}</p>`;
                    // contentStr = contentStr+`<b>${ikey}</b>: ${index.row[ikey]}<br/>`;

                }
                this.$Modal.info({
                    title: '订单详情',
                    width: "800",
                    okText: "关闭",
                    scrollable: true,
                    content: "<div slot='content' style='word-break: break-all;'>"+contentStr+"</div>",
                });
            },
            show_row(data, index){
                // console.log(JSON.stringify(data));
                console.log('当前行数据:' + data);
                console.log('点击行号:' + index);
            }
        },
        data() {
            return {
                loadShow: false,
                current: {
                    env: '',
                    query_field:'outer_order_no',
                    query_value:'',
                    offerid: '',
                    orderid: '',
                    query_table:['order_center', 't_order_state'],
                    result: [{},],
                    result2:{},
                    resultflag:false
                },


                tools_env: config.open_tools_env,

                database: [
                    {
                        value: 'order_center',
                        label: '订单中心',
                        children: [
                            {
                                value: 't_order_state',
                                label: '订单表'
                            },
                            {
                                value: 't_order_refund',
                                label: '退款表',
                                // disabled: true
                            },
                            {
                                value: 't_order_withdraw',
                                label: '提现表',
                                // disabled: true
                            },
                            {
                                value: 't_order_subinfo',
                                label: '子单表（暂不支持）',
                                disabled: true
                            },
                            {
                                value: 't_order_verification',
                                label: '核销表（暂不支持）',
                                disabled: true
                            }
                        ]
                    },
                    {
                        value: 'wechat_channel',
                        label: '微信渠道',
                        children: [
                            {
                                value: 't_upay_order',
                                label: '订单表'
                            }
                        ]
                    },
                    {
                        value: 'openbank_cmb_channel',
                        label: '聚鑫招行',
                        children: [
                            {
                                value: 't_upay_data',
                                label: '订单表'
                            }
                        ]
                    },
                    {
                        value: 'bank_cmb_channel',
                        label: '招行',
                        children: [
                            {
                                value: 't_upay_data',
                                label: '订单表'
                            }
                        ]
                    },
                    {
                        value: 'log_record',
                        label: 'log_record',
                        children: [
                            {
                                value: 't_logs',
                                label: 't_logs'
                            },
                            {
                                value: 't_logs2',
                                label: 't_logs2'
                            }
                        ]
                    },
                    {
                        value: 'db_sett',
                        label: 'db_sett(结算库)',
                        children: [
                            {
                                value: 't_ota_detail_water',
                                label: 't_ota_detail_water'
                            }
                        ]
                    }
                ],

                t_order_state_columns: [
                    {
                        title: 'FOrderId',
                        key: 'FOrderId'

                    },
                    {
                        title: 'FSystemName',
                        key: 'FSystemName'
                    },
                    {
                        title: 'FPortalSerialNo',
                        key: 'FPortalSerialNo'
                    },
                    {
                        title: 'FChannelOrderId',
                        key: 'FChannelOrderId'
                    },
                    {
                        title: 'FOrderState',
                        key: 'FOrderState',
                        render: (h,params) => {
                            return h('Tooltip', {
                                props: { placement: 'right' }
                            }, [
                                params.row[params.column.key],
                                // h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row[params.column.key].substring(0, 50))
                                h('span', { slot: 'content', style: { whiteSpace: 'pre', wordBreak: 'break-all' } }, '50:批价成功\n101:支付成功\n901:关单成功\n910:发货成功\n201:发货失败\n300:合并补缴')
                            ]);
                        }
                    },
                    {
                      title: 'FOffLine',
                      key:'FOffLine'
                    },
                    {
                        title: 'FLoginUin',
                        key: 'FLoginUin'
                    },
                    {
                        title: 'FExt8',
                        key: 'FExt8'
                    },
                    {
                        title: 'FCreateTime',
                        key: 'FCreateTime',
                        sortable: true
                    },
                    {
                        title: 'FUpdateTime',
                        key: 'FUpdateTime',
                        sortable: true
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        render:(h,params) => {
                            return h('i-button', {style :{type:"info"}, on: {
                                    click: () => {
                                        this.show(params)
                                    }
                                } }, '查看详情');
                        }
                    }
                ],
                t_order_refund_columns: [
                    {
                        title: 'FRefundId',
                        key: 'FRefundId'

                    },
                    {
                        title: 'FOfferId',
                        key: 'FOfferId'
                    },
                    {
                        title: 'FOrderId',
                        key: 'FOrderId'
                    },
                    {
                        title: 'FRefundState',
                        key: 'FRefundState',
                        render: (h,params) => {
                            return h('Tooltip', {
                                props: { placement: 'right' }
                            }, [
                                params.row[params.column.key],
                                // h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row[params.column.key].substring(0, 50))
                                h('span', { slot: 'content', style: { whiteSpace: 'pre', wordBreak: 'break-all' } }, '601:退款中\n602:退款成功')
                            ]);
                        }
                    },
                    {
                        title: 'FRefundChannel',
                        key:'FRefundChannel'
                    },
                    {
                        title: 'FPayWay',
                        key: 'FPayWay'
                    },
                    {
                        title: 'FCreateTime',
                        key: 'FCreateTime',
                        sortable: true
                    },
                    {
                        title: 'FUpdateTime',
                        key: 'FUpdateTime',
                        sortable: true
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        render:(h,params) => {
                            return h('i-button', {style :{type:"info"}, on: {
                                    click: () => {
                                        this.show(params)
                                    }
                                } }, '查看详情');
                        }
                    }
                ],
                t_order_subinfo_columns: [
                    {
                        title: 'FSubOrderId',
                        key: 'FSubOrderId'
                    },
                    {
                        title: 'FOfferId',
                        key: 'FOfferId'
                    },
                    {
                        title: 'FOrigPayAmt',
                        key: 'FOrigPayAmt'
                    },
                    {
                        title: 'FVerificationAmt',
                        key: 'FVerificationAmt'
                    },
                    {
                        title: 'FOrigPayAmt',
                        key: 'FOrigPayAmt'
                    },
                    {
                        title: 'FPayAmt',
                        key: 'FPayAmt'
                    },
                    {
                        title: 'FRefundAmt',
                        key: 'FRefundAmt'
                    },
                    {
                        title: 'FUpdateTime',
                        key: 'FUpdateTime',
                        sortable: true
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        render:(h,params) => {
                            return h('i-button', {style :{type:"info"}, on: {
                                    click: () => {
                                        this.show(params)
                                    }
                                } }, '查看详情');
                        }
                    }
                ],
                t_upay_order_columns: [
                    {
                        title: 'FOrderId',
                        key: 'FOrderId'
                    },
                    {
                        title: 'FStatus',
                        key: 'FStatus'
                    },
                    {
                        title: 'FPayChannel',
                        key: 'FPayChannel'
                    },
                    {
                        title: 'FExternalOrderId',
                        key: 'FExternalOrderId'
                    },
                    {
                        title: 'FOfferId',
                        key: 'FOfferId'
                    },
                    {
                        title: 'FServiceCode',
                        key: 'FServiceCode'
                    },
                    {
                        title: 'FPortalSerialNo',
                        key: 'FPortalSerialNo'
                    },
                    {
                        title: 'FPayUin',
                        key: 'FPayUin'
                    },
                    {
                        title: 'FUpdateTime',
                        key: 'FUpdateTime',
                        sortable: true
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        render:(h,params) => {
                            return h('i-button', {style :{type:"info"}, on: {
                                    click: () => {
                                        this.show(params)
                                    }
                                } }, '查看详情');
                        }
                    }
                ],
                t_upay_data_columns: [
                    {
                        title: 'FOrderId',
                        key: 'FOrderId'
                    },
                    {
                        title: 'FPayChannel',
                        key: 'FPayChannel'
                    },
                    {
                        title: 'FPayChannelSubId',
                        key: 'FPayChannelSubId'
                    },
                    {
                        title: 'FPayUin',
                        key: 'FPayUin'
                    },
                    {
                        title: 'FChannelExtend',
                        key: 'FChannelExtend'
                    },
                    {
                        title: 'FUpdateTime',
                        key: 'FUpdateTime',
                        sortable: true
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        render:(h,params) => {
                            return h('i-button', {style :{type:"info"}, on: {
                                    click: () => {
                                        this.show(params)
                                    }
                                } }, '查看详情');
                        }
                    }
                ],
                t_logs_columns: [
                    {
                        title: 'CgiReqName',
                        key: 'CgiReqName'
                    },
                    {
                        title: 'Action',
                        key: 'Action'
                    },
                    {
                        title: 'OfferId',
                        key: 'OfferId'
                    },
                    {
                        title: 'FOrderId',
                        key: 'OutTradeNo'
                    },
                    {
                        title: 'ErrorInfo',
                        key: 'ErrorInfo'
                    },
                    {
                        title: '_LogIP',
                        key: '_LogIP'
                    },
                    {
                        title: 'AErr',
                        key: 'AErr'
                    },
                    {
                        title: 'FUpdateTime',
                        key: 'FUpdateTime',
                        sortable: true
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        render:(h,params) => {
                            return h('i-button', {style :{type:"info"}, on: {
                                    click: () => {
                                        this.show(params)
                                    }
                                } }, '查看详情');
                        }
                    }
                ],
                t_ota_detail_water_columns: [
                    {
                        title:"FOfferID",
                        key:"platform_offerid"
                    },
                    {
                        title:"offerid_name",
                        key:"offerid_name"
                    },
                    {
                        title: 'outer_order_no',
                        key: 'outer_order_no'
                    },
                    {
                        title: 'inner_order_no',
                        key: 'inner_order_no'
                    },
                    {
                        title: 'channelexternalorderid',
                        key: 'channelexternalorderid'
                    },
                    {
                        title: 'inner_channelorderid',
                        key: 'inner_channelorderid'
                    },
                    {
                        title: 'FUpdateTime',
                        key: 'tran_time',
                        sortable: true
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        render:(h,params) => {
                            return h('i-button', {style :{type:"info"}, on: {
                                    click: () => {
                                        this.show(params)
                                    }
                                } }, '查看详情');
                        }
                    }
                ],
                t_order_withdraw_columns: [
                    {
                        title:"FOfferId",
                        key:"FOfferId"
                    },
                    {
                        title:"FWithdrawId",
                        key:"FWithdrawId"
                    },
                    {
                        title: 'FPortalSerialNo',
                        key: 'FPortalSerialNo'
                    },
                    {
                        title: 'FChannel',
                        key: 'FChannel'
                    },
                    {
                        title: 'FWithdrawState',
                        key: 'FWithdrawState',
                        render: (h,params) => {
                            return h('Tooltip', {
                                props: { placement: 'right' }
                            }, [
                                params.row[params.column.key],
                                // h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row[params.column.key].substring(0, 50))
                                h('span', { slot: 'content', style: { whiteSpace: 'pre', wordBreak: 'break-all' } }, '701:发起提现\n702:提现成功\n703:提现失败')
                            ]);
                        }
                    },
                    {
                        title: 'ServiceCode',
                        key: 'FProductId'
                    },
                    {
                        title: 'FCreateTime',
                        key: 'FCreateTime'
                    },
                    {
                        title: 'FUpdateTime',
                        key: 'FUpdateTime',
                        sortable: true
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        render:(h,params) => {
                            return h('i-button', {style :{type:"info"}, on: {
                                    click: () => {
                                        this.show(params)
                                    }
                                } }, '查看详情');
                        }
                    }
                ]
            }
        }
    }
</script>
<style>
    .demo-spin-icon-load{
        display: inline-block;
        animation: ani-demo-spin 1s linear infinite;
    }
</style>

<style scoped>
     >>> .language-html{
        word-break: break-all;
        white-space: pre-wrap;
    }
</style>