const {Router} = require('express')
const auth = require('../middleware/auth')

const Course = require('../models/Course')

const router = Router()

const mapCartItems = items => items.map(c => ({
    ...c.courseId._doc,
    id: c.courseId.id,
    count: c.count
}))

const computeTotalPrice = courses => courses.reduce((total, course) => total += course.price*course.count, 0)

router.post('/add', auth, async (request, response) => {
    const course = await Course.findById(request.body.id)
    await request.user.addToCart(course)
    response.redirect('/card')
})

router.get('/', auth, async (request, response) => {
    const user = await request.user.populate('cart.items.courseId').execPopulate()
    const courses = mapCartItems(user.cart.items)

    response.render('card', {
        title: 'Card',
        isCard: true,
        courses: courses,
        price: computeTotalPrice(courses)
    })
})

router.delete('/remove/:id', auth, async (request, response) => {
    await request.user.removeFromCart(request.params.id)
    const user = await request.user.populate('cart.items.courseId').execPopulate()
    const courses = mapCartItems(user.cart.items)

    response.status(200).json({
        courses,
        price: computeTotalPrice(courses)
    })
})

module.exports = router
