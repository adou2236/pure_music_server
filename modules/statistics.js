/**
 * Statistics 数据统计表
 */
var Sequelize = require('sequelize');//引入sequelize
var Mysql = require('../config/database');//引入mysql实例化


//定义Statistics统计表
var Statistics = Mysql.define('statistics', {
    name: {//下载量
        type: Sequelize.STRING,//设置类型
        allowNull: false,//是否允许为空
        primaryKey: true,//主键
    }, 
    count: {
        type:Sequelize.INTEGER
    }
}, {
    freezeTableName: true, //开启自定义表名
    tableName: 'statistics',//表名字
    timestamps:false,
    indexes: [{ // 索引
        type: 'UNIQUE', //UNIQUE、 FULLTEXT 或 SPATIAL之一
        method: 'BTREE', //BTREE 或 HASH
        fields: ['name'], //建立索引的字段数组。每个字段可以是一个字段名，sequelize 对象 (如 sequelize.fn)，或一个包含：attribute (字段名)、length (创建前缀字符数)、order (列排序方向)、collate (较验的字段集合 (排序))
    }],
    comment:"Statistics Table",//数据库表描述
});

module.exports = Statistics;//导出