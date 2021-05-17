<template>
 <div>
     <Row :gutter="16">
         <Col span="12">
             <Input v-model="base64" :rows="14" type="textarea" placeholder="粘贴图片"></Input>
         </Col>
         <Col span="12">
             <Input v-model="text" :rows="14" type="textarea" placeholder="识别结果"></Input>
         </Col>
     </Row>
 </div>
</template>

<script>
    import axios from 'axios'
    export default {
        name: "ocr",
        data() {
            return {
                base64:"",
                text:""
            }
        },
        created() {
            const that = this
            document.body.addEventListener('paste', function (event)  {
                let items = event.clipboardData && event.clipboardData.items;
                let file = null;
                if (items && items.length) {
                    // 检索剪切板items
                    for (let i = 0; i < items.length; i++) {
                        if (items[i].type.indexOf('image') !== -1) {
                            file = items[i].getAsFile();
                            break;
                        }
                    }
                }
                let oFileReader = new FileReader();
                oFileReader.onloadend = function (e) {
                    let base64 = e.target.result
                    that.base64 = "1111111"
                    that.base64 = base64

                    that.getText(base64);
                }
                oFileReader.readAsDataURL(file);
            })
        },
        methods: {
            getText(base64){
                axios.get("http://9.134.18.111:8080?base64="+base64)
                    .then((response) => {
                        this.text = response.data
                        console.log(response)
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        }
    }
</script>

<style scoped>

</style>
