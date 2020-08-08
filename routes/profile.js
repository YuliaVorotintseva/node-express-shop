const {Router} = require('express')
const {validationResult} = require('express-validator')
const {profileValidators} = require('../utils/validators')
const auth = require('../middleware/auth')
const User = require('../models/User')

const router = Router()

router.get('/', auth, (request, response) => {
    response.render('profile', {
        title: 'Profile',
        isProfile: true,
        user: request.user.toObject(),
        error: request.flash('error')
    })
})

router.post('/', auth, profileValidators, async (request, response) => {
    try {
        const errors = validationResult(request)
        if(!errors.isEmpty()) {
            request.flash('error', errors.array()[0].msg)
            return response.status(422).redirect('/profile')
        }

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
