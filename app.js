var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressJwt = require('express-jwt');
var ipVertify = require('./unit/tokenVertify')


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var searchRouter = require('./routes/search')
var addRouter = require('./routes/add')
var playRouter = require('./routes/play')
const { Console } = require('console');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
  res.setHeader('Access-Control-Expose-Headers', 'Authorization')
  next();
});

// app.use(expressJwt({
//   secret: 'pure_music',  // 签名的密钥
//   algorithms: ["HS256"] // 设置算法
//   }).unless({
//     path: ['/users/login', '/users/addNewUser', '/users/modifyUser']  // 不经过 Token 解析的路径
//   })
// )





app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/search', searchRouter);
app.use('/add', addRouter);
app.use('/play', playRouter);





// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // 根据错误信息判断是否是未登录直接访问
  if (err.name === 'UnauthorizedError') {
    //  可以根据自己的业务逻辑来处理
    return res.status(403).send('登录过期');
  }
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('error');
});

module.exports = app;
