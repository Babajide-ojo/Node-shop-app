const express = require('express')
const router = express.Router()
const parser = require('../config/upload')
const courseController = require('../controllers/courseController')
const auth = require('../middleware/authAdmin')

router.post(
  '/create',
  parser.fields([
    { name: 'video_url', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 },
  ]),
  courseController.createCourse,
)

router.get('/viewAllCourses', courseController.getAllCourses);

router.get('/singlecourse', courseController.getSingleCourse);

module.exports = router
