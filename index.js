const app = require('./app');
require('./config/db');
require("dotenv").config();
const PORT = process.env.port || 3001;


app.listen(PORT,()=>{
    console.log(`server is running at http://localhost/${PORT}`);
});

