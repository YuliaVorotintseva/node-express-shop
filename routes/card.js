const {Router} = require('express')
const router = Router()
const Card = require('../models/Card')
const Course = require('../models/Course')

router.post('/add', async (request, response) => {
    const course = await Course.getCourseById(request.body.id)
    await Card.add(course)
    response.redirect('/card')
})

router.get('/', async (request, response) => {
    const card = await Card.fetch()
    response.render('card', {
        title: 'Card',
        isCard: true,
        courses: card.courses,
        price: card.price
    })
})

router.delete('/remove/:id', async (request, response) => {
    const card = await Card.delete(request.params.id)
    response.status(200).json(card)
})

module.exports = router
