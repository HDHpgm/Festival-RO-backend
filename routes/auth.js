// localhost:3000/api/auth/ ~~~ 로 요청이 들어오면 라우팅되는 js파일
var express = require('express');
var router = express.Router();
var {body, validationResult} = require('express-validator');
var User = require('../models/user'); // 유저 스키마
var jwt = require('jsonwebtoken'); // 로그인 유지를 위해 jwt 토큰을 사용해야 함


// 회원가입 요청이 들어오면 실행되는 코드
router.post('/SignUp',
    body('email').isEmail().withMessage('메일 형식으로 입력해주세요')  // 메일이 메일형식이 아닌것으로 들어오면
    .custom((value) => { //custom을 달아서
                        // 유저 이메일 존재하는지 체크
        return User.findOne({ email: value}).then((userDoc) => {
            // 이메일을 검색해서 데이터가 나오면 존재하는 것이기 때문에 오류 리턴
            if(userDoc){
                return Promise.reject('이미 존재하는 Email 입니다.');
            }
        });
    }),
    body('password').trim().isLength({min:4}).withMessage('비밀번호를 4자 이상 입력해주세요'), // 비밀번호 4자 미만 입력 시
    body('name').trim().not().isEmpty().withMessage('이름을 입력해주세요') // 이름 입력 안했을 시
 , async (req, res, next) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){ // 위에서 발생한 에러를 캐치해서 비어있지 않으면
        const error = new Error('failed');
        error.statusCode = 400;
        return res.status(error.statusCode).json({ // 에러 메세지 리턴
            message: "이미 존재하는 이메일입니다.",
            result:0
        });
    }
    // 에러가 없으면 데이터 받아오기
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    // 유저 데이터 저장
    // 스키마 생성해서 값을 치환
        const user = new User({
            email,
            password,
            name
        });
        // save로 user 저장
        const result = await user.save(() =>{
            return res.status(201).json({
                message: "회원가입이 완료되었습니다.",
                result:1
            });
        }); //db에 저장
});

// 로그인 요청이 들어온다면 코드 실행
router.post('/SignIn', (req, res, next) =>{
    // 유저가 입력한 email, password 데이터 받아오기
    console.log(req.body);
    const email = req.body.email;
    const password = req.body.password;

    // 받아온 정보로 findOne 실행한 후에 
    User.findOne({email: email, password: password}, (err, user) => {
        if(err){ // 에러 발생
            return res.status(500).json({message: '오류'});
        }
        if(!user){ // 검색 결과가 없다면
            return res.status(404).json({message: "Email과 password를 확인하세요"});
        }

        // 유저를 찾는다면 로그인 유지를 시켜주기 위해 jwt 토큰 발행해서 전달
        let token = jwt.sign({ userId: user._id}, 'secretkey');
        return res.status(200).json({
            message: '로그인 성공',
            token: token
        });
    });
});


// 유저 정보 요청시에 코드 실행
router.get('/user', (req, res, next) => {
    // 정보를 요청하려면 유저 토큰이 있을때 vue에서 요청을 하게되는데
    // 그 토큰을 받아온다.
    let token = req.headers.token; //토큰

    // 받아온 토큰을 decode
    jwt.verify(token, 'secretkey', (err, decoded) => {
        if(err) return res.status(401).json({
            title:'unauthorized'
        });
        // _id를 토큰으로 암호화해 사용했던것을 해석해서 다시 _id로 만들어 유저를 찾는다.
        User.findOne({_id:decoded.userId}, (err, user) => {
            if(err) return console.log(err);
            return res.status(200).json({ // 유저 존재한다면 정보를 전송
                title:'user grabbed',
                user:{
                    user_id: user.user_id,
                    email: user.email,
                    name: user.name,
                    isHidden : 'true'
                }
            });
        });
    });
});

module.exports = router;