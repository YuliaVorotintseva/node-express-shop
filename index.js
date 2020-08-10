const express = require('express')
const mongoose = require('mongoose')
const helmet = require('helmet')
const csrf = require('csurf')
const flash = require('connect-flash')
const compression = require('compression')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const path = require('path')
const handlebars = require('handlebars')
const exphbs = require('express-handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const keys = require('./keys')

const app = express()

const hbs = exphbs.create({
    handlebars: allowInsecurePrototypeAccess(handlebars),
    defaultLayout: 'main',
    helpers: require('./utils/hbs-helpers'),
    extname: 'hbs'
})

const store = new MongoStore({
    collection: 'sessions',
    uri: keys.MONGODB_URI
})

//регистрация модуля hbs как движок для рендеринга страниц
app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

//регистрация папки public как публичной статической
app.use(express.static(path.join(__dirname, 'public')))
app.use('/images', express.static(path.join(__dirname, 'images')))

app.use(express.urlencoded({extended: true}))
app.use(session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store
}))

app.use(require('./middleware/file'))
app.use(csrf())
app.use(flash())
app.use(helmet())
app.use(compression())
app.use(require('./middleware/variables'))
app.use(require('./middleware/user'))

app.use('/', require('./routes/home'))
app.use('/profile', require('./routes/profile'))
app.use('/courses', require('./routes/courses'))
app.use('/add', require('./routes/add'))
app.use('/card', require('./routes/card'))
app.use('/orders', require('./routes/orders'))
app.use('/auth', require('./routes/auth'))

app.use(require('./middleware/error'))

mongoose.set('useNewUrlParser', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
mongoose.set('useUnifiedTopology', true)

async function start() {
    try {
        await mongoose.connect(keys.MONGODB_URI)

        const PORT = process.env.PORT || 3000
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    } catch(e) {
        console.log(e)
    }
}
start()
