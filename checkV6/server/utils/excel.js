/**
 * Created by Xiaodong on 2016/8/13.
 */
var xlsx = require('node-xlsx');
var urlencode = require('urlencode');
var formidable = require('formidable');
var fs = require("fs");
var log4jsutil = require('./logs');
var LogFile = log4jsutil.getLogger();

var excel = exports;

excel.download = function(req,res,name,fields,data) {
    var sheets = [];
    var sheet = {};
    sheet.name = "Sheet 1";
    sheet.data = [];

    var head = [];
    for(var i = 0; i < fields.length; i ++) {
        head.push(fields[i].desc);
    }
    sheet.data.push(head);

    var row = [];
    for(var i = 0; i < data.length; i ++) {
        row = [];
        for(var j = 0; j < fields.length; j ++) {
            if(fields[j].param instanceof Function) {
                row.push(fields[j].param(data[i]));
            } else if(fields[j].param.indexOf(".") < 0)
                row.push(data[i][fields[j].param]);
            else {
                if(data[i][fields[j].param.split(".")[0]])
                    row.push(data[i][fields[j].param.split(".")[0]][fields[j].param.split(".")[1]]);
                else
                    row.push(data[i][fields[j].param.split(".")[0]]);
            }
        }
        sheet.data.push(row);
    }
    sheets.push(sheet);
    var buffer = xlsx.build(sheets);
    var timestamp = new Date().getTime();
    res.setHeader('Content-Type', 'application/msexcel');
    res.setHeader("Content-Disposition", "attachment; filename=" + urlencode(name) + '_'+timestamp+".xlsx");
    res.end(buffer, 'binary');
};

excel.upload = function(req,res,callback) {
    var form=new formidable.IncomingForm();
    form.parse(req,function(err, fields, files) {
        LogFile.info("form fields:"+JSON.stringify(fields));
        LogFile.info(JSON.stringify(files))
        var pattern = new RegExp(".(xls|xlsx)$","i");
        if(!pattern.exec(files.file.name)) {
            var err = "不是合法的Excel文档";
            callback(err,null);
            return ;
        }
        if(files.file && files.file.size > 0) {
            try {
                var parsed = xlsx.parse(files.file.path);
                if(!parsed || parsed.length <= 0) {
                    var err = '文件没有数据';
                    callback(err,null,null);
                    return ;
                }
                let data = [];
                parsed.forEach(function (item,index) {
                    if (index == 0) {
                        data = data.concat(item.data)
                    }
                    if (index > 0 && item.data.length>1){
                        item.data.splice(0,1);
                        data = data.concat(item.data)
                    }
                })
                callback(null,data,fields);
            } catch(err) {
                callback(err,null);
            }
            fs.unlinkSync(files.file.path);
        } else {
            var err = '上传文件读取失败';
            callback(err,null);
        }
    });
};

excel.validate = function (fields, data) {
    if (data.length < 1) {
        throw new Error('上传文件为空文件');
        return false;
    }

    data.every(function (row, index, srcArray ) {
        if (index === 0) {
            if(row.length !== fields.length) {
                throw new Error('文件头错误，预期列数为：' + fields.length+'列,实际列数为: '+row.length+'列');
            }
            return true;
        } else {
            console.log(fields);
            for(var i = 0; i < fields.length; i ++) {
                var field = fields[i];
                if (field.required && (!row[i] || row[i] === '')) {
                    throw new Error(field.desc + '列为必填，不能为空,第：'+ (index + 1)+ '行');
                }
                if(field.validate && !field.validate(row[i], row)) {
                    throw new Error(field.desc + '列校验失败,第：'+ (index + 1)+ '行');
                }
            }
            return true;
        }
    });
};
