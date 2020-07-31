const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const handlebars = require('handlebars')
const exphbs = require('express-handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')

const home = require('./routes/home')
const courses = require('./routes/courses')
const add = require('./routes/add')
const card = require('./routes/card')
const orders = require('./routes/orders')

const User = require('./models/User')

const app = express()
const hbs = exphbs.create({
    handlebars: allowInsecurePrototypeAccess(handlebars),
    defaultLayout: 'main',
    extname: 'hbs'
})
//регистрация модуля hbs как движок для рендеринга страниц
app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(async (request, response, next) => {
    try {
        const user = await User.findById('5f23b2963cbf86290d03b84d')
        request.user = user
        next()
    } catch(e) {
        console.log(e)
    }
})

//регистрация папки public как публичной статической
app.use(express.static(path.join(__dirname, 'public')))

app.use(express.urlencoded({extended: true}))
//Nlm0wT15qBBqhX0e
app.use('/', home)
app.use('/courses', courses)
app.use('/add', add)
app.use('/card', card)
app.use('/orders', orders)

mongoose.set('useNewUrlParser', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
mongoose.set('useUnifiedTopology', true)

async function start() {
    try {
        await mongoose.connect(
            'mongodb+srv://yulia:Nlm0wT15qBBqhX0e@cluster0.r0wf0.mongodb.net/node-express-shop?retryWrites=true&w=majority',
        )

        const candidate = await User.findOne()
        if(!candidate) {
            const user = new User({
                name: 'Yulia',
                email: 'yulia.vorotintseva@gmail.com',
                cart: {items: []}
            })
            await user.save()
        }

        const PORT = process.env.PORT || 3000
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    } catch(e) {
        console.log(e)
    }
}
start()
