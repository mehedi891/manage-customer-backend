const dbconnect = require('./config');
const mongoose = require('mongoose');

const url = dbconnect.url;
mongoose.set('strictQuery', false);
mongoose.connect(url)
.then(()=>{
    console.log('Database is connected');
})
.catch((error)=>{
    console.log(error);
})


