var express = require('express');
var router = express.Router();
var Music = require('../modules/music')
var Sequelize = require('sequelize');//引入sequelize


const Op = Sequelize.Op;

router.get('/:music_id',async (req,res)=>{
    const music_id = req.params.music_id
    try {
        const data = await Music.findOne({where:{uuid:music_id}})
        data.play_times++
        const result = await data.save()
        res.send(result)
    } catch (error) {
        res.send(error)
    }
})

module.exports=router