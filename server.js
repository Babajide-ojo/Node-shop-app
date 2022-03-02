const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config()

const customers = require('./routes/customerRoute');
const sellers = require('./routes/sellerRoute')

const app = express();
app.use(cors());
app.use(express.json())
const db = process.env.mongoURI;
//console.log(db);
//connect to Mongodb

mongoose
    .connect(db)
    .then(() => console.log('MongoDB Connected...'))
    .catch((err) => console.log(err));


 //use route

app.use('/customer' , customers)
app.use('/seller', sellers)

const port = process.env.PORT 

app.listen(port, () => console.log(`server is running port ${port}`));
