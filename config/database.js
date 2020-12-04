var setting = require('../config/setting');//引入灵活配置文件
var Sequelize = require('sequelize');//引入Sequelize
var logger=require('../modules/logger')



var Mysql = new Sequelize(setting.mysql.database, setting.mysql.user, setting.mysql.password, {
    host: setting.mysql.host, //数据库服务器ip
    dialect: 'mysql', //数据库使用mysql
    port: setting.mysql.port, //数据库服务器端口
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
});

Mysql.authenticate().then(function() {
    logger.info("数据库连接成功");
}).catch(function(err) {
    //数据库连接失败时打印输出
    logger.error(err);
    throw err;
});
 
module.exports = Mysql;