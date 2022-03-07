var express = require('express');
var path = require('path');
var router = express.Router();

router.get('/', function (req, res, next) {
  // vue 프로젝트를 빌드해 결과물인 index.html을 backend에 포함시켰기 때문에 그 파일로 보냄
  res.sendFile(path.join(__dirname, '../public', 'index.html'))
});

module.exports = router;