var express = require('express');
var router = express.Router();
var Users = require('../modules/users')
var Mysql = require('../config/database');
var bcryptjs = require('bcryptjs')
var JWT = require('../unit/jwt.ts')

process.env.SECRET_KEY = 'pure_music'



router.get('/',(req,res)=>{
  let sql = 'CREATE TABLE users(uuid int,email varchar(255),password varchar(255),state boolean)'
  Mysql.query(sql,(err,result)=>{
    if(err) throw err
    else {
      res.send('table create success',result)
    }
  })
})

router.get('/allUsers', async(req, res) => {
  const result = await Users.findAll()
  res.send(result)
  
});

router.post('/addNewUser',async(req,res)=>{
  var newUser = {...req.body}
  Users.findOne({where:{email:req.body.email}}).then(result=>{
    if(!result){
      Users.create(newUser).then(data=>{
        res.send('创建成功')
      }).catch(err=>{
        res.send(err.message)
      })
    }else{
      res.send("该邮箱已注册过")
    }
  }).catch(err=>{
    res.send(err).status(500)
  })
})

router.post('/modifyUser',async(req,res)=>{
  Users.findOne({where:{email:req.body.email}}).then(result=>{
  if(result){
    if(bcryptjs.compareSync(req.body.oldPassword,result.password)){
      if(req.body.newPassword){
        result.password = req.body.newPassword
      }
      result.username=req.body.username
      const qu = result.save()
      res.send('change success')

    }else{
      res.send("原密码错误")
    }
  }else{
    res.send("未注册")
  }}).catch(err=>{
    res.send(err)
  })
})

router.post('/login',async(req,res)=>{
  const result = await Users.findOne({where:{email:req.body.email}})
  if(result){ 
    var ip = req.headers['x-real-ip'] ? req.headers['x-real-ip'] : req.ip.replace(/::ffff:/, '')
    if(bcryptjs.compareSync(req.body.password,result.password)){
      result.last_ip=ip
      result.save()
      delete result.dataValues.password
      var jwt = new JWT();
      const token = jwt.generate(result.dataValues)
      res.send(token)
    }else{
      res.send("密码错误")
    }
  }else{
    res.send("未注册")
  }
})

router.post('/test',async(req,res)=>{
  res.send('aaa')
})

module.exports = router;
