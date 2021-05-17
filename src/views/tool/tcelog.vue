<template>
    <div>
        <BackTop></BackTop>
        <option-block>
            <FormItem label="选择环境">
                <Select v-model="current.env" style="width:200px">
                    <Option v-for="(d,k) in env" :value="d.host" :key="k">{{ d.name }}</Option>
                </Select>
            </FormItem>

            <FormItem label="RequestID" style="width:400px">
                <Input v-model="current.uuid" placeholder="RequestID、UUID"></Input>
            </FormItem>

            <!--<FormItem label="日期" >-->
                <!--<DatePicker type="date" format="yyyy-MM-dd" :options="options1" placeholder="日期" v-model="current.date"></DatePicker>-->
            <!--</FormItem>-->
        </option-block>
        <option-block>
            <FormItem>
                <Checkbox v-model="current.detail">详细日志</Checkbox>
            </FormItem>
            <FormItem>
                <ButtonGroup>
                    <Button type="primary" @click="handle();">查询</Button>
                    <Button type="primary" @click="url_decode();">url解码</Button>

                </ButtonGroup>
            </FormItem>
        </option-block>

        <div>
            <!-- 过度动画 -->
            <Spin fix v-if="loadShow">
                <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                <div>Loading</div>
            </Spin>
           <code-highlight lang="html" :code="this.current.output"></code-highlight>
        </div>
        
    </div>
</template>
<script>
    import {formatDate} from "../../helper";
    import axios from 'axios'
    import request from "ajax-request"

    export default {
        created() {
            this.current.date=this.current.date? this.current.date:formatDate(new Date());
            this.current = Object.assign({},this.current,this.$getToolData("input"))
        },
        methods: {
            handle() {
                this.loadShow = true;
                setTimeout(() => {
                    this.loadShow = false
                }, 3000)
                if (this.current.uuid) {
                    this.loadShow = true;
                    axios.get(this.current.url+`?uuid=${this.current.uuid}&eshost=${this.current.env}&all_log=${this.current.detail}&system=`)
                        .then((response) => {
                            this.loadShow = false;
                            this.current.output = response.data;
                            this.$saveToolData(this.current);
                        })
                        .catch(function (error) {
                            console.log(error);
                        });

                    //this.current.output = this.current.env + this.current.key1 + this.current.key2;
                }
                console.log(this.current);
                this.$saveToolData(this.current);
            },
            url_decode(){
                console.log('url解码');
                // console.log(this.current.output);

                this.current.output = decodeURIComponent(this.current.output);
            }
        },
        data() {
            return {
                loadShow: false,
                show:true,
                current:{
                    url: "http://9.134.4.250/tcelog/check_es.php",
                    env: "null",
                    uuid: "",
                    detail: false,
                    date: "",
                    output: "查询结果",
                },

                env: [
                    {"name": "yf-1", "host": "ocloud-billing-midas-monitor-server.yf-1.tcepoc.fsphere.cn"},
                    {"name": "M14", "host":"ocloud-billing-midas-monitor-server.m14-v6-poc-az1.tcecloud.fsphere.cn"},
                    {"name": "M16", "host":"ocloud-billing-midas-monitor-server.yf-m16.tcecqpoc.fsphere.cn"},
                    {"name": "M17", "host":"ocloud-billing-midas-monitor-server.yf-m17.tcecqpoc.fsphere.cn"},
                    {"name": "公有云测试jping", "host":"ocloud-bmppro-billing-midas-chitu-nginx.jping.tcecqpoc.fsphere.cn"},
                    {"name": "公有云开发", "host":"ocloud-bmppro-billing-midas-monitor-server.jfee.tcecqpoc.fsphere.cn"},
                    {"name": "工业云-内部环境", "host":"9.134.4.250"},
                    {"name": "工业云-G环境", "host":"109.244.35.125"},
                    {"name": "工业云-H环境", "host":"109.244.35.117"},
                    {"name": "工业云-ii环境", "host":"109.244.35.116"},
                    {"name": "工业云-广州环境", "host":"150.158.218.184"},
                    {"name": "工业云-正式环境", "host":"wemake.tencent.com"},
                    {"name": "工业云-张家港", "host":"imtenrent.com"}
                ],

                options1: {
                    shortcuts: [
                        {
                            text: '今天',
                            value () {
                                return new Date();
                            }
                        },
                        {
                            text: '昨天',
                            value () {
                                const date = new Date();
                                date.setTime(date.getTime() - 3600 * 1000 * 24);
                                return date;
                            }
                        },
                        {
                            text: '一周前',
                            value () {
                                const date = new Date();
                                date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                                return date;
                            }
                        }
                    ]
                }
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