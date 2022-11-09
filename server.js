const express = require("express");
const mongoose = require("mongoose");
const cluster = require("cluster");
const totalCPUs = require("os").cpus().length;
const cors = require("cors");
require("dotenv").config();
const course = require("./routes/courseRoute");
const admin = require("./routes/adminRoute");
const auth = require("./routes/authRoute");
const user = require("./routes/userRoute");
const product = require("./routes/productRoute");
const job = require("./routes/jobRoute");
const skill = require("./routes/skillRoute");
const education = require("./routes/educationRoute");
const resetPassword = require("./routes/passwordResetRoute");
const experience = require("./routes/experienceRoute");
const company = require("./routes/companyRoute");
const session = require('express-session');
const redis = require('redis');
const connectRedis = require('connect-redis');
const db = process.env.mongoURI;

const app = express();
app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
  res.status(200).send("connected well");
  console.log(
    `Worker  process Id -${cluster.worker.process.pid} has accepted the request`
  );
});

app.use("/course", course);
app.use("/admin", admin);
app.use("/auth", auth);
app.use("/user", user);
app.use("/product", product);
app.use("/job", job);
app.use("/skill", skill);
app.use("/education", education);
app.use("/experience", experience);
app.use("/reset-password", resetPassword);
app.use("/company", company);
const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`server is running port ${port}`));

mongoose
  .connect(db)
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

  const RedisStore = connectRedis(session)
//Configure redis client
const redisClient = redis.createClient({
    host: 'localhost',
    port: 6379
})
redisClient.on('error', function (err) {
    console.log('Could not establish a connection with redis. ' + err);
});
redisClient.on('connect', function () {
    console.log('Connected to redis successfully');
});

//const whitelist = ["http://localhost:3000", "https://kimlearn.netlify.app/"];

// const corsOptions = {
//   origin: function (origin, callback) {
//     if (!origin || whitelist.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },

//   credentials: true,
// };
