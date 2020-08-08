const {Router} = require('express')
const auth = require('../middleware/auth')
const User = require('../models/User')

const router = Router()

router.get('/', auth, (request, response) => {
    response.render('profile', {
        title: 'Profile',
        isProfile: true,
        user: request.user.toObject()
    })
})

router.post('/', auth, async (request, response) => {
    try {
        const user = await User.findById(request.user._id)
        const toChange = {name: request.body.name}

        if(request.file) toChange.avatar = request.file.path

        Object.assign(user, toChange)
        await user.save()
        response.redirect('/profile')
    } catch(error) {
        console.log(error)
    }
})

module.exports = router
