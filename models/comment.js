// 모듈 불러오기
var mongoose = require('mongoose');

// mongoose.Schema를 통해 스키마 활성화
var Schema = mongoose.Schema;

// comment 스키마 속성 설정
var commentSchema = new Schema({
        comment_id:{
            type: Number,
            required: true
        },
        user_id:{
            type: String,
            required: true
        },
        user_name:{
            type: String,
            required: true
        },
        content_id:{
            type: Number,
            required: true
        },
        context:{
            type: String,
            required: true
        },
        created_at:{type:Date, default:Date.now}
    })
    
// comment 스키마를 모델로 만들어 내보내기
module.exports = mongoose.model('Comment', commentSchema);