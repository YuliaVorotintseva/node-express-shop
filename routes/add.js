const {Router} = require('express')
const router = Router()

router.get('/', (request, response) => {
    response.render('add', {
        title: 'Add course',
        isAdd: true
    })
})

module.exports(router)
