var express = require('express');
var router = express.Router();
var Music = require('../modules/music')
var Artist = require('../modules/artist')
var Sequelize = require('sequelize');//引入sequelize

router.post('/artistAdd',(req,res)=>{
  var newArtist = {...req.body}
  Artist.findOne({where:{name:req.body.name}}).then(result=>{
    if(!result){
      Artist.create(newArtist).then(data=>{
        res.send('创建成功')
      }).catch(err=>{
        res.send(err.message)
      })
    }else{
      res.send("存在该艺术家")
    }
  }).catch(err=>{
    res.send(err).status(500)
  })
})

router.post('/musicAdd',async(req,res)=>{
  var newMusic = {...req.body}
  const data = await Music.create(newMusic)
  if(data.dataValues&&data.dataValues.artist){
    const result = await Artist.findOne({where:{name:data.artist}})
    if(!result){
      Artist.create({name:data.artist})
    }
    res.send("done")
  }else{
    res.send("err")
  }

})

module.exports = router;