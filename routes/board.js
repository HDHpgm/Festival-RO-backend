// localhost:3000/api/board/ ~~~ 로 요청이 들어오면 라우팅되는 js파일
var express = require('express');
var router = express.Router();
var Content = require('../models/content'); // 게시글 스키마
var Comment = require('../models/comment'); // 댓글 스키마

// Board 페이지에 가면 자동으로 게시물 목록을 불러오기위해 요청들어오면  코드 실행
router.get('/', (req, res, next) => {//
        Content.find((err, contents) =>{  // 게시물을 전부 찾아서
            if(err) return console.log(err);
            res.status(200).json({ // 전송해줌
                title:'contents grabbed',
                contents
            });
        });
});

// 새 개시물을 쓸때 요청들어오면 코드 실행
router.post('/create', (req,res,next) => {
    const content_id = req.body.content_id
    const user_id = req.body.user_id
    const user_name = req.body.user_name
    const title = req.body.title
    const context = req.body.context
    // 전달받은 데이터를 content 스키마에 맞게 생성
    const content = new Content({
        content_id,
        user_id,
        user_name,
        title,
        context
    });
    // 게시물을 save
    const result = content.save(() =>{
        return res.status(201).json({ // 완료되면 메세지 전송
            message: "글 작성이 완료되었습니다.",
            result:1
        });
    }); //db에 저장
});

// 게시물 상세정보를 보기위해 요청이 들어오면 코드 실행
router.post('/detail', (req,res,next) => {
    const content_id = req.body.content_id
    // 전달받은 글 번호를 이용해 해당 게시물을 찾아서
    Content.findOne({content_id:content_id}, (err,content) =>{
        if(err){
            return res.status(500).json({message: '오류'});
        }
        return res.status(201).json({ // 응답으로 보내줌
            content
        });
    }); 
});

// 게시글 삭제 요청이 들어오면 코드 실행
router.post('/delete', (req,res,next) => {
    const content_id = req.body.content_id
    console.log(content_id)
    // 전달받은 글 번호를 이용해 해당 게시물을 delete
    Content.deleteOne({content_id:content_id}, (err) =>{
        if(err){
            return res.status(500).json({message: '삭제 오류'});
        }
        return res.status(201).json({ // 완료 메세지로 응답
            message: '삭제 완료'
        });
    }); 
});

// 게시물 수정 요청이 들어오면 코드 실행
router.post('/update', (req,res,next) => {
    const content_id = req.body.content_id
    console.log(content_id)
    // 해당 게시물 번호를 받아 나머지 정보들을 찾는다. (일단 수정하려면 그 글의 정보를 input form에 그대로 뿌려놔야 함)
    Content.findOne({content_id:content_id}, (err, content) =>{
        if(err){
            return res.status(500).json({message: '오류'});
        }
        return res.status(201).json({
            content
        });
    }); //db에서 해당 content 검색해서 보내줌
});

// 업데이트 화면에서 저장요청이 들어오면 코드 실행
router.post('/updateOne', (req,res,next) => {
    const content_id = req.body.content_id
    const update_title = req.body.updateObject_title
    const update_context = req.body.updateObject_context
    // 해당 글번호와 나머지 정보들을 받아서 그대로 해당 게시글을 update 시켜줌
    Content.updateOne({content_id:content_id},{title:update_title, context:update_context}, (err) =>{
        if(err){
            return res.status(500).json({message: '오류'});
        }
        return res.status(201).json({ // 메세지로 응답
            message:'수정 완료'
        });
    }); //db에서 업데이트할 값 찾아 업데이트 시켜줌
});

// 댓글을 보여주기 위해 요청들어오면 코드 실행
router.post('/comment', (req,res,next) => { // 댓글 가져오기
    const content_id = req.body.content_id
    console.log(content_id)
    // 해당 글 번호와 같은 댓글번호를 가진 댓글들만 모두 추출
    Comment.find({content_id:content_id}, (err, comments) =>{
        if(err){
            return res.status(500).json({message: '오류'});
        }
         return res.status(201).json({ // 응답으로 댓글들 보내줌
             comments
         });
    });
});

// 댓글 작성이 요청되면 코드 실행
router.post('/commentpush', (req,res,next) => { 
    // 해당 댓글을 쓴 유저 정보와 내용 등을 스키마로 생성
    const comment = new Comment({
        comment_id: req.body.comment_id,
        user_id: req.body.user_id,
        user_name: req.body.user_name,
        content_id: req.body.content_id,
        context: req.body.context
    });
    // 그대로 save 해줌
    const result = comment.save((err) =>{ // 댓글을 db에 저장
        if(err) 
        {
            console.log(err)
            return res.status(400).json({message: '오류발생'})
        }
        return res.status(201).json({ // 응답으로 메세지 전송
            message: "댓글 작성이 완료되었습니다.",
            result:1
        });
    }); 
});

module.exports = router;