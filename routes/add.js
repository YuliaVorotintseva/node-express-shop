const {Router} = require('express')
const auth = require('../middleware/auth')
const Course = require('../models/Course')

const router = Router()

router.get('/', auth, (request, response) => {
    response.render('add', {
        title: 'Add course',
        isAdd: true
    })
})

router.post('/', auth, async (request, response) => {
    const course = new Course({
        title: request.body.title,
        price: request.body.price,
        img: request.body.img,
        userId: request.user
    })

    try {
        await course.save()
        response.redirect('/courses')
    } catch(e) {
        console.log(e)
    }
})

module.exports = router
