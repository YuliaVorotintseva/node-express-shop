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

module.exports = router
