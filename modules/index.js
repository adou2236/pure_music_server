var Mysql = require('../config/database');//引入mysql实例化
var Users = require('./users')

Mysql.sync({
    force: true,//是否清空数据库表
}).then(function() {
    console.log('ok');
});

