require("dotenv").config();


const dbconnect  = {
    port: process.env.port || 3001,
    url: process.env.DATABASE_URL,

}

module.exports = dbconnect;