<template>
    <div>
        <Row :gutter="16">
            <Col span="24">
                <Row :gutter="8">
                    <Col span="10">
                        <Input v-model="current.env" >
                        <Select v-model="current.env" slot="prepend" prefix="ios-home"  placeholder="选择环境2" @on-change="get_applist()" style="width:160px">
                            <Option v-for="(d,k) in tools_env" :value="d.url" :key="k">{{ d.name }}</Option>
                        </Select>
                        </Input>
                    </Col>
                    <!--<Col span="6">-->
                        <!--<Input v-model="current.search_key">-->
                            <!--<Select v-model="current.query_type" slot="prepend" placeholder="查询条件" style="width:100px">-->
                                <!--<Option value="offerid">按offerid</Option>-->
                                <!--<Option value="servicecode">按业务代码</Option>-->
                            <!--</Select>-->
                        <!--</Input>-->
                    <!--</Col>-->
                    <!--<Col span="1">-->
                        <!--<span >offerid:</span>-->
                    <!--</Col>-->
                    <Col span="8">
                        <i-col span="12" >
                            <i-select :model.sync="current.offerid" filterable clearable>
                                <i-option v-for="item in current.appConfigList" :value="item.FOfferID" >{{ item.FOfferID }}({{ item.FOfferName }}）</i-option>
                            </i-select>
                        </i-col>
                    </Col>


                    <Col span="6" v-show="false">
                        <Input type="password" >
                            <div slot="prepend" style="width: 50px">查询口令</div>
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

        

        <div>


                <Col span="24">
                <!--<i-table border :columns="applist" highlight-row :data="this.current.appConfigList"  :height="this.current.height"></i-table>-->
                <!--<Page style="margin: 10px;overflow: hidden" :total="40" size="small"  show-elevator show-sizer></Page>-->
                    <filter-table @on-search="onSearch"
                                  :data="this.current.appConfigList"
                                  :columns="applist">
                    </filter-table>
                </Col>

                <!--<Col span="12">-->
                    <!--<i-table border :columns="applist" highlight-row :data="this.current.appConfigList" :height="this.current.height"></i-table>-->
                <!--</Col>-->


        </div>
    </div>   
</template>
<script>
    import axios from 'axios';
    import config from "../../tool/config";

    export default {
        created() {
            this.current = Object.assign(this.current, this.$getToolData());
            // this.current = Object.assign(this.current, this.$getToolData());
            console.log(config.open_tools_env);
        },
        methods: {
            get_applist(){
                // this.warning('区域已更改');
                let url = "http://sandbox.api.openmidas.com/hawkenliu_tools/php/index.php?func=GetAppConfig&query_type=all_list&searchkey=1450013764&code=987654123&out_type=json";
                // let url = this.current.env + `?func=GetAppConfig&query_type=all_list&code=987654123&out_type=json`;
                axios.get(url)
                    .then((response) => {
                        this.loadShow = false;
                        // this.$saveToolData(this.current);
                        this.current.appConfigList = response.data.data;
                        console.log(this.current)
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            },
            handle(){
               this.loadShow = true;
                setTimeout(() => {
                    this.loadShow = false
                }, 3000)
                if (this.current.env) {
                    // if(!this.current.query_type){
                    //     this.warning('请选择查询条件');
                    //     this.loadShow = false;
                    //     return;
                    // }
                    // if(!this.current.search_key){
                    //     this.warning('请输入查询条件');
                    //     this.loadShow = false;
                    //     return;
                    // }
                    this.loadShow = true;
                    //http://sandbox.api.openmidas.com/hawkenliu_tools/php/index.php?func=func=GetAppConfigVue&query_type=offerid&searchkey=1450013764&code=987654123
                    let url = this.current.env + `?func=GetAppConfig&query_type=${this.current.query_type}&searchkey=${this.current.search_key}&code=987654123&out_type=json`;
                    axios.get(url)
                        .then((response) => {
                            this.loadShow = false;
                            // this.$saveToolData(this.current);
                            this.current.appConfig = response.data.data;
                            console.log(this.current)
                        })
                        .catch(function (error) {
                            console.log(error);
                        });

                    //this.current.output = this.current.env + this.current.key1 + this.current.key2;
                }
                console.log(this.current);
                // this.$saveToolData(this.current);
            },
            warning (message) {
                this.$Message.warning(message);
            },
            show (index) {
                let offerid=index.row['FOfferID'];
                let url =`http://sandbox.api.openmidas.com/hawkenliu_tools/php/index.php?func=GetAppConfig&query_type=offerid&searchkey=${offerid}&code=987654123&out_type=json`;
                // this.warning(index.row['FOfferID']);
                // let url = this.current.env + `?func=GetAppConfig&query_type=${this.current.query_type}&searchkey=${this.current.search_key}&code=987654123&out_type=json`;
                axios.get(url)
                    .then((response) => {
                        this.loadShow = false;
                        this.current.card_show = true;
                        this.current.active_key="1";
                        // this.$saveToolData(this.current);
                        this.current.appConfig = response.data.data;
                        console.log(this.current)
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            },
            show_row(data, index){
                // console.log(JSON.stringify(data));
                console.log('当前行数据:' + data);
                console.log('点击行号:' + index);
            },
            findArray(array, feature, all = true) {
                for (let index in array) {
                    let cur = array[index];
                    if (feature instanceof Object) {
                        let allRight = true;
                        for (let key in feature) {
                            let value = feature[key];
                            if (cur[key] == value && !all) return index;
                            if (all && cur[key] != value) {
                                allRight = false;
                                break;
                            }
                        }
                        if (allRight) return index;
                    } else {
                        if (cur == feature) {
                            return index;
                        }
                    }
                }
                return -1;
            },
            formatStatus(value, status) {
                return status[value] || {value: '', name: ''};
            },
            onSearch(search) {
                //模拟数据库查询数据
                //这个search应该是传到后台,然后台来根据条件查询数据库
                alert('查询条件：'+JSON.stringify(search,null,4));
                // console.log(search);
                let itemindex=this.findArray(this.current.appConfigList, {FOfferID: '145001374'});
                // console.log(this.current.appConfigList[itemindex]);
                console.log(itemindex);
                if( itemindex != '-1') {
                    this.current.appConfigList = [this.current.appConfigList[itemindex]];
                }else{
                    this.warning('没找到');
                }
            }
        },
        data() {
            return {
                loadShow: false,

                current: {
                    //查询口令
                    passwd:"987654123",
                    //环境
                    env: "",
                    //查询方式
                    query_type:"",

                    output: "",

                    appConfig: [],
                    appConfigList: [],

                    card_show: false,

                    active_key: 0,

                    offerid: "",
                    //表格高度 表头40，行高48
                    height: "520"
                },
                tools_env: config.open_tools_env,

                applist:[
                    {
                        title: 'FOfferID',
                        key: 'FOfferID',
                        sortable: true,
                        filter: {
                            type: 'Input'
                        },
                        render: (h,params) => {
                            return h('Tooltip', {
                                props: { placement: 'top' }
                            }, [
                                params.row[params.column.key],
                                h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row[params.column.key].substring(0, 50))
                            ]);
                        }
                    },
                    {
                        title: 'FServiceCode',
                        key: 'FServiceCode',
                        sortable: true,
                        render: (h,params) => {
                            return h('Tooltip', {
                                props: { placement: 'top' }
                            }, [
                                params.row[params.column.key],
                                h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row[params.column.key].substring(0, 50))
                            ]);
                        },
                        filter: {
                            type: 'Input'
                        }
                    },
                    {
                        title: 'FOfferName',
                        key: 'FOfferName',
                        render: (h,params) => {
                            return h('Tooltip', {
                                props: { placement: 'top' }
                            }, [
                                params.row[params.column.key],
                                h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row[params.column.key].substring(0, 50))
                            ]);
                        },
                        filter: {
                            type: 'Input'
                        }
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