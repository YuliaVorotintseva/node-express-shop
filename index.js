const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')

const app = express()
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
})
//регистрация модуля hbs как движок для рендеринга страниц
app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.get('/', (request, response) => {
    response.render('index')
})
app.get('/about', (request, response) => {
    response.render('about')
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
