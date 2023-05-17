const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema(
    {
        question_id: {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Questions'
        },
        answer : {type : String, required : true},
        createdAt : {type : Date, default : Date.now},
        user : Object,
        comment_id : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Comments'
        }
    },
    {
        versionKey:false
    }
)

const AnswerModel = mongoose.model('Answers',answerSchema);

module.exports = AnswerModel;