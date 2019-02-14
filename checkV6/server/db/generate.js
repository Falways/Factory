/**
 * sqlite3生成内嵌表
 * create by xuhang 2018/10/29
 */
var fs = require("fs");
var path = require('path');
var file = path.resolve(__dirname,'./checkV6.db');
var exists = fs.existsSync(file);
var sqlite3 = require("sqlite3").verbose();
if(!exists) {
    console.log("Creating DB file.");
    fs.openSync(file, "w");
}
var Generate = function () {

}
var db = new sqlite3.Database(file);
Generate.prototype.init = function () {
    db.serialize(function() {
        if(!exists) {
            db.run(`CREATE TABLE history (
        id integer primary key autoincrement,
        state text,
        time text,
        url text,
        v4addr text,
        v6addr text,
        v4http text,
        v6http text,
        v4https text,
        v6https text,
        supportV4 text,
        supportV6 text,
        score text)`);
            db.each("SELECT * From history", function(err, row) {
                console.log(row.id + ": " + row.state);
            });
        }
    });


}

exports.db = db;
exports.init = function () {
    var generate = new Generate();
    generate.init();
    return generate;
};
