// 모듈 불러오기
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var os = require('os');
const formData = require("express-form-data");

// router 설정파일 호출
var indexRouter = require('./routes/index'); 
var authRouter = require('./routes/auth');   
var boardRouter = require('./routes/board'); 


var app = express();
app.use(require('connect-history-api-fallback')());

// 뷰 엔진 설정 - express에서 사용할 템플릿 엔진을 설정합니다.
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// 요청에 대한 정보를 콘솔에 기록해준다.
app.use(logger('dev'));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const options = {
  uploadDir: os.tmpdir(),
  autoClean: true
};

// connect-multiparty로 데이터를 구문 분석합니다. 
app.use(formData.parse(options));
// 요청에서 모든 빈 파일을 삭제합니다 (size == 0) 
app.use(formData.format());
// 파일 객체를 fs.ReadStream app으로 변경합니다.
app.use(formData.stream());
// 본문과 파일 앱을 결합합니다 .
app.use(formData.union());

//앱에 설정한 라우터 모듈을 사용할 수 있게 적용
app.use('/', indexRouter);
app.use('/api/auth', authRouter);
app.use('/api/board', boardRouter);


// 등록되지 않은 path로 요청이 왔으면 404 페이지를 만들어야함.
// http-errors 모듈로 error 객체 생성 후 에러 처리 핸들러로 넘김
app.use(function(req, res, next) {
  next(createError(404));
});

// 에러 처리 핸들러
app.use(function(err, req, res, next) {
  // error 템플릿에 전달할 데이터 설정
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;