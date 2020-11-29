var express = require('express');
var router = express.Router();
var Music = require('../modules/music')
var Artist = require('../modules/artist')
var Sequelize = require('sequelize');//引入sequelize
const { normalRes } = require('../unit/fn');


const Op = Sequelize.Op;

router.post('/',async (req,res)=>{
    var keyword = req.body.keywords||''
    console.log("页码",req.body)
    var pageSize = req.body.pageSize||5; //一页条数
    var currentPage = parseInt(req.body.currentPage)||1;//当前页数
    var lastPage = currentPage - 1;
    if (currentPage <= 1) {
      lastPage = 1;
    }
    var nextPage = currentPage + 1;
    console.log("页码信息",currentPage,pageSize,nextPage,lastPage)
    const result = await Music.findAndCountAll({
         order: [
             ['download_times', 'DESC']
         ],  // 排序
         where: {
           [Op.or]:[
            {name: {
                // 模糊查询
                [Op.like]:`%${keyword}%`
              }},
            {keywords:{
               [Op.like]:`%${keyword}%`
            }}
           ]
         },
         limit:  Number(pageSize),
          offset: (currentPage - 1) * pageSize
       })
    const pageInfo = {
      currentPage,
      pageSize,
      total:result.count
    }
    var response = normalRes({data:{content:result.rows,pageInfo:pageInfo}})
    res.status(200).send(response)
})
router.get('/artistList',async (req,res)=>{
    const result = await Artist.findAll()
    res.send(result)
})

router.get('/musicByArtist',async(req,res)=>{
    const artist = req.query.artist
    const result = await Music.findAll({
         order: [
             ['download_times', 'DESC']
         ],  // 排序
         where: {
          artist: artist, // 精确查询
         },
       })
    res.send(result)

})

module.exports=router