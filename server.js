var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var models = require('./db');
var mysql = require('mysql');

// 连接数据库
var conn = mysql.createConnection(models.mysql);
conn.connect();

// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use('/public', express.static('public'));

app.get('/index.html', function (req, res) {
    res.sendFile(__dirname + "/" + "index.html");
})

app.get('/login.html', function (req, res) {
    res.sendFile(__dirname + "/" + "login.html");
})

app.get('/backend_login.html', function (req, res) {
    res.sendFile(__dirname + "/" + "backend_login.html");
})

app.get('/backend.html', function (req, res) {
    res.sendFile(__dirname + "/" + "backend.html");
})

app.post('/process_post', urlencodedParser, function (req, res) {
    // 输出 JSON 格式
    var response = 'insert into forms(account, password) values (?, ?)';
    conn.query(response, [req.body.first_name, req.body.last_name], function (err, result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonWrite(res, result);
        }
    })
})

app.post('/backend_login', urlencodedParser, function (req, res) {
    // 输出 JSON 格式
    if (req.body.first_name == "test" && req.body.last_name == "123456") {
        res.sendFile(__dirname + "/" + "backend.html");
    }else{
        res.end("the username or the password is incorrect");
    }
})

app.get('/backend', urlencodedParser, function (req, res) {
    // 输出 JSON 格式
        var response = 'select account, password from forms;';
        conn.query(response, [], function (err, result) {
            if (err) {
                console.log(err);
            }
            if (result) {
                jsonWrite(res, result);
            }
        })
})

var server = app.listen(8081, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("应用实例，访问地址为 http://%s:%s", host, port)

})

var jsonWrite = function(res, ret) {
    if(typeof ret === 'undefined') {
        res.json({
            code: '1',
            msg: '操作失败'
        });
    } else {
        res.json(ret);
    }
};
