var express = require('express');
var {getRealUrl} = require('../unit/fn')
var router = express.Router();
var Music = require('../modules/music')
var Sequelize = require('sequelize');//引入sequelize


const Op = Sequelize.Op;
//统计播放量
router.get('/:music_id',async (req,res)=>{
    const music_id = req.params.music_id
    try {
        const result = await Music.update({
            count:Sequelize.literal('play_times+1')
        },{where:{music_id:music_id}})
        res.send({})
    } catch (error) {
        res.send(error)
    }
})

router.get('/analyse/:music_id',async (req,res)=>{
    const music_id = req.params.music_id
    getRealUrl(music_id)
   
})

module.exports=router