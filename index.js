const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')
const home = require('./routes/home')
const courses = require('./routes/courses')
const add = require('./routes/add')
const card = require('./routes/card')

const app = express()
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
})
//регистрация модуля hbs как движок для рендеринга страниц
app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')
//регистрация папки public как публичной статической
app.use(express.static(path.join(__dirname, 'public')))

app.use(express.urlencoded({extended: true}))

app.use('/', home)
app.use('/courses', courses)
app.use('/add', add)
app.use('/card', card)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
