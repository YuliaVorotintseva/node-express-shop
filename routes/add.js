const {Router} = require('express')
const router = Router()
const Course = require('../models/Course')

router.get('/', (request, response) => {
    response.render('add', {
        title: 'Add course',
        isAdd: true
    })
})

router.post('/', async (request, response) => {
    const course = new Course(request.body.title, request.body.price, request.body.img)
    await course.save()
    response.redirect('/courses')
})

module.exports = router
