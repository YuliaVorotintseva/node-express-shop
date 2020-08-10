const {Router} = require('express')
const {validationResult} = require('express-validator')
const {courseValidators} = require('../utils/validators')
const auth = require('../middleware/auth')
const Course = require('../models/Course')

const router = Router()

router.get('/', async (request, response) => {
    try {
        const courses = await Course.find().populate('userId', 'name email')
        response.render('courses', {
            title: 'Courses',
            isCourses: true,
            userId: request.user ? request.user._id : null,
            courses
        })
    } catch(error) {
        console.log(error)
    }
})

router.get('/:id', async (request, response) => {
    const course = await Course.findById(request.params.id)
    response.render('course', {
        layout: 'empty',
        title: `Course ${course.title}`,
        course
    })
})

router.get('/:id/edit', auth, async (request, response) => {
    if(!request.query.allow) return response.redirect('/')

    try {
        const course = await Course.findById(request.params.id)
        if(course.userId.toString() !== request.user._id.toString()) response.redirect('/courses')

        response.render('edit', {
            title: `Edit course ${course.title}`,
            course,
            error: request.flash('error')
        })
    } catch(error) {
        console.log(error)
    }
})

router.post('/edit', auth, courseValidators, async (request, response) => {
    const {id} = request.body
    delete request.body.id

    const errors = validationResult(request)
    if(!errors.isEmpty()) {
        request.flash('error', errors.array()[0].msg.toString())
        return response.status(422).redirect(`/courses/${id}/edit?allow=true`)
    }

    try {
        const course = await Course.findById(id)
        if(course.userId.toString() !== request.user._id.toString()) response.redirect('/courses')

        const toChange = {...request.body}
        toChange.img = request.files ? request.files.img[0].path : null

        Object.assign(course, toChange)
        await course.save()
        response.redirect('/courses')
    } catch(e) {
        console.log(e)
    }  
})

router.post('/remove', auth, async (request, response) => {
    try {
        await Course.deleteOne({
            _id: request.body.id,
            userId: request.user._id
        })
        response.redirect('/courses')
    } catch(e) {
        console.log(e)
    }
})

module.exports = router
