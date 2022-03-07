// 모듈 불러오기
var mongoose = require('mongoose');
var moment = require('moment-timezone');

// mongoose.Schema를 통해 스키마 활성화
var Schema = mongoose.Schema;

// 시간대를 서울로 설정 및 포맷 변환
moment.tz.setDefault("Asia/Seoul");
var date = moment().format('YYYY-MM-DD HH:mm:ss');

var contentSchema = new Schema({
        content_id:{
            type: Number,
            required: true
        },
        user_id:{
            type: String,
            required: true,
        },
        user_name:{
            type: String,
            required: true
        },
        title:{
            type: String,
            required: true
        },
        context:{
            type: String,
            required: true
        },
        created_at:{
            type: String,
            default: date
        }
    })

// content 스키마를 모델로 만들어 내보내기
module.exports = mongoose.model('Content', contentSchema);