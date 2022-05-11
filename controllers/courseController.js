const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/authAdmin')

const Course = require('../models/course')

exports.createCourse = (req, res) => {
  let {course_title, course_category, course_overview, course_creator} = req.body

  let video_url = req.files.video_url[0].path;
  let thumbnail = req.files.thumbnail[0].path;

  console.log(video_url);
  //req body validation
  if (!course_title) {
    return res.status(400).json({ msg: 'Please enter the course title' })
  }
  if (!course_category) {
    return res.status(400).json({ msg: 'Please enter the course category' })
  }
  if (!course_overview) {
    return res.status(400).json({ msg: 'Please enter the course overview' })
  }
  if (!video_url) {
    return res.status(400).json({ msg: 'Please select a video' })
  }
  if(!course_creator) {
    return res.status(400).json({msg:'Please enter the name of the course creator'})
  }
  if(!thumbnail) {
    return res.status(400).json({msg:'Please select a thumbnail for this course'})
  }

    const newCourse = new Course({
      course_title,
      course_category,
      course_overview,
      video_url,
      course_creator,
      thumbnail
    })

    newCourse.save().then((course) =>{
       if(course) return  res.status(200).json({course:course})
    })
};

exports.getAllCourses = (req, res) => {
  Course.find().then((course) => res.json({ course }))
}

exports.getSingleCourse = ('/:id', (req, res) =>{
  var id = req.query.id;
  console.log(req.query)
 

  Course.findById(id).then((course) => res.json({course})).catch(err => console.log(err))
})