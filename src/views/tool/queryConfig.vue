<template>
    <div>
        <Row :gutter="16">
            <Col span="16">
                <Row :gutter="16">
                    <Col span="8">
                        <i-select  v-model="current.env" style="width:200px" placeholder="选择环境">
                            <i-option v-for="item in tools_env" :value="item.url">{{ item.name }}</i-option>
                        </i-select>
                        <!--<Select v-model="current.env" slot="prepend" prefix="ios-home"  placeholder="选择环境" style="width:200px">-->
                            <!--<Option v-for="(d,k) in tools_env" :value="d.url" :key="k">{{ d.name }}</Option>-->
                        <!--</Select>-->

                    </Col>

                    <Col span="8">

                    </Col>

                    <Col span="8">
                        <Input v-model="current.search_key">
                            <Select v-model="current.query_type" slot="prepend" placeholder="查询条件" style="width:100px">
                                <Option value="offerid">按offerid</Option>
                                <Option value="servicecode">按业务代码</Option>
                            </Select>
                        </Input>
                    </Col>
                    <Col span="6" v-show="false">
                        <Input type="password" >
                            <div slot="prepend" style="width: 50px">查询口令</div>
                        </Input>
                    </Col>
                </Row>
            </Col>
            <Col span="8"></Col>
        </Row>
        <div>
        <option-block>
            <FormItem>
                <!--<ButtonGroup>-->
                    <Button type="primary" @click="handle();">查询</Button>
                    <Button type="dashed" style="margin-left: 16px" @click="clear();">清除缓存</Button>
                <!--</ButtonGroup>-->
            </FormItem>
        </option-block>
        </div>


        <div>
            <!-- 过度动画 -->
            <Spin fix v-if="loadShow">
                <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                <div>Loading</div>
            </Spin>

            <Tabs v-if="current.resultflag===true" type="card" closable :active-key="current.search_key">
                <Tab-pane :label="query_index"  :key="query_index" v-for="(query_info, query_index) in current.appConfig2">
                    <Collapse>
                    <Panel v-for="(table, key, i) in query_info" >
                    {{key}}
                    <div v-if="key==='t_offer_sub'"  slot="content" >
                    <i-table border :columns="t_offer_sub_columns" :data="table"></i-table>
                    </div>
                    <div v-if="key!=='t_offer_sub'" slot="content" >
                    <Row :gutter="16" v-for="(t_value, t_key) in table">
                    <Col span='8'> {{t_key}}</Col>
                    <Col span='16'> {{t_value}}</Col>
                    </Row>
                    </div>
                    </Panel>
                    </Collapse>
                </Tab-pane>
            </Tabs>
        </div>
    </div>   
</template>
<script>
    import {formatDate} from "../../helper";
    import axios from 'axios'
    import { constants } from 'crypto';
    import config from "../../tool/config"

    export default {
        created() {
            this.current = Object.assign(this.current, this.$getToolData());
            // this.current = Object.assign(this.current, this.$getToolData());
            console.log(config.open_tools_env);
        },
        methods: {
            open (nodesc) {
                this.$Notice.success({
                    title: '清理成功',
                    desc: nodesc ? '' : ''
                });
            },
            clear(){
                this.current ={
                    passwd:"987654123",
                    env: "",
                    query_type:"offerid",
                    output: "",
                    appConfig: [],
                    resultflag: false,
                    search_key:"",
                    appConfig2: {}
                };
                this.$saveToolData(this.current);
                this.open();
            },
            handle(){
                console.log(this.current);
                this.loadShow = true;
                setTimeout(() => {
                    this.loadShow = false
                }, 3000)
                if (this.current.env) {
                    if(!this.current.query_type){
                        this.warning('请选择查询条件');
                        this.loadShow = false;
                        return;
                    }
                    if(!this.current.search_key){
                        this.warning('请输入查询条件');
                        this.loadShow = false;
                        return;
                    }
                    this.loadShow = true;
                    //http://sandbox.api.openmidas.com/hawkenliu_tools/php/index.php?func=func=GetAppConfigVue&query_type=offerid&searchkey=1450013764&code=987654123
                    let url = this.current.env + `?func=GetAppConfig&query_type=${this.current.query_type}&searchkey=${this.current.search_key}&code=987654123&out_type=json`;
                    axios.get(url)
                        .then((response) => {
                            this.loadShow = false;
                            // this.current.appConfig = response.data.data;

                            this.current.appConfig2[this.current.search_key] = response.data.data;
                            this.current.resultflag=true;

                            console.log(this.current);
                            this.$saveToolData(this.current);
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                }else{
                    this.warning('请选择查询环境');
                    this.loadShow = false;
                    return;
                }
                console.log(this.current);
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
                    title: '配置详情',
                    width: "400",
                    okText: "关闭",
                    scrollable: true,
                    content: "<div slot='content' style='word-break: break-all;'>"+contentStr+"</div>",
                });
            },
        },
        data() {
            return {
                loadShow: false,

                current: {
                    passwd:"987654123",
                    env: "",
                    query_type:"offerid",
                    output: "",
                    appConfig: [],
                    resultflag: false,
                    search_key:"",
                    appConfig2: {}
                },
                tools_env: config.open_tools_env,
                columns1:[
                    {
                        title: 'Name',
                        key: 'name'
                    },
                    {
                        title: 'Age',
                        key: 'age'
                    },
                    {
                        title: 'Address',
                        key: 'address'
                    }
                ],
                t_offer_sub_columns: [
                    {
                        title: 'FOfferID',
                        key: 'FOfferID'

                    },
                    {
                        title: 'FOfferName',
                        key: 'FOfferName'
                    },
                    {
                        title: 'FMchID',
                        key: 'FMchID'
                    },
                    {
                        title: 'FPlatform',
                        key: 'FPlatform',
                        render: (h,params) => {
                            return h('Tooltip', {
                                props: { placement: 'right' }
                            }, [
                                params.row[params.column.key],
                                // h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row[params.column.key].substring(0, 50))
                                h('span', { slot: 'content', style: { whiteSpace: 'pre', wordBreak: 'break-all' } }, '30119:小程序\n30035:公众号')
                            ]);
                        }
                    },
                    {
                        title: 'FAppID',
                        key:'FAppID'
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