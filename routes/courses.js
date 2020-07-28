const {Router} = require('express')
const router = Router()
const Course = require('../models/Course')

router.get('/', async (request, response) => {
    const courses = await Course.getAllCourses()
    response.render('courses', {
        title: 'Courses',
        isCourses: true,
        courses
    })
})

router.get('/:id', async (request, response) => {
    const course = await Course.getCourseById(request.params.id)
    response.render('course', {
        layout: 'empty',
        title: `Course ${course.title}`,
        course
    })
})

router.get('/:id/edit', async (request, response) => {
    if(!request.query.allow) return response.redirect('/')
    const course = await Course.getCourseById(request.params.id)
    response.render('edit', {
        title: `Edit course ${course.title}`,
        course
    })
})

router.post('/edit', async (request, response) => {
    await Course.update(request.body)
    response.redirect('/courses')
})

module.exports = router
