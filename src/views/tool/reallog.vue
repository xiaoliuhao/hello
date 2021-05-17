<template>
    <div>
        <BackTop></BackTop>
        <option-block>
            <FormItem label="选择环境">
                <Select v-model="current.env" style="width:200px">
                    <Option v-for="(d,k) in env" :value="d.url" :key="k">{{ d.name }}</Option>
                </Select>
            </FormItem>
            <FormItem label="日志类型">
                <Select v-model="current.request_type" style="width:150px">
                    <Option v-for="(d,k) in request_type" :value="d.value" :key="k">{{ d.type }}</Option>
                </Select>
            </FormItem>

            <FormItem label="关键字1" >
                <Input v-model="current.key1" placeholder="错误码、UUID"></Input>
            </FormItem>

            <FormItem label="关键字2" v-show="current.request_type===request_type[0].value" >
                <Input v-model="current.key2" placeholder="offerid"></Input>
            </FormItem>

            <FormItem label="日期" >
                <DatePicker type="date" format="yyyy-MM-dd" placeholder="日期" v-model="current.date"></DatePicker>
            </FormItem>

            <FormItem label="查询口令" >
                <Input type="password" v-model="current.search_code"></Input>
            </FormItem>
        </option-block>
        <option-block>
            <FormItem>
                <ButtonGroup>
                    <Button type="primary" @click="handle()">查询</Button>
                </ButtonGroup>
            </FormItem>
        </option-block>

        <div>
            <!--<div style="word-wrap: break-word;width: 800px;">{{current.output}}</div>-->
            <code-highlight lang="html" v-if="show" :code="this.current.output"></code-highlight>
        </div>
    </div>
</template>
<script>
    import {formatDate} from "../../helper";
    import axios from 'axios'

    export default {
        created() {
            this.current.request_type = this.request_type[0].value;
            this.current.date=formatDate(new Date());
            this.current = Object.assign({},this.current,this.$getToolData("input"))
        },
        methods: {
            handle() {
                console.log(formatDate(this.current.date, "yyyy-MM-dd"));
                console.log(this.current.request_type);
                if (this.current.key1) {
                    if (this.current.request_type==='sys'){
                        this.current.key2='';
                    }
                    const request_url = this.current.env + "?func=GetRealwaterLog"+"&code="+this.current.search_code+"&key1="+this.current.key1+"&key2="+this.current.key2+"&request_type="+this.current.request_type+"&date="+formatDate(this.current.date, "yyyy-MM-dd");
                    // axios.get(this.current.env+"?func=GetRealwaterLog"+"&key1="+this.current.key1+"&key2="+this.current.key2+"&date="+formatDate(this.current.date, "yyyy-MM-dd"))
                    axios.get(request_url)
                        .then((response) => {
                            this.current.output=response.data;
                            this.$saveToolData(this.current);
                        })
                        .catch(function (error) {
                            console.log(error);
                        });

                    //this.current.output = this.current.env + this.current.key1 + this.current.key2;
                }
            }
        },
        data() {
            return {
                show:true,
                current:{
                    env: "null",
                    request_type: "seq日志",
                    key1: "",
                    key2: "",
                    date: "",
                    search_code:"",

                    output: "",
                },

                env: [
                    {"name": "应用云沙箱&DEV", "url": "http://sandbox.api.openmidas.com/hawkenliu_tools/php/index.php"},
                    {"name": "微校体验", "url":"https://tymidas.weixiao.qq.com/hawken/tools/php/index.php"},
                    {"name": "云南", "url":"https://midas.ybsjyyn.com/checkerr/tools/php/index.php"}
                ],
                request_type: [
                    {"type": "seq日志", "value":"seq"},
                    {"type": "sys日志", "value":"sys"}
                ]
            }
        },
    }
</script>
<style scoped>
    >>> .language-html{
        word-break: break-all;
        white-space: pre-wrap;
    }
</style>