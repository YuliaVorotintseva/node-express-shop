const express = require('express')
const mongoose = require('mongoose')
const csrf = require('csurf')
const flash = require('connect-flash')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const path = require('path')
const handlebars = require('handlebars')
const exphbs = require('express-handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')

const varMiddleware = require('./middleware/variables')
const userMiddleware = require('./middleware/user')

const home = require('./routes/home')
const courses = require('./routes/courses')
const add = require('./routes/add')
const card = require('./routes/card')
const orders = require('./routes/orders')
const auth = require('./routes/auth')

const MONGODB_URI = 'mongodb+srv://yulia:Nlm0wT15qBBqhX0e@cluster0.r0wf0.mongodb.net/node-express-shop?retryWrites=true&w=majority'

const app = express()

const hbs = exphbs.create({
    handlebars: allowInsecurePrototypeAccess(handlebars),
    defaultLayout: 'main',
    extname: 'hbs'
})

const store = new MongoStore({
    collection: 'sessions',
    uri: MONGODB_URI
})

//регистрация модуля hbs как движок для рендеринга страниц
app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

//регистрация папки public как публичной статической
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))
app.use(session({
    secret: 'secret value',
    resave: false,
    saveUninitialized: false,
    store
}))

app.use(csrf())
app.use(flash())
app.use(varMiddleware)
app.use(userMiddleware)

app.use('/', home)
app.use('/courses', courses)
app.use('/add', add)
app.use('/card', card)
app.use('/orders', orders)
app.use('/auth', auth)

mongoose.set('useNewUrlParser', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
mongoose.set('useUnifiedTopology', true)

async function start() {
    try {
        await mongoose.connect(MONGODB_URI)

        const PORT = process.env.PORT || 3000
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    } catch(e) {
        console.log(e)
    }
}
start()
