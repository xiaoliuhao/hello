<template>
    <div>
        <Row :gutter="16">
            <Col span="16">
                <Row :gutter="16">
                    <Col span="16">
                        <Input v-model="current.mqAction" style="margin-bottom: 16px">
                        <Select v-model="current.mqAction" slot="prepend" prefix="ios-home"  placeholder="命令字" style="width:200px">
                            <OptionGroup label="Topic配置">
                            <Option style="text-align: left" v-for="(v,k) in example.local_action" :value="v.cmd" :key="k">{{ v.text }}</Option>
                            </OptionGroup>
                            <OptionGroup label="Topic查询">
                            <Option style="text-align: left" v-for="(v,k) in example.remote_action" :value="v.cmd" :key="k">{{ v.text }}</Option>
                            </OptionGroup>
                        </Select>
                        </Input>
                    </Col>
                    <Col span="8">
                        <Input v-model="current.env" style="margin-bottom: 16px;">
                            <Select slot="prepend" placeholder="选择环境" style="width:100px">
                                <Option v-for="(v,k) in tools_env" :value="v.url" :key="k">{{ v.name }}</Option>
                            </Select>
                        </Input>
                    </Col>
                    <Col span="6" v-show="false">
                        <Input type="password" v-model="current.passwd">
                            <div slot="prepend" style="width: 50px">查询口令</div>
                        </Input>
                    </Col>
                </Row>

                <Row :gutter="16" v-if="(current.mqAction=='addTopic') || (current.mqAction == 'clearDeadTopic') || (current.mqAction=='updateProducerGroup') || (current.mqAction=='updateConsumerGroup') ">
                    <Col span="8">
                        <Input v-model="current.topicname" style="margin-bottom: 16px;">
                            <div slot="prepend" style="width: 50px">Topic</div>
                        </Input>
                    </Col>
                    <Col span="8">
                        <Input v-model="current.producerName" v-show="current.isAlterProdecer">
                            <div slot="prepend" style="width: 90px">ProducerGroup</div>
                        </Input>
                    </Col>
                    <Col span="8">
                        <Input v-model="current.consumerName" v-show="current.isAlterConsumer">
                            <div slot="prepend" style="width: 90px">ConsumerGroup</div>
                        </Input>
                    </Col>
                </Row>

                <Row :gutter="16" v-if="(current.mqAction=='queryMsgByID') || (current.mqAction=='queryMsgBykey')">
                    <Col span="8">
                        <Input v-model="current.topicname">
                            <div slot="prepend" style="width: 50px">Topic</div>
                        </Input>
                    </Col>
                    <Col span="8">
                        <Input v-model="current.topicname" v-show="current.mqAction=='queryMsgByID'" >
                            <div slot="prepend" style="width: 90px">消息ID</div>
                        </Input>
                    </Col>
                    <Col span="8">
                        <Input v-model="current.topicname" v-show="current.mqAction=='queryMsgBykey'">
                            <div slot="prepend" style="width: 90px">消息key</div>
                        </Input>
                    </Col>
                </Row>

                <Row :gutter="16" v-if="current.mqAction=='queryMsgByTime'">
                    <Col span="8">
                        <Input v-model="current.topicname">
                            <div slot="prepend" style="width: 50px">Topic</div>
                        </Input>
                    </Col>
                    <Col span="6">
                        <Input v-model="current.topicname" >
                            <div slot="prepend" style="width: 50px">开始时间</div>
                        </Input>
                    </Col>
                    <Col span="6">
                        <Input v-model="current.topicname">
                            <div slot="prepend" style="width: 50px">结束时间</div>
                        </Input>
                    </Col>
                    <Col span="4">
                        <Input v-model="current.lineCount">
                            <div slot="prepend" style="width: 40px">行数</div>
                        </Input>
                    </Col>
                </Row>
                <div v-if="(current.mqAction=='addTopic') || (current.mqAction=='updateProducerGroup') || (current.mqAction=='updateConsumerGroup') ">
                <option-block>
                    <FormItem>
                        <Checkbox @on-change="boxChange('isAlterProdecer')"  v-model="current.isAlterProdecer">自定义ProducerGroup</Checkbox>
                    </FormItem>
                    <FormItem>
                        <Checkbox @on-change="boxChange('isAlterConsumer')" v-model="current.isAlterConsumer">自定义ConsumerGroup</Checkbox>
                    </FormItem>
                    <FormItem>
                        <Checkbox @on-change="boxChange('isUseProxy')" v-model="current.isUseProxy">使用mq_proxy</Checkbox>
                    </FormItem>
                </option-block>
                <Input  v-model="current.IPList" :rows="5" type="textarea" placeholder="授权IP,一行一个ip"></Input>
                </div>
                <option-block>
                    <FormItem>
                        <Button type="primary" @click="handle()">生成</Button>
                    </FormItem>
                </option-block>
                <div>
                    <Spin fix v-if="loadShow">
                        <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                        <div>Loading</div>
                        <!--<div style="word-wrap: break-word;width: 800px;">{{current.output}}</div>-->
                    </Spin>
                    <code-highlight lang="html" :code="current.output"></code-highlight>
                </div>
            </Col>

            <Col span="8">
                <Tabs value="example">
                    <TabPane label="配置" name="example">
                        <Table stripe size="small" height="300" :columns="example.columns" :data="example.local_action"></Table>
                        
                    </TabPane>
                    <TabPane label="查询" name="format" style="text-align: center">
                        <Table stripe size="small" height="300" :columns="example.columns" :data="example.remote_action"></Table>
                    </TabPane>
                </Tabs>
            </Col>
        </Row>
    </div>
</template>
<script>
    import moment from 'moment'
    export default {
        created() {
            // this.current = Object.assign(this.current, this.$getToolData())
            this.current = Object.assign(this.current, this.$getToolData(""));
            this.current.producerName = this.current.topicname+"_producer";
            this.current.consumerName = this.current.topicname+"_consumer";

        },
        computed:{
            testOutput(){
                return this.current.isAlterConsumer;
            }
        },
        methods: {
            handle(){
                this.loadShow = true;
                switch (this.current.mqAction) {
                    case "authInfo":
                        this.current.output = this.showRes();
                        break;
                    case "addTopic":
                        this.current.output = this.addTopic();
                        break;
                    case "clearDeadTopic":
                        this.current.output = this.clearDeadTopic();
                        break;
                    case "updateProducerGroup":
                        this.current.output = this.updateProducerGroup();
                        break; 
                    case "updateConsumerGroup":
                        this.current.output = this.updateConsumerGroup();
                        break; 
                    default:
                        this.current.output = "python python_admin.py "+this.current.mqAction;
                        break;
                }
                this.loadShow = false;
                this.$saveToolData(this.current);
            },
            boxChange: function(option) {
                if(this.current[option] === true){
                    this.current[option] = true;
                }else{
                    this.current[option] = false;
                }
            },
            selectAction(){
                //1.需要发送后台请求
                //添加topic需要 topic和 checkbox
                //-t topic
                //更新producer consumer 需要 topic groupname ip列表 是否使用proxy

                //2.本地生成命令
            },
            addTopic(){
                //生成调用python脚本的命令topic
                var result = `cd ${this.config.mq_admin_path};\n`;
                result += `python ${this.config.mq_admin_script} ${this.current.mqAction} -t ${this.current.topicname}; \n`;
                //创建producer命令
                result += this.updateProducerGroup();
                result += "\n";
                //创建consumer命令
                result += this.updateConsumerGroup();

                return result;
            },
            clearDeadTopic(){
                //生成调用python脚本的命令topic
                var result = `# 1. 查看topic是否有清理权限\n`;
                result += `curl -s -d "action=getTopicRoute&topic=%25DLQ%25${this.current.topicname}" http://127.0.0.1:8801/mq_admin | grep '"perm":[0-9]' --color\n`;
                result += `# 1.1 权限不为6，需要修改权限;权限为6则跳过此步骤\n`;
                result += `cd ~/dataSuite/rocketmq-broker/bin;\n`;
                result += `sh mqadmin updateTopicPerm -b 127.0.0.1:10911   -n 127.0.0.1:9876 -p 6 -t %DLQ%${this.current.topicname} \n`;
                result += `\n`;
                result += `# 2选1\n`;
                result += `# 2.1 清理死信队列,方法1\n`;
                result += `export ROCKETMQ_HOME=/data/home/midas/dataSuite/rocketmq-broker\n`;
                result += `export JAVA_HOME=/data/home/midas/dataSuite/jdk1.8.0_x64\n`;
                result += `cd ~/dataSuite/rocketmq-broker/test;\n`;
                result += `./consumer.sh 127.0.0.1:9876 TOOLS_CONSUMER Consumer %DLQ%${this.current.topicname} simple 1\n`;
                result += `\n`;
                result += `# 2.2 清理死信队列,方法2\n`;
                result += `cd ~/dataSuite/mq_admin/bin;\n`;
                // let now_time = moment(moment().format('YYYY-MM-DD')).toDate();
                let now_time = moment().format('YYYY-MM-DD');
                result += `sh cgitool.sh  exportQueueDataToFile -n 127.0.0.1:9876 -topic %DLQ%${this.current.topicname} -clusterName DefaultCluster -fileName ../data/${this.current.topicname}-${now_time}.txt\n`;


                return result;
            },
            updateProducerGroup(){
                var flag = this.current.isUseProxy ? 2 : 1;
                this.current.producerName = this.current.isAlterProdecer ? this.current.producerName : this.current.topicname+"_producer";
                //授权IP列表,先替换空格,再把换行换成, 
                var authIPList=this.current.IPList.replace(/ /g, '').replace(/\n/g, ',');
                var result = `python ${this.config.mq_admin_script} updateProducerGroup -t ${this.current.topicname} -g ${this.current.producerName} -i '${authIPList}' --flag ${flag};`;
                return result;
            },
            updateConsumerGroup(){
                var flag = this.current.isUseProxy ? 2 : 1;
                this.current.consumerName = this.current.isAlterConsumer ? this.current.consumerName : this.current.topicname+"_consumer";
                //授权IP列表,先替换空格,再把换行换成, 
                var authIPList=this.current.IPList.replace(/ /g, '').replace(/\n/g, ',');
                var result = `python ${this.config.mq_admin_script} updateConsumerGroup -t ${this.current.topicname} -g ${this.current.consumerName} -i '${authIPList}' --flag ${flag};`;
                return result;
            },
            showRes(){
                return "curl res";
            }
        },
        data() {
            return {
                loadShow: false,
                config:{
                    mq_admin_path: "~/dataSuite/mq_admin/tools",
                    mq_admin_script: "mq_admin.py"
                },
                current: {
                    passwd:"",
                    env: "",
                    mqAction:"",
                    lineCount:20,
                    output: "nodata",
                    isAlterProdecer: false,
                    isAlterConsumer: false,
                    isUseProxy: false,
                    topicname: "realwater_topic",
                    producerName: "",
                    consumerName: "",
                    input: "123",
                    IPList: ""
                },
                tools_env: [
                    {"name": "沙箱", "url":"https://sandbox"},
                    {"name": "云南", "url":"https://yunnan"}
                ],
                example: {
                    columns: [
                        {title: '命令字', key: 'cmd',   width: 120},
                        {title: '说明', key: 'text',      width: 150},
                        {title: '参数', key: 'params'}
                    ],
                    local_action: [
                        // {cmd: "delTopic",            text: "删除Topic信息",     params:"-t topic_name , if you want change the cluster , use --cluster"},
                        {cmd: "addTopic",            text: "添加topic",         params:"-t topic_name , if you want change the cluster , use --cluster"},
                        {cmd: "updateProducerGroup", text: "添加/更新生产组",    params:"-t topic_name,-i IP(split -> ,),-g groupname,--flag <1 or 2;1:not use proxy,2：use proxy>"},
                        {cmd: "updateConsumerGroup", text: "添加/更新消费组",    params:"-t topic_name,-i IP(split -> ,),-g groupname,--flag <1 or 2;1:not use proxy,2：use proxy>"},
                        {cmd: "clearDeadTopic",      text: "死信队列清理",       params:"-t topic_name,-i IP(split -> ,),-g groupname,--flag <1 or 2;1:not use proxy,2：use proxy>"},

                    ],
                    remote_action:[
                        {cmd: "getClusterList",      text: "查看Cluster信息",    params:"无"},
                        {cmd: "topicList",           text: "查看Topic信息",      params:"无"},
                        {cmd: "authInfo",            text: "查看当前授权关系",    params:"无"},
                        {cmd: "queryMsgByTime",      text: "按时间段查询消息",   params:"-t topic_name,--endtime/--begintime (format:2018-01-01 16:00:00),default Time interval(1 hours),--linecount, default 20"},
                        {cmd: "queryMsgByID",        text: "消息ID查询消息",     params:"-t topic_name, --msgid MSGID"},
                        {cmd: "queryMsgBykey",       text: "按消息KEY查询消息",  params:"-t topic_name, --msgkey Msgkey"},
                    ]
                }
            }
        }
    }
</script>
<style>
    .demo-spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
    }
</style>

<style scoped>
     >>> .language-html{
        word-break: break-all;
        white-space: pre-wrap;
    }
</style>