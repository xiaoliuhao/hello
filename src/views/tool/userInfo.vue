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
                        <Input v-model="current.query_value">
                            <Select slot="prepend" placeholder="用户id" style="width:100px" not-found-text="请输入用户uin">

                            </Select>
                        </Input>
                    </Col>
                </Row>
            </Col>

        </Row>

        <div>
        <option-block>
            <FormItem>
                <ButtonGroup>
                    <Button type="primary" @click="handle();">查询</Button>
                </ButtonGroup>
            </FormItem>
        </option-block>
        </div>

        <div  style="margin-bottom: 16px">
            <!-- 过度动画 -->
            <Spin fix v-if="loadShow">
                <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                <div>Loading</div>
            </Spin>
            <!--结果展示-->
            <div v-if="current.result.database">
                <h2>用户信息</h2>
                <i-table header="234324234234" v-if="current.result.database.wechat_sign.t_sign_info" border :columns="t_sign_infocolumns" :data="current.result.database.wechat_sign.t_sign_info"></i-table>
                <h2>最近的订单记录</h2>
                <i-table v-if="current.result.database.order_center.t_sync_oc_state" :height="260" border :columns="t_order_state_columns" content="$parent" @on-row-click="show_row" :data="current.result.database.order_center.t_sync_oc_state" ></i-table>
                <i-table v-if="current.result.database.order_center.t_order_state"  border :columns="t_order_state_columns" content="$parent" @on-row-click="show_row" :data="current.result.database.order_center.t_order_state" ></i-table>
                <h2>账户余额</h2>
                <i-table  border :columns="t_acct_info_columns" content="$parent" @on-row-click="show_row" :data="current.result.database.caccts_tdf.t_acct_info" ></i-table>
                <h2>账户流水</h2>
                <i-table  border :columns="t_acct_water_columns" content="$parent" @on-row-click="show_row" :data="current.result.database.caccts_tdf.t_acct_water" ></i-table>
            </div>
        </div>



    </div>   
</template>
<script>
    import {formatDate} from "../../helper"
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
            // console.log(this.current);
            //console.log(config.open_tools_env);
        },
        methods: {

            handle(){
               this.loadShow = true;
                setTimeout(() => {
                    this.loadShow = false
                }, 3000)
                if (this.current.env) {
                    // console.log(this.current);
                    if(!this.current.query_field || !this.current.query_value){
                        this.warning('请输入用户id');
                        this.loadShow = false;
                        return;
                    }
                    this.loadShow = true;
                    // console.log(this.current);
                    // let query_string = `query_filed=${this.current.query_field}&query_value=${this.current.query_value}`;
                    let query_string = `userID=${this.current.query_value}`
                    let encoded_string=config.simple_encode(query_string);
                    // console.log('---------query_string-----------');
                    // console.log(query_string);
                    // let post_data = {'func':'GetOrder','encode_data':encoded_string, 'data_length':query_string.length};
                    let post_data = new FormData();
                    post_data.append('func', 'GetUserInfo');
                    post_data.append('encode_data', encoded_string);
                    post_data.append('data_length', query_string.length);
                    axios.post(this.current.env, post_data)
                        .then((response) => {
                            this.loadShow = false;
                            // this.$saveToolData(this.current);
                            // console.log(response.data);
                            if (response.data.iRet != 0){
                                this.warning(response.data.msg);
                                this.loadShow = false;
                            }else {
                                this.current.result = response.data.data;
                                this.$saveToolData(this.current);
                            }
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
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
                console.log(data);
                console.log('点击行号:' + index);
            },
            format_date(datastr){
                let newDate = new Date();
                newDate.setTime(datastr * 1000);
                return formatDate(newDate);
            }
        },
        data() {
            return {
                loadShow: false,
                current: {
                    env: '',
                    query_field:'userid',
                    query_value:'',
                    result: [{},],
                },


                tools_env: config.open_tools_env,

                t_acct_info_columns: [
                    {
                        title: '账户',
                        key: 'Facct_id'
                    },
                    {
                        title: '用户号码',
                        key: 'Fuin'
                    },
                    {
                        title: 'Fstatus',
                        key: 'Fstatus'
                    },
                    {
                        title: '余额',
                        key: 'Fbalance'
                    },
                    {
                        title: '历史充值金额',
                        key: 'Ftotal_plus',
                        render: (h,params) => {
                            return h('Tooltip', {
                                props: { placement: 'right' }
                            }, [
                                params.row[params.column.key],
                                // h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row[params.column.key].substring(0, 50))
                                h('span', { slot: 'content', style: { whiteSpace: 'pre', wordBreak: 'break-all' } }, '0:已签约\n1:已解约')
                            ]);
                        }
                    },
                    {
                        title: '历史消耗金额',
                        key: 'Ftotal_sub'
                    },
                    {
                        title: '创建时间',
                        key: 'Fcreate_time',
                        sortable: true,
                        render:(h,params) => {
                            return h('p', this.format_date( params.row[params.column.key] ) );
                        },
                    },
                    {
                        title: '最后充值时间',
                        key: 'Flast_plus_time',
                        sortable: true,
                        render:(h,params) => {
                            return h('p', this.format_date( params.row[params.column.key] ) );
                        },
                    },
                    {
                        title: '最后消费时间',
                        key: 'Flast_sub_time',
                        sortable: true,
                        render:(h,params) => {
                            return h('p', this.format_date( params.row[params.column.key] ) );
                        },
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
                t_acct_water_columns: [
                    {
                        title: 'Facct_id',
                        key: 'Facct_id'
                    },
                    {
                        title: '流水号',
                        key: 'Fseq_no'
                    },
                    {
                        title: '用户号码',
                        key: 'Fuin'
                    },
                    {
                        title: 'Portal序列号',
                        key: 'Fportal_seq'
                    },
                    {
                        title: '类型',
                        key: 'Fio_flag',
                        filters: [
                            {
                                label: '消费',
                                value: 1
                            },
                            {
                                label: '充值',
                                value: 2
                            }
                        ],
                        // filterMultiple: false,
                        filterMethod (value, row) {
                            if (value === 1) {
                                return row.Fio_flag = 1;
                            } else if (value === 2) {
                                return row.Fio_flag = 2;
                            }
                        },
                        render: (h,params) => {
                            if ( params.row[params.column.key] == 0 ) {
                                return h('p', '开户');
                            }
                            if ( params.row[params.column.key] == 1 ) {
                                return h('p', '消费');
                            }
                            if ( params.row[params.column.key] == 2 ) {
                                return h('p', '充值');
                            }

                        }
                    },
                    {
                        title: '交易金额',
                        key: 'Ftran_amt',
                    },
                    {
                        title: '余额',
                        key: 'Fbalance'
                    },
                    {
                        title: '创建时间',
                        key: 'Fcreate_time',
                        sortable: true,
                        render:(h,params) => {
                            return h('p', this.format_date( params.row[params.column.key] ) );
                        },
                    },
                    {
                        title: '交易时间',
                        key: 'Freserve3',
                        sortable: true,
                        render:(h,params) => {
                            return h('p', this.format_date( params.row[params.column.key] ) );
                        },
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
                t_sign_infocolumns: [
                    {
                        title: 'FAppId',
                        key: 'FAppId'
                    },
                    {
                        title: 'FServiceCode',
                        key: 'FServiceCode'
                    },
                    {
                        title: 'FUserId',
                        key: 'FUserId'
                    },
                    {
                        title: 'FValid',
                        key: 'FValid',
                        render: (h,params) => {
                            return h('Tooltip', {
                                props: { placement: 'right' }
                            }, [
                                params.row[params.column.key],
                                // h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row[params.column.key].substring(0, 50))
                                h('span', { slot: 'content', style: { whiteSpace: 'pre', wordBreak: 'break-all' } }, '0:已签约\n1:已解约')
                            ]);
                        }
                    },
                    {
                        title: 'FSubAppId',
                        key: 'FSubAppId'
                    },
                    {
                        title: 'FSubMchId',
                        key: 'FSubMchId'
                    },
                    {
                        title: 'FSignInfo',
                        key: 'FSignInfo'
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
                t_order_state_columns: [
                    {
                        title: 'FOrderId',
                        key: 'FOrderId'

                    },
                    {
                        title: 'FPayChannel',
                        key: 'FPayChannel'
                    },
                    {
                        title: 'FPayChannel',
                        key: 'FPayChannel'
                    },
                    {
                        title: 'FPayAmt',
                        key: 'FPayAmt'
                    },
                    {
                        title: 'FPortalSerialNo',
                        key: 'FPortalSerialNo'
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