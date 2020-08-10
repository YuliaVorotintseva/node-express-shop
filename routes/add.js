const {Router} = require('express')
const {validationResult} = require('express-validator')
const multer = require('../middleware/file')
const {courseValidators} = require('../utils/validators')
const auth = require('../middleware/auth')
const Course = require('../models/Course')

const router = Router()

router.get('/', auth, (request, response) => {
    response.render('add', {
        title: 'Add course',
        isAdd: true
    })
})

router.post('/', auth, courseValidators, async (request, response) => {
    const errors = validationResult(request)
    if(!errors.isEmpty()) {
        response.status(422).render('add', {
            title: 'Add course',
            isAdd: true,
            error: errors.array()[0].msg,
            data: {
                title: request.body.title,
                price: request.body.price,
                img: request.files ? request.files.img[0].path : null
            }
        })
    }

    const course = new Course({
        title: request.body.title,
        price: request.body.price,
        img: request.files ? request.files.img[0].path : null,
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
