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
    const course = new Course({
        title: request.body.title,
        price: request.body.price,
        img: request.body.img
    })

    try {
        await course.save()
        response.redirect('/courses')
    } catch(e) {
        console.log(e)
    }
})

module.exports = router
