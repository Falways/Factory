/**
 * create by xuhang 2018/08/27
 */
var log4js = require('log4js');
let config = {
    logs4j:{
        info_filepath:'../logs/info.log',
        error_filepath:'../logs/error.log'
    }
}
console.log('日志模块加载success！')
const log4jsutil = log4js.configure({
    appenders:{
        'out':{'type':'stdout'}, // 是否在控制台打印日志
        'info':{'type':'file',filename:config.logs4j.info_filepath},
        'just-errors':{'type':'file',filename:config.logs4j.error_filepath},
        'error': {'type': 'logLevelFilter', appender: 'just-errors', level: 'error' }
    },
    categories: {
        default: { appenders: [ 'out', 'info','error' ], level: 'info' }//去掉'out'。控制台不打印日志
    }
});

module.exports = log4jsutil;