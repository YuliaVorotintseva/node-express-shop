const {Router} = require('express')
const auth = require('../middleware/auth')
const Course = require('../models/Course')

const router = Router()

router.get('/', async (request, response) => {
    const courses = await Course.find().populate('userId', 'name email')
    response.render('courses', {
        title: 'Courses',
        isCourses: true,
        courses
    })
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
    const course = await Course.findById(request.params.id)
    response.render('edit', {
        title: `Edit course ${course.title}`,
        course
    })
})

router.post('/edit', auth, async (request, response) => {
    const {id} = request.body
    delete request.body.id
    try {
        await Course.findByIdAndUpdate(id, request.body)
        response.redirect('/courses')
    } catch(e) {
        console.log(e)
    }
})

router.post('/remove', auth, async (request, response) => {
    try {
        await Course.deleteOne({_id: request.body.id})
        response.redirect('/courses')
    } catch(e) {
        console.log(e)
    }
})

module.exports = router
