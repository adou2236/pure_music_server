var http = require('http');
var express = require('express');
var fs=require("fs");
var Statistics = require('../modules/statistics')
var Sequelize = require('sequelize');//引入sequelize
var multer  = require('multer')

const { normalRes } = require('../unit/fn');


var router = express.Router();
var upload = multer({
  storage: multer.diskStorage({
      destination: function (req, file, cb) {
          cb(null, './');
      },
      filename: function (req, file, cb) {
          //file.originalname上传文件的原始文件名
          var changedName = encodeURIComponent(file.originalname);
          cb(null, changedName);
      },
      fileFilter: function(req, file, cb){
        if(file.mimetype == 'application/vnd.android.package-archive'){
            cb(null, true)
        } else {
            cb(null, false)
        }
    }
  })
});


router.get('/', (req, res, next) => {
　//第一种方式
  //var f="F:/ftproot/NW.js.docx";
  //var f="f:/ftproot/我是中文的语言.txt"
  ////var f = req.params[0];
  //f = path.resolve(f);
  //console.log('Download file: %s', f);
  //res.download(f);

  //第二种方式
  try{
    var path='app.apk';
    var f = fs.createReadStream(path);
    const fileName = encodeURIComponent('净音.apk') // 需要先转码才行
    res.writeHead(200, {
      'Content-Type': 'application/force-download',
      'Content-Disposition': `attachment; filename=${fileName}`
    });
    f.pipe(res);
  }catch(error){
    console.log(error)
  }
  
});

//统计下载量
router.get('/statistics',async (req, res, next)=>{
    try {
        const result = await Statistics.update({
            count:Sequelize.literal('count+1')
        },{where:{name:'download'}})
        res.send(normalRes({data:result}))
    } catch (error) {
        res.send(error)
    }
})

router.get('/getStatis',async(req,res,next)=>{
  try {
    const result = await Statistics.findOne({where:{
      name:'download'
    }})
    res.send(normalRes({data:result.count}))
} catch (error) {
    res.send(error)
}
})

let singleUpload = upload.single('singleFile');
router.post('/fileUpload',(req,res)=>{
  singleUpload(req,res,async (err)=>{
    console.log(req.file)
      if(!!err){
          console.log(err.message)
          res.json({
              code: '2000',
              type:'single',
              originalname: '',
              msg: err.message
          })
          return;
      }
      if(!!req.file){
        try {
          const result = await Statistics.update({
              count:req.body.version
          },{where:{name:'version'}})
          res.send(normalRes({data:result}))
        } catch (error) {
            res.send(error)
        }
      } else {
          res.json({
              code: '1000',
              type:'single',
              originalname: '',
              msg: ''
          })
      }
  });
});



module.exports = router;
