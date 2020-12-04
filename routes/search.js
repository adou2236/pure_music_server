var express = require('express');
var router = express.Router();
var Music = require('../modules/music')
var Artist = require('../modules/artist')
var Sequelize = require('sequelize');//引入sequelize
const { normalRes } = require('../unit/fn');
const Op = Sequelize.Op;

router.post('/',async (req,res)=>{
    var keyword = req.body.keywords||''
    var pageSize = req.body.pageSize||5; //一页条数
    var currentPage = parseInt(req.body.currentPage)||1;//当前页数
    var lastPage = currentPage - 1;
    if (currentPage <= 1) {
      lastPage = 1;
    }
    var nextPage = currentPage + 1;
    const result = await Music.findAndCountAll({
          order: [
              ['play_times', 'DESC']
          ],  // 排序
          where: {
            [Op.or]:[
            {song_name: {
                // 模糊查询
                [Op.like]:`%${keyword}%`
              }},
            {author:{
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
    const artist = req.query.author
    const result = await Music.findAll({
         order: [
             ['download_times', 'DESC']
         ],  // 排序
         where: {
          author: author, // 精确查询
         },
       })
    res.send(result)
})
//新歌排行（7天内排行，可以添加种类，作者等）
router.post('/topList',async(req,res)=>{
  var searchParam={
    ...req.body,
  }
  delete searchParam.newset
  if(req.body.newset){
    searchParam.create_time={[Op.lt]: new Date(),[Op.gt]: new Date(new Date() - 2 * 24 * 60 * 60 * 1000)
    }
  }
  var arr = []
  arr = Object.keys(searchParam).map((val, index)=>{
    var o = new Object()
    o[val] = searchParam[val]
    return o
  })
  const sqlParam = {[Op.and]:arr}
  const result = await Music.findAll({
    order: [
        ['play_times', 'DESC']
    ],  // 排序
    where: sqlParam,
    limit:20
  })
  var response = normalRes({data:{content:result}})
  res.status(200).send(response)

})

module.exports=router