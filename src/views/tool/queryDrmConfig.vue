<template>
    <div>
        <BackTop></BackTop>
        <option-block>
            <FormItem label="选择环境">
                <Select v-model="current.env" style="width:200px">
                    <Option v-for="(d,k) in tools_env" :value="d.url" :key="k">{{ d.name }}</Option>
                </Select>
            </FormItem>

            <FormItem label="券批次id" >
                <Input v-model="current.key1" placeholder="batid"></Input>
            </FormItem>

        </option-block>
        <option-block>
            <FormItem>
                <ButtonGroup>
                    <Button type="primary" @click="handle();">查询</Button>
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
    import axios from 'axios'
    import config from "../../tool/config";

    export default {
        created() {
            this.current = Object.assign({},this.current,this.$getToolData("input"))
        },
        methods: {
            handle() {
                console.log(this.current.key1);
                if(this.current.key1 === ''){
                    this.loadShow = false;
                    this.error();
                    return true;
                }

                this.loadShow = true;
                setTimeout(() => {
                    this.loadShow = false
                }, 3000)
                if (this.current.key1) {
                    this.loadShow = true;
                    axios.get(this.current.env+"?func=GetDrmConfig&out_type=dump&batchid="+this.current.key1)
                        .then((response) => {
                            this.loadShow = false;
                            this.current.output = response.data;
                            this.$saveToolData(this.current);
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                }
                this.$saveToolData(this.current);
            },
            error () {
                this.$Message.error('券批次id不能为空');
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