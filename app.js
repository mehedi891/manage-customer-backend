const express = require('express');
const cors = require('cors');
const clientRouter = require('./routes/client.route');
const summaryRouter = require('./routes/summary.route');
const userRouter = require('./routes/user.route');



const app = express();
app.use(cors());
app.use(express.urlencoded({extended:false}));
app.use(express.json());


app.use('/api/client',clientRouter);
app.use('/api/summary',summaryRouter);
app.use('/api/user',userRouter);


app.get('/',(req,res)=>{
  res.status(200).json({
    message: 'server is running'
  })
});

app.use((req,res,next)=>{
    res.status(404).json({
        message: "Path/Route not found"
    });

});

app.use((error,req,res,next)=>{
    res.status(500).json({
        message: 'Something/server broke'
    });
});



module.exports = app;