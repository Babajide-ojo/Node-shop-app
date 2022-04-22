const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const course = require('./routes/courseRoute')
const admin = require('./routes/adminRoute')
const auth = require('./routes/authRoute')

const app = express()
app.use(express.json())
const db = process.env.mongoURI
//console.log(db);
//connect to Mongodb

const whitelist = ['http://localhost:3000', 'https://kimlearn.netlify.app/']

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },

  credentials: true,
}

app.use(cors(corsOptions))


mongoose
  .connect(db)
  .then(() => console.log('MongoDB Connected...'))
  .catch((err) => console.log(err))

// mongoose.set('debug' , true)
//use route
app.get("/", (req, res) => {
  res.status(200).send("connected well");
});

app.use('/course', course)
app.use('/admin', admin)
app.use('/auth', auth)
const port = process.env.PORT || 8000

app.listen(port, () => console.log(`server is running port ${port}`))
