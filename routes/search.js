var express = require('express');
var router = express.Router();
var Music = require('../modules/music')
var Artist = require('../modules/artist')
var Sequelize = require('sequelize');//引入sequelize


const Op = Sequelize.Op;

router.get('/',async (req,res)=>{
    const result = await Music.findAll({
         order: [
             ['download_times', 'DESC']
         ],  // 排序
         where: {
           // name: 'cheny', // 精确查询
           [Op.or]:[
            {name: {
                // 模糊查询
                [Op.like]:`%${req.query.keywords}%`
              }},
            {keywords:{
               [Op.like]:`%${req.query.keywords}%`
            }}
           ]
           
         },
       })
    res.send(result)
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