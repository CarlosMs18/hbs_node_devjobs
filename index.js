require('dotenv').config()
const express  = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const exphbs = require('express-handlebars')
const Handlebars = require('handlebars')
const mongoose = require('mongoose')
const flash = require('connect-flash')
const session = require('express-session')
const MongoStore = require('connect-mongo')



const passport = require('./config/passport')
const authRoutes = require('./routes/auth')
const adminRoutes = require('./routes/admin')
const vacantRoutes = require('./routes/vacantes')

const app = express()   

const store = new MongoStore({
    mongoUrl : process.env.MONGO_CNN,
    collectionName : 'sessions'
})


app.use(cors())

app.use(bodyParser.urlencoded({extended:true}))
app.engine('handlebars',exphbs.engine({
    handlebars :allowInsecurePrototypeAccess(Handlebars),
    defaultLayout : 'main',
    helpers : require('./helpers/handlebars')
 
}))  
app.set('view engine', 'handlebars')
app.use(express.static('public'))

app.use(
    session({
        secret : process.env.SECRET,
        key : process.env.KEY,
        resave : false,
        saveUninitialized : false,
        store
    })
)


app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

app.use((req, res , next) => {
    res.locals.mensajes = req.flash()
    next()
})



app.use('/auth',authRoutes)
app.use('/',adminRoutes)
app.use('/',vacantRoutes)
mongoose
    .connect(process.env.MONGO_CNN)
    .then(result =>{
        console.log('Conectado a la base de datos')
        app.listen(process.env.PORT, () => {
            console.log(`Corriendo desde el puerto ${process.env.PORT}`)
        })
    })
    .catch(err => {
        console.log(err)
    })
