<template>
    <div>
        <BackTop></BackTop>
        <option-block>
            <FormItem label="选择环境">
                <Select v-model="current.env" style="width:200px">
                    <Option v-for="(d,k) in env" :value="d.url" :key="k">{{ d.name }}</Option>
                </Select>
            </FormItem>

            <FormItem label="关键字1" >
                <Input v-model="current.key1" placeholder="错误码、UUID"></Input>
            </FormItem>

            <FormItem label="关键字2" >
                <Input v-model="current.key2" placeholder="offerid"></Input>
            </FormItem>

            <FormItem label="日期" >
                <DatePicker type="date" format="yyyy-MM-dd" :options="options1" placeholder="日期" v-model="current.date"></DatePicker>
            </FormItem>
        </option-block>
        <option-block>
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

        <div v-if="current.key1==='0-0-0'">
            Now you see me
        </div>
        <div v-else>
            Now you don't
        </div>
    </div>
</template>
<script>
    import {formatDate} from "../../helper";
    import axios from 'axios'

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
                if (this.current.key1) {
                    this.loadShow = true;
                    axios.get(this.current.env+"?requesttype=server"+"&searchkey="+this.current.key1+"&searchkey2="+this.current.key2+"&date="+formatDate(this.current.date, "yyyy-MM-dd"))
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
                    env: "null",
                    key1: "",
                    key2: "",
                    date: "",
                    output: "查询结果",
                },

                env: [
                    {"name": "应用云沙箱&DEV", "url": "http://sandbox.api.openmidas.com/hawkenliu_tools/get_vue.php"},
                    {"name": "微校saas", "url":"saas"},
                    {"name": "云南", "url":"https://midas.ybsjyyn.com/checkerr/tools/get_vue.php"},
                    {"name": "怡宝", "url":"https://mem-notify.crbeverage.com/checkerr/tools/get_vue.php"},
                    {"name": "微校仲恺", "url":"https://zhkupay.weixiao.qq.com/checkerr/tools/get_vue.php"},
                    {"name": "腾讯行政", "url":"https://txmidas.weixiao.qq.com/checkerr/tools/get_vue.php"},
                    {"name": "微校广外", "url":"https://gwwxzf.gdufs.edu.cn/checkerr/tools/get_vue.php"},
                    {"name": "游武隆",   "url":"https://midas.trip.wlkst.com/checkerr/tools/get_vue.php"},
                    {"name": "聚鑫现网",   "url":"https://midas.cpdp.qq.com/checkerr/tools/get_vue.php"},
                    {"name": "智慧校园",   "url":"https://midas.campus.qq.com/checkerr/tools/get_vue.php"},
                    {"name": "聚鑫现网",   "url":"https://midas.cpdp.qq.com/checkerr/tools/get_vue.php"},
                    {"name": "聚鑫沙箱",   "url":"https://midas.cpdpsandbox.qq.com/checkerr/tools/get_vue.php"}

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