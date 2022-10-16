import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser"
import bodyParser from "body-parser"

//self defined routes
import api_routes from './routes/api.js'
import auth_routes from "./routes/auth.js";


var app = express();

app.use(express.static('./public'))
    .use(cors())
    .use(cookieParser())
    .use(bodyParser.urlencoded({extended: false}))
    .use(bodyParser.json())
    .use('/api', api_routes)
    .use('/auth', auth_routes)


console.log('Listening on 8888');
app.listen(8888);