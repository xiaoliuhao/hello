import Vue from 'vue'
import Router from 'vue-router'
import {stat} from "./helper";

Vue.use(Router);

// 路由配置
const routes = [
    {
        path: "/tool/base64",
        component: r => require(['./views/tool/base64.vue'], r)
    },
    {
        path: "/tool/code",
        component: r => require(['./views/tool/code.vue'], r)
    },
    {
        path: "/tool/decimalConvert",
        component: r => require(['./views/tool/decimalConvert.vue'], r)
    },
    {
        path: "/tool/diffs",
        component: r => require(['./views/tool/diffs.vue'], r)
    },
    {
        path: "/tool/encrypt",
        component: r => require(['./views/tool/encrypt.vue'], r)
    },
    {
        path: "/tool/hash",
        component: r => require(['./views/tool/hash.vue'], r)
    },
    {
        path: "/tool/ip",
        component: r => require(['./views/tool/ip.vue'], r)
    },
    {
        path: "/tool/phpArraySerialize",
        component: r => require(['./views/tool/phpArraySerialize.vue'], r)
    },
    {
        path: "/tool/pinyin",
        component: r => require(['./views/tool/pinyin.vue'], r)
    },
    {
        path: "/tool/qrCode",
        component: r => require(['./views/tool/qrCode.vue'], r)
    },
    {
        path: "/tool/randomString",
        component: r => require(['./views/tool/randomString.vue'], r)
    },
    {
        path: "/tool/regex",
        component: r => require(['./views/tool/regex.vue'], r)
    },
    {
        path: "/tool/timestamp",
        component: r => require(['./views/tool/timestamp.vue'], r)
    },
    {
        path: "/tool/unicode",
        component: r => require(['./views/tool/unicode.vue'], r)
    },
    {
        path: "/tool/url",
        component: r => require(['./views/tool/url.vue'], r)
    },
    {
        path: "/tool/crontab",
        component: r => require(['./views/tool/crontab.vue'], r)
    },
    // {
    //     path: "/tool/websocket",
    //     component: r => require(['./views/tool/websocket.vue'], r)
    // },
    // {
    //     path: "/tool/errlog",
    //     component: r => require(['./views/tool/errlog.vue'], r)
    // },
    // {
    //     path: "/tool/reallog",
    //     component: r => require(['./views/tool/reallog.vue'], r)
    // },
    // {
    //     path: "/tool/mqTools",
    //     component: r => require(['./views/tool/mqTools.vue'], r)
    // },
    {
        path: "/tool/mysqldump",
        component: r => require(['./views/tool/mysqldump.vue'], r)
    },
    // {
    //     path: "/tool/queryConfig",
    //     component: r => require(['./views/tool/queryConfig.vue'], r)
    // },
    // {
    //     path: "/tool/queryConfig_v2",
    //     component: r => require(['./views/tool/queryConfig_v2.vue'], r)
    // },
    // {
    //     path: "/tool/queryOrder",
    //     component: r => require(['./views/tool/queryOrder.vue'], r)
    // },
    // {
    //     path: "/tool/userInfo",
    //     component: r => require(['./views/tool/userInfo.vue'], r)
    // },
    // {
    //     path: "/tool/createSign",
    //     component: r => require(['./views/tool/createSign.vue'], r)
    // },
    // {
    //     path: "/tool/queryDrmConfig",
    //     component: r => require(['./views/tool/queryDrmConfig.vue'], r)
    // },
    // {
    //     path: "/tool/queryRealWaterConfig",
    //     component: r => require(['./views/tool/queryRealWaterConfig.vue'], r)
    // },
    // {
    //     path: "/tool/escape",
    //     component: r => require(['./views/tool/escape.vue'], r)
    // },
    // {
    //     path: "/tool/tcelog",
    //     component: r => require(['./views/tool/tcelog.vue'], r)
    // },
    // {
    //     path: "/tool/OCR",
    //     component: r => require(['./views/tool/ocr.vue'], r)
    // },
    {
        path: "/tool/dbinsert",
        component: r => require(['./views/tool/dbinsert.vue'], r)
    },
    // {
    //     path: "/tool/upstream",
    //     component: r => require(['./views/tool/upstream.vue'], r)
    // },
    {
        path: "/tool/time",
        component: r => require(['./views/tool/time.vue'], r)
    },
];

const router = new Router({routes});

stat('index');

router.afterEach(to => {
    stat('tool', {tool: to.path})
});

export default router
