const express = require('express')
const router = express.Router()
const parser = require('../config/upload')
const jobController = require('../controllers/jobController')
const auth = require('../middleware/authAdmin')

router.post(
  '/create',
  parser.fields([
    { name: 'image_url', maxCount: 1 },
  ]),
  jobController.createJob,
)

router.get('/all', jobController.getAllJobs);

router.get('/single', jobController.getJobById);

router.get('/category', jobController.getJobByCategory);

module.exports = router