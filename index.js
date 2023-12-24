const express = require('express')
const Router = require('./router')
const cors = require('cors')
const bodyParser = require("body-parser")
const mongoose = require("mongoose")

const port = process.env.PORT || 3030
const isDevelopment = process.env.NODE_ENV === 'development';
const dbConnectionString = isDevelopment
  ? 'mongodb://localhost:27017/noty'
  : 'mongodb+srv://Mityo-dev:LBeAQZkyTVbNZBGg@cluster0.oqka4jq.mongodb.net/noty';
//const cookieParser = require("cookie-parser")

const app = express();



app.use(cors({ origin: "*", credentials: true }));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

async function main(){
    mongoose.set('strictQuery', false)
    await mongoose.connect(dbConnectionString)
    console.log("DB connected...")
}
main().catch(err => console.log(err))

app.use(Router)


app.listen(port, ()=>{
    console.log(`Server is running on port ${port}...`)
})      