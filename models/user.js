// 모듈 불러오기
var mongoose = require('mongoose');
var moment = require('moment-timezone');
// mongoose.Schema를 통해 스키마 활성화
var Schema = mongoose.Schema;

// auto-increment를 require 해준 후 연결된 Mongoose connection을 이용하여 초기화시켜준다.
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);

// 시간대를 서울로 설정 및 포맷 변환
moment.tz.setDefault("Asia/Seoul");
var date = moment().format('YYYY-MM-DD HH:mm:ss');

var userSchema = new Schema({
        user_id:{
            type: Number,
            required: true
        },
        name:{
            type: String,
            required: true
        },
        email:{
            type: String,
            required: true,
            // unique: true
        },
        password:{
            type: String,
            required: true
        },
        create_date:{
            type: String,
            default: date
        }
})
userSchema.plugin(autoIncrement.plugin, {
    model:'User',
    field:'user_id',
    startAt:1,
    increment:1
})

// user 스키마를 모델로 만들어 내보내기
module.exports = mongoose.model('User', userSchema);