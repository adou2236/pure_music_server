var Mysql = require('../config/database');//引入mysql实例化
var Users = require('./users')
var logger = request('./logger')


Mysql.sync({
    force: true,//是否清空数据库表
}).then(function() {
    logger.info('ok');
});

