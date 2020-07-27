const express = require('express')
const exphbs = require('express-handlebars')
const home = require('./routes/home')
const courses = require('./routes/courses')
const add = require('./routes/add')

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
app.use(express.static('public'))

app.use('/', home)
app.use('/courses', courses)
app.use('/add', add)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
