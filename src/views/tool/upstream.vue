<template>
 <div>
     <Row :gutter="16">
         <Col span="12">
             <Row :gutter="16" style="margin-bottom: 16px">
             <Col span="8">
                 <Input v-model="current.FUpstreamName" placeholder="FUpstreamName">
                     <span slot="prepend">FUpstreamName</span>
                 </Input>
             </Col>
             <Col span="8">
                 <Input  v-model="current.Fport" placeholder="Fport">
                     <span slot="prepend">Fport</span>
                 </Input>
             </Col>
                 <Col span="8">
                     <Input  v-model="current.Fweight" placeholder="Fweight">
                         <span slot="prepend">Fweight</span>
                     </Input>
                 </Col>
             </Row>
             <Row :gutter="16" style="margin-bottom: 16px">
                 <Col span="8">
                     <Input v-model="current.Fmax_fails" placeholder="Fmax_fails">
                         <span slot="prepend">Fmax_fails</span>
                     </Input>
                 </Col>
                 <Col span="8">
                     <Input  v-model="current.Ffail_timeout" placeholder="Ffail_timeout">
                         <span slot="prepend">Ffail_timeout</span>
                     </Input>
                 </Col>
                 <Col span="8">
                     <Input  v-model="current.Fkeepalive" placeholder="Fkeepalive">
                         <span slot="prepend">Fkeepalive</span>
                     </Input>
                 </Col>
             </Row>
             <Row :gutter="16" style="margin-bottom: 16px">
                 <Col span="8">
                     <Input v-model="current.FIsValid" placeholder="FIsValid">
                         <span slot="prepend">FIsValid</span>
                     </Input>
                 </Col>

             </Row>
             <option-block>
                 <FormItem>
                     <Button type="primary" @click="getText()">确定</Button>
                     <Button type="primary" @click="export_result()">复制结果</Button>
                 </FormItem>

             </option-block>
             <Input v-model="current.iplist" :rows="14" type="textarea" placeholder="ip列表,一行一ip"></Input>
         </Col>
         <Col span="12">
             <Input v-model="output" :rows="19" type="textarea" placeholder=""></Input>
         </Col>
     </Row>
 </div>
</template>

<script>
    import axios from 'axios'
    export default {
        name: "upstream",
        computed: {
            output() {
                return this.getText();
            },
        },
        data() {
            return {
                current: {
                    iplist: "",
                    FUpstreamName: "",
                    Fport: "",
                    Fweight: "10",
                    Fmax_fails: "200",
                    Ffail_timeout: "30s",
                    Fkeepalive: "100",
                    FIsValid:"1",
                }
            }
        },
        created() {
            this.current = Object.assign(this.current, this.$getToolData());
        },
        methods: {
            /**
             * 示例(一般为从DB中查出来的结果 直接复制粘贴):
             * FOfferID: 1019885135
             * FAppID: 1019885135
             * FMerchantID: 99679153
             * 期望结果:
             * insert into table set FOfferID='1019885135', FAppID='1019885135', FMerchantID='99679153';
             * */
            getText(){
                console.log(this.current.Fmax_fails);

                let iplists = this.current.iplist.split(`\n`);
                let return_sql='';
                for (let i=0; i < iplists.length; i++ ){
                    let ip = iplists[i].trim();
                    //insert into unipay_conf.t_oversea_ngx_upstream_config values("dcserver.com","172.24.12.17", "1202","10","200","30s","100","1",now());
                    //insert into t_oversea_ngx_upstream_config             values("dcserver.com","172.24.12.17", "1202","10","200","30s","100",1,now());
                    return_sql += `insert into unipay_conf.t_oversea_ngx_upstream_config values("${this.current.FUpstreamName}","${ip}", "${this.current.Fport}","${this.current.Fweight}","${this.current.Fmax_fails}","${this.current.Ffail_timeout}","${this.current.Fkeepalive}",${this.current.FIsValid},now()); \n`
                    console.log(ip);
                }
                this.$saveToolData(this.current);
                return return_sql;
            },
            export_result(){
                this.$clipboardCopy(this.getText());

            }
        }
    }
</script>

<style scoped>

</style>
