const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const CourseSchema = new Schema({
    course_title: {
        type: String
    },
    course_category: {
        type: String
    },
    course_overview: {
        type: String
    },
    video_url: 
    {
        type: String,
    },
    course_creator: 
    {
        type: String
    },
    thumbnail:{
        type: String
    },
    created_date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Course = mongoose.model('course', CourseSchema);