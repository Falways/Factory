var db = require('../db/generate').db;
module.exports = {
    getTop5:function (callback) {
        let sql = 'select * from history order by id desc limit 5';
        let sqlParams = [];
        db.all(sql,sqlParams,callback);
    },
    insertOne:function (state,time,url,v4addr,v6addr,v4http,v6http,v4https,v6https,supportV4,supportV6,score,callback) {
        let sql = 'insert into history(state,time,url,v4addr,v6addr,v4http,v6http,v4https,v6https,supportV4,supportV6,score) values(' +
            '?,?,?,?,?,?,?,?,?,?,?,?)';
        let sqlParams = [state,time,url,v4addr,v6addr,v4http,v6http,v4https,v6https,supportV4,supportV6,score];
        db.all(sql,sqlParams,callback);
    }
}