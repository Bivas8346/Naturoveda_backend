const express = require('express');
const cookieparser = require('cookie-parser');
const connectflash = require('connect-flash');
const exsession = require('express-session');
const body_parser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()
app.use(express.urlencoded({ extended: true }))

app.set('view engine', 'ejs')
app.set('views', 'views');

app.use(exsession({
    cookie: {
        maxAge: 60000
    },
    secret: "shirshendu1234",
    resave: false,
    saveUninitialized: false
}));

app.use(cookieparser());
app.use(connectflash());
app.use(body_parser.urlencoded({extended:true}))
app.use(body_parser.json())
app.use(express.static('Public'))

app.use('/image', express.static(__dirname + '/Image'));

app.use(cors())

const AdminAuth = require('./Middleware/adminAuth')
app.use(AdminAuth.jwAuth)
const Router = require('./Router/adminRouter');
app.use(Router)

const ApiRouter = require('./Router/apirouter');
app.use('/api',ApiRouter)

data = 'mongodb+srv://rajdasrd8346:gyc4uEoZBZ1jg8d9@cluster0.ujxgdoi.mongodb.net/Natureveda';
const port = process.env.PORT || 2656
mongoose.connect(data, { useNewUrlParser: true, useUnifiedTopology: true })
.then(res=>{
    app.listen(port,()=>{
        console.log(`http://localhost:${port}`);
        console.log(`data base connected successfully`);
    })
}).catch(err=>{
    console.log(err);
})