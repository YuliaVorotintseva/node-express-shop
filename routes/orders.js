const {Router} = require('express')
const auth = require('../middleware/auth')
const Order = require('../models/Order')

const router = Router()

router.get('/', auth, async (request, response) => {
    try {
        const orders = await Order.find({'user.userId': request.user._id}).populate('user.userId')
        response.render('orders', {
            isOrder: true,
            title: 'Orders',
            orders: orders.map(order => ({
                ...order._doc,
                price: order.courses.reduce((total, cs) => total += cs.count*cs.course.price, 0)
            }))
        })
    } catch(e) {
        console.log(e)
    }
})

router.post('/', auth, async (request, response) => {
    try {
        const user = await request.user.populate('cart.items.courseId').execPopulate()

        const courses = user.cart.items.map(c => ({
            count: c.count,
            course: {...c.courseId._doc}
        }))

        const order = new Order({
            user: {
                name: user.name,
                userId: user
            },
            courses
        })

        await order.save()
        await request.user.clearCart()

        response.redirect('/orders')
    } catch(e) {
        console.log(e)
    }
})

module.exports = router
