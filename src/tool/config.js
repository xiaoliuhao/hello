import {env, inArray} from "../helper";
import cache from "./cache";
import { Base64 } from 'js-base64';


// 工具缓存数据过期时间(秒)
export const TOOL_DATA_EXPIRY = 1800;
// 徽章过期时间(天)
export const BADGE_EXPIRY = 10;
// 分类徽章
export const BADGE_CATEGORY = ["open"];
// 工具徽章
export const BADGE_TOOL = ["reallog"];
// 默认常用工具
export const DEFAULT_COMMON_TOOL = [
    "mysqldump","errlog","reallog", "queryOrder","createSign","mqTools","queryRealWaterConfig","dbinsert"
];

const category = [
    {"name": "common", "title": "常用工具"},
    {"name": "open","title": "开放工具"},
    {"name": "encryption", "title": "加密解密"},
    {"name": "conversion", "title": "编码转换"},
    {"name": "tce", "title": "TCE"},
    {"name": "other", "title": "其他工具"},
];



const tool = [
    {"name": "hash", "title": "哈希(hash)", cat: ["encryption"]},
    {"name": "encrypt", "title": "加密/解密", cat: ["encryption"]},
    {"name": "base64", "title": "BASE64编码", cat: ["encryption"]},
    {"name": "url", "title": "URL编码", cat: ["conversion"]},
    {"name": "timestamp", "title": "时间戳", cat: ["open"]},
    // {"name": "qrCode", "title": "二维码", cat: ["other"]},
    {"name": "pinyin", "title": "汉字转拼音", cat: ["conversion"]},
    {"name": "escape", "title": "escape", cat: ["conversion"]},
    // {"name": "ip", "title": "IP地址查询", cat: ["other"]},
    // {"name": "code", "title": "代码格式化", cat: ["other"]},
    {"name": "unicode", "title": "Unicode", cat: ["conversion"]},
    {"name": "decimalConvert", "title": "进制转换", cat: ["conversion"]},
    {"name": "regex", "title": "正则表达式", cat: ["other"]},
    {"name": "randomString", "title": "随机字符生成", cat: ["other"]},
    // {"name": "phpArraySerialize", "title": "PHP数组/序列化", cat: ["conversion"]},
    {"name": "diffs", "title": "文本差异化对比", cat: ["other"]},
    {"name": "crontab", "title": "crontab校验", cat: ["other"]},
    // {"name": "websocket", "title": "websocket调试", cat: ["other"]},
    // {"name": "errlog", "title": "日志查询", cat: ["open"]},
    // {"name": "reallog", "title":"流水日志", cat: ["open"]},
    // {"name": "mqTools", "title":"MQ工具", cat: ["open"]},
    // {"name": "queryOrder", "title":"订单查询", cat: ["open"]},
    // {"name": "userInfo", "title":"用户详情", cat: ["open"]},
    // {"name": "queryConfig", "title":"配置查询", cat: ["open"]},
    // {"name": "queryConfig_v2", "title":"配置查询(新)", cat: ["open"]},
    // {"name": "queryDrmConfig", "title":"抵扣券查询", cat: ["open"]},
    // {"name": "queryRealWaterConfig", "title":"推送配置", cat: ["open"]},
    // {"name": "createSign", "title":"签名计算", cat: ["open"]},
    {"name": "mysqldump", "title": "mysqldump", cat: ["other"] },
    // {"name": "OCR", "title": "截图识字", cat: ["other"] },
    // {"name": "tcelog", "title": "TCE日志查询", cat: ["tce"] },
    {"name": "dbinsert", "title": "dbinsert", cat: ["other"] },
    {"name": "upstream", "title": "upstream", cat: ["other"] },
    { 'name': 'time', 'title': '时间计算器', cat: ['other'] },

];

const open_tools_env = [
    {"name": "应用云沙箱&DEV", "url":"https://sandbox.api.openmidas.com/hawkenliu_tools/php/index.php"},
];


// 徽章是否显示
const badgeIsShow = function () {
    return (Date.parse((new Date()).toString()) / 1000) - env('updateTime') < BADGE_EXPIRY * 86400
};

const getUserCommon = function () {
    let tools = cache.getNoVersion('user_common');
    return tools ? tools : DEFAULT_COMMON_TOOL;
};

const setUserCommon = function (tools) {
    cache.setnNoVersion('user_common', tools);
};

const simple_encode_key='hawkenliu_simple_key';

const  simple_encode = function (strcontent){
    console.log(strcontent.length);
    let content_arr =  Base64.encode(strcontent).split('');
    let simple_encode_key_arr = simple_encode_key.split('');
    for (let i=0; i < simple_encode_key.length; i++ ){
        if(i < content_arr.length){
            content_arr[i] += simple_encode_key_arr[i];
        }
    }
    // encode_con
    let encoded_str=content_arr.join('').replace('=','O0O0O').replace('+','o000o').replace('/','oo00o');
    // console.log(encoded_str);
    return encoded_str;
};

export default {
    tool,
    category,
    setUserCommon,
    open_tools_env,
    simple_encode,
    getToolByCategory(cat) {
        return tool.filter((t) => {
            if (cat === "common") {
                return inArray(t.name, getUserCommon())
            }
            return inArray(cat, t.cat)
        });
    },
    badgeToolIsShow(tool) {
        return badgeIsShow() && inArray(tool, BADGE_TOOL);
    },
    badgeCategoryIsShow(cat) {
        return badgeIsShow() && inArray(cat, BADGE_CATEGORY);
    },
    getOpenToolsEnv(){
        return open_tools_env;
    },
}
