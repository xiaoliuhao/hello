<template>
    <div>
        <Input v-model="current.input" :rows="7" type="textarea" placeholder="内容"></Input>
        <option-block>
            <FormItem>
                <ButtonGroup>
                    <!--<Button type="primary" @click="handle('string2unicode')">字符转Unicode</Button>-->
                    <Button type="primary" @click="handle('unicode2string')">日志转json</Button>
                </ButtonGroup>
            </FormItem>
        </option-block>
        <Input v-model="current.output" :rows="7" type="textarea" placeholder="结果"></Input>
    </div>
</template>
<script>
    export default {
        created() {
            this.current = Object.assign(this.current, this.$getToolData("input"))
        },
        methods: {
            handle(v) {
                if (this.current.input) {
                    this.current.output = this[v](this.current.input);
                    this.current.operation = v;
                    this.$clipboardCopy(this.current.output);
                    this.$saveToolData(this.current);
                }
            },
            string2unicode(string) {
                let character = String(string).split("");
                let ascii = "";
                for (let i = 0; i < character.length; i++) {
                    let code = Number(character[i].charCodeAt(0));
                    if (code > 127) {
                        let charAscii = code.toString(16);
                        charAscii = String("0000").substring(charAscii.length, 4) + charAscii;
                        ascii += "\\u" + charAscii;
                    } else {
                        ascii += character[i];
                    }
                }
                return ascii;
            },
            unicode2string(unicode) {

                let native=eval('"'+ eval('"' + unicode + '"') + '"');
                console.log(native);

                // console.log(unescape(' {\\\x22username\\\x22:\\\x229\\\x22,\\\x22password\\\x22:\\\x226\\\x22,\\\x22id\\\x22:\\\x222c8bfa56-f5d9\\\x22, \\\x22FName\\\x22:\\\x22AnkQcAJyrqpg\\\x22}'));
                // let reg=new RegExp( '\\\\x' , "g" );
                // let native=unescape(unicode.replace(reg, '%'));


                return native;
            }
        },
        data() {
            return {
                current: {
                    input: "",
                    output: "",
                    operation: ""
                }
            }
        },
    }
</script>