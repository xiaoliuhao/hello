<template>
    <div>
        <BackTop></BackTop>
        <Row :gutter="16">
            <Col span="16">
                <Row :gutter="16">
                    <Col span="8">
                        <Input v-model="current.env" >
                            <Select v-model="current.env" slot="prepend" prefix="ios-home"  placeholder="选择环境" style="width:150px">
                                <Option v-for="(d,k) in tools_env" :value="d.url" :key="k">{{ d.name }}</Option>
                            </Select>
                        </Input>
                    </Col>
                    <Col span="8">
                        <ButtonGroup>
                            <Button type="primary" @click="handle();">查询</Button>
                        </ButtonGroup>
                    </Col>
                </Row>
            </Col>

        </Row>

        <div>
            <option-block>

            </option-block>
        </div>


            <!-- 过度动画 -->
            <Spin fix v-if="loadShow">
                <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                <div>Loading</div>
            </Spin>
            <i-table  border :columns="t_order_state_columns" content="$parent" @on-row-click="show_row" :data="current.result" ></i-table>




    </div>
</template>
<script>
    import axios from 'axios'
    import config from "../../tool/config"

    export default {
        created() {
            this.current = Object.assign({},this.current,this.$getToolData("input"))
        },
        methods: {
            handle() {
                this.loadShow = true;

                if (!this.current.env){
                    this.warning();
                    this.loadShow = false;
                    return;
                }else {
                    setTimeout(() => {
                        this.loadShow = false
                    }, 3000);
                    this.loadShow = true;
                    let url = this.current.env + `?func=GetRealwaterConfig&action=list&out_type=json&code=987654123`;
                    console.log(url);
                    axios.get(url)
                        .then((response) => {
                            this.loadShow = false;
                            // this.$saveToolData(this.current);
                            this.current.result = response.data.data;
                            // console.log(response.data.data);
                        })
                        .catch(function (error) {
                            console.log("errorrrrrrrr");
                            console.log(error);
                        });

                    //this.current.output = this.current.env + this.current.key1 + this.current.key2;

                    console.log(this.current.result);
                    // this.current.result="222";
                    // console.log(this.current.result);
                    this.$saveToolData(this.current);
                }
            },
            warning () {
                this.$Message.warning('请选择查询环境');
            },
            show (index) {
                let contentStr='';
                for ( let ikey in index.row ){
                    contentStr = contentStr+`<p style='margin:5px auto;'><b>${ikey}</b>: ${index.row[ikey]}</p>`;
                }
                this.$Modal.info({
                    title: '配置详情',
                    content: "<div slot='content' style='word-break: break-all;'>"+contentStr+"</div>",
                    width: "800",
                    okText: "关闭",
                    scrollable: true
                });
            },
            export_config (index) {
                let target=index.row.FTarget;
                let contentStr= '';
                let config_result;
                let save_sql='';
                console.log("index");
                console.log(index.row);
                let url = this.current.env + `?func=GetRealwaterConfig&action=label&out_type=json&code=987654123&&searchkey=${target}`;
                console.log(url);

                axios.get(url)
                    .then((response) => {
                        // this.$saveToolData(this.current);

                        config_result= response.data.data;// console.log(response.data.data);

                        console.log('config_result');
                        console.log(config_result);
                        contentStr += `<b>t_interface_conf_insert_sql</b>:<p style='margin:5px auto;'>${config_result.t_interface_conf_insert_sql}</p>`;
                        contentStr += `<b>t_push_condition_insert_sql</b>:<p style='margin:5px auto;'>${config_result.t_push_condition_insert_sql}</p>`;
                        contentStr += `<b>t_push_interface_insert_sql</b>:<p style='margin:5px auto;'>${config_result.t_push_interface_insert_sql}</p>`;

                        save_sql += config_result.t_interface_conf_insert_sql+"\n";
                        save_sql += config_result.t_push_condition_insert_sql+"\n";
                        save_sql += config_result.t_push_interface_insert_sql+"\n";

                        this.$clipboardCopy(save_sql);
                        this.$Modal.info({
                            title: target,
                            content: "<div slot='content' style='word-break: break-all;'>"+contentStr+"</div>",
                            width: "800",
                            okText: "关闭",
                            scrollable: true
                        });
                    })
                    .catch(function (error) {
                        console.log("errorrrrrrrr");
                        console.log(error);
                    });


            },
            show_row(data, index){
                // console.log(JSON.stringify(data));
                console.log('当前行数据:');
                console.log(data);
                console.log('点击行号:' + index);
            }
        },
        data() {
            return {
                loadShow: false,
                current:{
                    env: "",
                    action:"",
                    query_table:[],
                    result: [],
                },

                t_order_state_columns: [
                    {
                        title: 'FTarget',
                        key: 'FTarget',
                        sortable: true

                    },
                    {
                        title: 'FSubCmdCode',
                        key: 'FSubCmdCode',
                        width: 130
                    },
                    {
                        title: 'FServiceCodeList',
                        key: 'FServiceCodeList',
                        ellipsis: true,
                        // render: (h,params) => {
                        //     return h('Tooltip', {
                        //         props: { placement: 'top' }
                        //     }, [
                        //         params.row[params.column.key],
                        //         h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row[params.column.key].substring(0, 50))
                        //     ]);
                        // }
                    },
                    {
                        title: 'Host',
                        key: 'Host'
                    },
                    {
                        title: 'Port',
                        key: 'Port',
                        width: 80,
                        sortable: true
                    },
                    {
                        title: 'Url_path',
                        key: 'Url_path'
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
                        // render:(h,params) => {
                        //     return h('i-button', {style :{type:"info"}, on: {
                        //             click: () => {
                        //                 this.show(params)
                        //             }
                        //         } }, '查看详情');
                        // }
                        render: (h, params) => {
                            return h('div', {style:{margin:"10px"}},[
                                     h('i-button', {props:{type:"primary"},style :{type:"primary"}, on: {
                                        click: () => {
                                            this.show(params)
                                        }
                                    } }, '查看详情'),

                                    h('i-button', {style :{type:"info",margin:"10px"}, on: {
                                        click: () => {
                                            this.export_config(params)
                                        }
                                    } }, '导出配置'),
                            ])
                        }
                    }
                ],

                tools_env: config.open_tools_env,
            }
        },
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